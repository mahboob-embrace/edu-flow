#!/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/home/azureuser/bin
# =============================================================================
# Database Table Backup Script
# Exports tables as CSVs, chunks large files, converts to Parquet, uploads to GDrive
# =============================================================================

# Database connection settings
DB_HOST="localhost"
DB_PORT="5432"
DB_USER="zmart"
DB_NAME="demodb"
PGPASSWORD='2AllInAll!'  # Set your database password here

# Backup directory settings
BACKUP_DIR="./db_backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FOLDER="${BACKUP_DIR}/backup_${TIMESTAMP}"

# Google Drive Settings
REMOTE_NAME="drive"           # The name you gave in rclone config
REMOTE_FOLDER="dev_data_backup"     # The folder name on your Google Drive
REMOTE_BACKUP_PATH="${REMOTE_FOLDER}/backup_${TIMESTAMP}"

# Chunk size for large CSV files (1GB)
CHUNK_SIZE_BYTES=$((1024 * 1024 * 1024))
CHUNK_SIZE_HUMAN="1G"

# CPU settings - use 50% of available cores (minimum 1)
TOTAL_CORES=$(nproc 2>/dev/null || echo 4)
PARALLEL_JOBS=$(( TOTAL_CORES / 2 ))
[ $PARALLEL_JOBS -lt 1 ] && PARALLEL_JOBS=1

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# =============================================================================
# Functions
# =============================================================================

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required commands exist
check_dependencies() {
    local missing=0
    
    if ! command -v psql &> /dev/null; then
        log_error "psql command not found. Please install PostgreSQL client."
        missing=1
    fi
    
    if ! command -v duckdb &> /dev/null; then
        log_error "duckdb command not found. Please install DuckDB (curl https://install.duckdb.org | sh)."
        missing=1
    fi
    
    if ! command -v rclone &> /dev/null; then
        log_error "rclone command not found. Please install rclone (sudo apt install rclone)."
        missing=1
    fi
    
    if [ $missing -eq 1 ]; then
        exit 1
    fi
}

# Get all table names from the database
get_tables() {
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c \
        "SELECT tablename FROM pg_tables WHERE schemaname = 'public';" 2>/dev/null | \
        sed 's/^[[:space:]]*//;s/[[:space:]]*$//' | \
        grep -v '^$'
}

# Convert a CSV file to Parquet using DuckDB with memory limits
convert_csv_to_parquet() {
    local csv_file=$1
    local parquet_file=$2
    local error_file="${parquet_file}.error"
    
    duckdb -c "
        SET memory_limit = '256MB';
        SET threads = 1;
        COPY (
            SELECT * FROM read_csv('${csv_file}', 
                auto_detect=true, 
                ignore_errors=true,
                parallel=false
            )
        ) TO '${parquet_file}' (
            FORMAT PARQUET, 
            COMPRESSION ZSTD,
            ROW_GROUP_SIZE 50000
        );
    " 2>"$error_file"
    
    local status=$?
    if [ $status -eq 0 ]; then
        rm -f "$error_file"
        return 0
    else
        return 1
    fi
}

