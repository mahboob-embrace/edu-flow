import * as v from "valibot";

/**
 * Environment variable validation schema
 * Validates required environment variables at runtime
 */
const EnvSchema = v.object({
  // Database
  DATABASE_URL: v.pipe(v.string(), v.minLength(1, "DATABASE_URL is required")),

  // NextAuth
  AUTH_SECRET: v.pipe(
    v.string(),
    v.minLength(32, "AUTH_SECRET must be at least 32 characters"),
  ),

  // Optional: OAuth providers (only validate if provided)
  AUTH_GOOGLE_ID: v.optional(v.string()),
  AUTH_GOOGLE_SECRET: v.optional(v.string()),
  AUTH_FACEBOOK_ID: v.optional(v.string()),
  AUTH_FACEBOOK_SECRET: v.optional(v.string()),

  // Node environment
  NODE_ENV: v.optional(
    v.picklist(["development", "production", "test"]),
    "development",
  ),
});

export type Env = v.InferOutput<typeof EnvSchema>;

/**
 * Validated environment variables
 * Throws an error if validation fails
 */
function validateEnv(): Env {
  const result = v.safeParse(EnvSchema, process.env);

  if (!result.success) {
    const errors = result.issues
      .map(
        (issue) =>
          `  - ${issue.path?.map((p) => p.key).join(".")}: ${issue.message}`,
      )
      .join("\n");

    throw new Error(
      `❌ Invalid environment variables:\n${errors}\n\nPlease check your .env file.`,
    );
  }

  return result.output;
}

// Export validated env (lazy evaluation to avoid build-time errors)
let _env: Env | null = null;

export function getEnv(): Env {
  if (!_env) {
    _env = validateEnv();
  }
  return _env;
}

// For direct access (validate on first use)
export const env = new Proxy({} as Env, {
  get(_, prop: string) {
    return getEnv()[prop as keyof Env];
  },
});
