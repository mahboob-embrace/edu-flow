# EduFlow

A Next.js 16 application with authentication, role-based access control, and PostgreSQL database.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Authentication**: Auth.js v5 (NextAuth.js)
- **Database**: PostgreSQL 16 + Prisma 6 ORM
- **Styling**: Tailwind CSS v4
- **Runtime**: Docker Compose for local development

## Prerequisites

- Node.js 20.9+
- pnpm (recommended) or npm/yarn
- Docker Desktop

## Getting Started

### 1. Clone and Install Dependencies

```bash
pnpm install
```

### 2. Environment Setup

Copy the example environment file:

```bash
cp .env.local .env
```

Or create a `.env` file with:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/eduflow?schema=public"
AUTH_SECRET="your-super-secret-key-generate-with-npx-auth-secret"
AUTH_URL="http://localhost:3000"
NEXTAUTH_URL="http://localhost:3000"
```

> **Tip**: Generate a secure AUTH_SECRET with: `npx auth secret`

### 3. Start Database

Start PostgreSQL and PGAdmin containers:

```bash
pnpm docker:up
```

**Container access:**

- PostgreSQL: `localhost:5432`
- PGAdmin: http://localhost:5050 (login: `admin@eduflow.com` / `admin`)

### 4. Run Database Migrations

```bash
pnpm db:migrate --name init
```

This will:

- Create the database schema
- Generate Prisma client
- Apply all migrations

### 5. Start Development Server

```bash
pnpm dev
```

Open http://localhost:3000 to see the application.

## Available Scripts

| Script             | Description                    |
| ------------------ | ------------------------------ |
| `pnpm dev`         | Start development server       |
| `pnpm build`       | Build for production           |
| `pnpm start`       | Start production server        |
| `pnpm lint`        | Run ESLint                     |
| `pnpm docker:up`   | Start Docker containers        |
| `pnpm docker:down` | Stop Docker containers         |
| `pnpm db:generate` | Generate Prisma client         |
| `pnpm db:migrate`  | Run database migrations        |
| `pnpm db:push`     | Push schema changes (dev only) |
| `pnpm db:studio`   | Open Prisma Studio             |

## Authentication

### Routes

| Route         | Description                         |
| ------------- | ----------------------------------- |
| `/sign-up`    | User registration                   |
| `/sign-in`    | User login                          |
| `/dashboard`  | Protected dashboard (requires auth) |
| `/api/auth/*` | NextAuth.js API routes              |

### Role-Based Access Control

The application includes 4 predefined roles with hierarchical permissions:

```
GUEST → USER → ADMIN → SUPER_ADMIN
```

| Role          | Description                          |
| ------------- | ------------------------------------ |
| `GUEST`       | Limited access                       |
| `USER`        | Standard user (default for sign-ups) |
| `ADMIN`       | Administrative features              |
| `SUPER_ADMIN` | Full system access                   |

## Database Schema

Key models in `prisma/schema.prisma`:

- **User** - User accounts with role assignment
- **Account** - OAuth provider accounts
- **Session** - User sessions
- **VerificationToken** - Email verification tokens

## Project Structure

```
edu-flow/
├── app/
│   ├── (auth)/           # Auth pages (sign-in, sign-up)
│   ├── (protected)/      # Protected routes (dashboard)
│   ├── actions/          # Server actions
│   └── api/auth/         # NextAuth API routes
├── components/           # React components
├── lib/                  # Utilities (prisma, rbac, auth-utils)
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── migrations/       # Migration files
├── types/                # TypeScript type definitions
├── auth.ts               # Auth.js configuration (server)
├── auth.config.ts        # Auth.js configuration (edge)
├── middleware.ts         # Route protection middleware
└── docker-compose.yml    # Docker services
```

## Deployment

### Environment Variables for Production

```env
DATABASE_URL="your-production-database-url"
AUTH_SECRET="generate-with-npx-auth-secret"
AUTH_URL="https://your-domain.com"
NEXTAUTH_URL="https://your-domain.com"
```

### Build and Deploy

```bash
pnpm build
pnpm start
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Auth.js Documentation](https://authjs.dev)
- [Prisma Documentation](https://www.prisma.io/docs)

## License

MIT