# Export a single table: CSV → chunk if large → convert each chunk to Parquet
export_table() {
    local table_name=$1
    local csv_file="${BACKUP_FOLDER}/${table_name}.csv"
    local error_file="${BACKUP_FOLDER}/.${table_name}_error.log"
    local total_rows=0
    local parquet_count=0
    
    # Step 1: Export table to CSV
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c \
        "\COPY (SELECT * FROM ${table_name}) TO STDOUT WITH CSV HEADER" > "$csv_file" 2>"$error_file"
    
    if [ $? -ne 0 ] || [ ! -f "$csv_file" ]; then
        local error_msg=$(cat "$error_file" 2>/dev/null | head -1 | tr ':' '-')
        rm -f "$error_file" "$csv_file"
        echo "FAILED:${table_name}:${error_msg}"
        return
    fi
    
    # Step 2: Check file size and decide on chunking
    local csv_size=$(stat -c%s "$csv_file" 2>/dev/null || stat -f%z "$csv_file" 2>/dev/null)
    
    if [ "$csv_size" -le "$CHUNK_SIZE_BYTES" ]; then
        # Small file: convert directly to Parquet
        local parquet_file="${BACKUP_FOLDER}/${table_name}.parquet"
        
        if convert_csv_to_parquet "$csv_file" "$parquet_file"; then
            total_rows=$(duckdb -list -noheader -c "SELECT COUNT(*) FROM read_parquet('${parquet_file}');" 2>/dev/null | tr -d '[:space:]')
            parquet_count=1
            rm -f "$csv_file" "$error_file"
            echo "SUCCESS:${table_name}:${total_rows}:${parquet_count}"
        else
            local error_msg=$(cat "${parquet_file}.error" 2>/dev/null | head -1 | tr ':' '-')
            rm -f "$csv_file" "$error_file" "${parquet_file}.error"
            echo "FAILED:${table_name}:${error_msg}"
        fi
    else
        # Large file: split into chunks and convert each
        local chunk_dir="${BACKUP_FOLDER}/.${table_name}_chunks"
        mkdir -p "$chunk_dir"
        
        # Extract header
        local header=$(head -1 "$csv_file")
        
        # Split file (skip header, then add header to each chunk)
        tail -n +2 "$csv_file" | split --line-bytes="$CHUNK_SIZE_HUMAN" --numeric-suffixes=1 --additional-suffix=.csv - "${chunk_dir}/chunk_"
        
        # Process each chunk
        local chunk_num=0
        local all_success=1
        
        for chunk_file in "${chunk_dir}"/chunk_*.csv; do
            if [ -f "$chunk_file" ]; then
                chunk_num=$((chunk_num + 1))
                local chunk_with_header="${chunk_dir}/with_header_${chunk_num}.csv"
                local parquet_file="${BACKUP_FOLDER}/${table_name}_$(printf '%03d' $chunk_num).parquet"
                
                # Add header to chunk
                echo "$header" > "$chunk_with_header"
                cat "$chunk_file" >> "$chunk_with_header"
                rm -f "$chunk_file"
                
                # Convert to Parquet
                if convert_csv_to_parquet "$chunk_with_header" "$parquet_file"; then
                    local chunk_rows=$(duckdb -list -noheader -c "SELECT COUNT(*) FROM read_parquet('${parquet_file}');" 2>/dev/null | tr -d '[:space:]')
                    total_rows=$((total_rows + chunk_rows))
                    parquet_count=$((parquet_count + 1))
                else
                    all_success=0
                fi
                
                rm -f "$chunk_with_header"
            fi
        done
        
        # Cleanup
        rm -rf "$chunk_dir" "$csv_file" "$error_file"
        
        if [ $all_success -eq 1 ] && [ $parquet_count -gt 0 ]; then
            echo "SUCCESS:${table_name}:${total_rows}:${parquet_count}"
        else
            echo "FAILED:${table_name}:Some chunks failed to convert"
        fi
    fi
}

# Export function for xargs (needs to be accessible)
export -f export_table convert_csv_to_parquet log_info log_warn log_error
export DB_HOST DB_PORT DB_USER DB_NAME BACKUP_FOLDER PGPASSWORD CHUNK_SIZE_BYTES CHUNK_SIZE_HUMAN
export RED GREEN YELLOW NC

