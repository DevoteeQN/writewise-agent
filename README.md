# WriteWise Agent

WriteWise Agent is an AI agent coding competition project based on the
[Prisma Next.js Auth Starter](https://github.com/prisma/nextjs-auth-starter).

Phase 1 rebranded the starter. Phase 2 replaces the starter blog/post demo with
the first original writing-training increment: an authenticated writing prompt
bank, essay editor, and private essay history.

## Phase 2 Features

- Writing prompt bank with category, difficulty, target skill, word limit, and
  estimated completion time
- Essay editor for authenticated users
- Approximate word count and basic submission validation
- Essay history scoped to the current user
- Essay detail pages with prompt context
- Authenticated ownership checks so users cannot view another user's essays by
  guessing URLs
- Placeholder for Phase 3 AI structured feedback

## Reused Foundation

- Next.js App Router application structure
- NextAuth.js credentials authentication
- Prisma ORM and Prisma Postgres configuration
- Existing user registration and login flow
- Project build, lint, and seed tooling

## Planned Later Increments

- AI-powered structured feedback for submitted essays
- Feedback persistence linked to authenticated users
- Writing rubric, score, and issue taxonomy
- Learner dashboard for progress and revision activity
- Training-plan generation based on recurring writing issues

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

Apply the Phase 2 migration:

```bash
npx prisma migrate dev --name writing_core
```

Seed the prompt bank:

```bash
npx prisma db seed
```

Start the local app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Validation

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Phase 2 validation results are recorded in
[`docs/agent-logs/02-writing-core.md`](docs/agent-logs/02-writing-core.md).
