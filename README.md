# WriteWise Agent

WriteWise Agent is an AI agent coding competition project based on the
[Prisma Next.js Auth Starter](https://github.com/prisma/nextjs-auth-starter).
The starter's auth and Prisma foundation are preserved, while the product
domain has been replaced with an AI-native writing coach.

## Competition Increments

- Phase 1: Bootstrap and rebrand from the Prisma starter.
- Phase 2: Writing core domain with prompt bank, essay editor, essay history,
  and authenticated ownership checks.
- Phase 3: Structured AI essay feedback with mock and optional
  OpenAI-compatible providers, Zod validation, and prompt-injection mitigation.
- Phase 4: Personalized 4-week training plans generated from saved AI feedback,
  with task completion tracking.
- Phase 5: Security hardening, rate limiting, tests, CI, and AI-native evidence
  documentation.

## Current Features

- Authenticated writing prompt bank
- Essay submission with input validation and approximate word count
- Private essay history and owner-only essay detail pages
- AI structured feedback with rubric scores, sentence feedback, improved
  version, weakness tags, and next exercise
- Deterministic mock AI provider for local development
- Optional OpenAI-compatible provider through server-side environment variables
- Personalized 4-week training plans with exactly 4 weeks x 5 practice days
- Plan task completion and simple persisted progress
- Server-side ownership checks for essays, feedback, plans, and plan items
- In-memory demo rate limiting for auth attempts and expensive AI actions

## Local Setup

Install dependencies:

```bash
npm install
```

Create a local `.env` file from `.env.example`, then fill in local values:

```bash
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=YOUR_PRISMA_POSTGRES_API_KEY"
AUTH_SECRET="YOUR_RANDOM_AUTH_SECRET"
AI_PROVIDER="mock"
OPENAI_API_KEY=""
AI_MODEL=""
```

Do not commit real database URLs, API keys, or auth secrets.

Apply migrations:

```bash
npx prisma migrate dev
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

## Useful Commands

```bash
npx prisma generate
npm run lint
npm run typecheck
npm run test
npm run build
```

`npm run build` runs `prisma migrate deploy` before `next build`, so it needs a
valid `DATABASE_URL`.

## Environment Variables

- `DATABASE_URL`: Prisma database connection string.
- `AUTH_SECRET` or `NEXTAUTH_SECRET`: Auth secret used by NextAuth.
- `AI_PROVIDER`: `mock` or `openai`; defaults to `mock` in server helpers.
- `OPENAI_API_KEY`: required only when `AI_PROVIDER=openai`.
- `AI_MODEL`: optional OpenAI-compatible model name; defaults server-side.

## CI

GitHub Actions workflow lives at `.github/workflows/ci.yml`. It runs on push and
pull request with a local PostgreSQL service and `AI_PROVIDER=mock`.

CI steps:

- Install dependencies
- Generate Prisma client
- Lint
- Typecheck
- Unit tests
- Build

CI does not require a real OpenAI API key.

## Security And Validation

See [`SECURITY.md`](SECURITY.md). The project uses server-side ownership
queries, shared essay validation, strict Zod schemas for AI outputs and training
plans, prompt-injection delimiters, safe error messages, and process-local rate
limiting for demo hardening.

## AI Agent Workflow

The project was built through a human-in-the-loop AI coding-agent workflow.
Codex implemented scoped phases, while humans reviewed, tested, and decided
what to keep. Agent logs in `docs/agent-logs` and architecture decision records
in `docs/adr` document the development trail. See
[`docs/AI_NATIVE_WORKFLOW.md`](docs/AI_NATIVE_WORKFLOW.md).