# Upload folder to Google Drive
sync_to_gdrive() {
    log_info "Uploading Parquet files to Google Drive..."
    log_info "  Remote path: ${REMOTE_NAME}:${REMOTE_BACKUP_PATH}"
    
    # Upload the entire backup folder
    rclone copy "$BACKUP_FOLDER" "${REMOTE_NAME}:${REMOTE_BACKUP_PATH}" --progress -v \
        --drive-chunk-size 128M \
        --tpslimit 5 \
        --bwlimit 10M \
        --low-level-retries 10
    
    if [ $? -eq 0 ]; then
        local file_count=$(ls -1 "$BACKUP_FOLDER"/*.parquet 2>/dev/null | wc -l)
        log_info "  ✓ Successfully uploaded ${file_count} Parquet files to Google Drive"
        # Remove local backup folder after successful upload
        rm -rf "$BACKUP_FOLDER"
        log_info "  ✓ Local backup folder removed"
    else
        log_error "  ✗ Google Drive upload failed"
        exit 1
    fi
}

# Delete backup folders older than 7 days from Google Drive
cleanup_old_backups() {
    log_info "Cleaning up backups older than 7 days from Google Drive..."
    
    # List directories and delete old ones
    rclone lsd "${REMOTE_NAME}:${REMOTE_FOLDER}" 2>/dev/null | while read -r line; do
        local dir_name=$(echo "$line" | awk '{print $NF}')
        if [[ $dir_name == backup_* ]]; then
            # Extract timestamp from folder name (backup_YYYYMMDD_HHMMSS)
            local dir_date=$(echo "$dir_name" | sed 's/backup_//' | cut -d_ -f1)
            local cutoff_date=$(date -d "7 days ago" +"%Y%m%d" 2>/dev/null || date -v-7d +"%Y%m%d" 2>/dev/null)
            
            if [ -n "$dir_date" ] && [ -n "$cutoff_date" ] && [ "$dir_date" -lt "$cutoff_date" ]; then
                log_info "  Deleting old backup: ${dir_name}"
                rclone purge "${REMOTE_NAME}:${REMOTE_FOLDER}/${dir_name}" 2>/dev/null
                if [ $? -eq 0 ]; then
                    log_info "    ✓ Deleted ${dir_name}"
                else
                    log_warn "    ⚠ Failed to delete ${dir_name}"
                fi
            fi
        fi
    done
    
    log_info "  ✓ Cleanup completed"
}

# =============================================================================
# Main Script
# =============================================================================

main() {
    log_info "Starting database backup..."
    log_info "Timestamp: ${TIMESTAMP}"
    log_info "Database: ${DB_NAME}@${DB_HOST}:${DB_PORT}"
    log_info "Chunk size for large tables: ${CHUNK_SIZE_HUMAN}"
    echo ""
    
    # Check dependencies
    check_dependencies
    
    # Create backup directory
    mkdir -p "$BACKUP_FOLDER"
    log_info "Backup folder: ${BACKUP_FOLDER}"
    echo ""
    
    # Get list of tables
    log_info "Fetching table list..."
    tables=$(get_tables)
    
    if [ -z "$tables" ]; then
        log_error "No tables found or could not connect to database."
        log_error "Please check your connection settings and ensure PGPASSWORD is set."
        rm -rf "$BACKUP_FOLDER"
        exit 1
    fi
    
    table_count=$(echo "$tables" | wc -l | tr -d ' ')
    log_info "Found ${table_count} tables to backup"
    log_info "Using ${PARALLEL_JOBS} parallel jobs (50% of ${TOTAL_CORES} cores)"
    echo ""
    
    # Export tables in parallel
    log_info "Exporting tables (CSV → Parquet)..."
    results=$(echo "$tables" | xargs -P "$PARALLEL_JOBS" -I {} bash -c 'export_table "$@"' _ {})
    
    # Count successes and failures
    success_count=$(echo "$results" | grep -c "^SUCCESS:" || echo 0)
    fail_count=$(echo "$results" | grep -c "^FAILED:" || echo 0)
    
    # Log results
    echo ""
    while IFS= read -r result; do
        if [[ $result == SUCCESS:* ]]; then
            table_name=$(echo "$result" | cut -d: -f2)
            row_count=$(echo "$result" | cut -d: -f3)
            parquet_count=$(echo "$result" | cut -d: -f4)
            if [ "$parquet_count" -gt 1 ]; then
                log_info "  ✓ ${table_name}: ${row_count} rows → ${parquet_count} Parquet files (chunked)"
            else
                log_info "  ✓ ${table_name}: ${row_count} rows → ${table_name}.parquet"
            fi
        elif [[ $result == FAILED:* ]]; then
            table_name=$(echo "$result" | cut -d: -f2)
            error_msg=$(echo "$result" | cut -d: -f3-)
            if [ -n "$error_msg" ]; then
                log_error "  ✗ ${table_name}: ${error_msg}"
            else
                log_error "  ✗ ${table_name}: Export failed"
            fi
        fi
    done <<< "$results"
    
    echo ""
    log_info "Export complete: ${success_count} succeeded, ${fail_count} failed"
    
    # Upload to Google Drive
    if [ $success_count -gt 0 ]; then
        echo ""
        sync_to_gdrive
        
        # Cleanup old backups from Google Drive
        cleanup_old_backups
    else
        log_error "No tables were exported successfully. Skipping upload."
        rm -rf "$BACKUP_FOLDER"
        exit 1
    fi
    
    echo ""
    log_info "========================================="
    log_info "Backup completed successfully!"
    log_info "Remote: ${REMOTE_NAME}:${REMOTE_BACKUP_PATH}"
    log_info "========================================="
}

# Run main function
main
