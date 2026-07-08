# WriteWise Agent

WriteWise Agent is an AI agent coding competition project based on the
[Prisma Next.js Auth Starter](https://github.com/prisma/nextjs-auth-starter).
Phase 1 bootstraps and rebrands the starter without replacing its core
application structure.

The current app keeps the starter's authentication flow, Prisma setup,
database-backed users, and basic post routes. The post model is being treated
as an early writing-sample surface for now; AI feedback, dashboards, and
training plans are planned future increments and are intentionally not
implemented in this phase.

## Reused Foundation

- Next.js App Router application structure
- NextAuth.js credentials authentication
- Prisma ORM and Prisma Postgres configuration
- User and post database models
- Register, login, sample listing, sample creation, and sample detail routes
- Setup screen for missing database tables

## Planned Original Increments

- AI-powered feedback for submitted writing samples
- Writing-quality rubric and scoring records
- Feedback history linked to authenticated users
- Learner dashboard for sample progress and revision activity
- Training-plan generation based on recurring writing issues
- Competition-focused agent logs and architecture decision records

## Local Setup

Install dependencies:

```bash
npm install
```

Create a local `.env` file from `.env.example`, then fill in local values:

```bash
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=YOUR_PRISMA_POSTGRES_API_KEY"
AUTH_SECRET="YOUR_RANDOM_AUTH_SECRET"
```

Do not commit real database URLs, API keys, or auth secrets.

Run database migrations:

```bash
npx prisma migrate dev --name init
```

Optionally seed starter data:

```bash
npx prisma db seed
```

Start the local app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Validation

Available project checks:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Phase validation results are recorded in
[`docs/agent-logs/01-bootstrap.md`](docs/agent-logs/01-bootstrap.md).
