# WriteWise Agent

WriteWise Agent is an AI agent coding competition project based on the
[Prisma Next.js Auth Starter](https://github.com/prisma/nextjs-auth-starter).

Phase 1 rebranded the starter. Phase 2 replaced the starter blog/post demo with
the first original writing-training increment: an authenticated writing prompt
bank, essay editor, and private essay history. Phase 3 adds structured AI essay
feedback with a safe mock provider for local development. Phase 4 adds a
personalized 4-week training plan generated from saved AI feedback.

## Phase 2 Features

- Writing prompt bank with category, difficulty, target skill, word limit, and
  estimated completion time
- Essay editor for authenticated users
- Approximate word count and basic submission validation
- Essay history scoped to the current user
- Essay detail pages with prompt context
- Authenticated ownership checks so users cannot view another user's essays by
  guessing URLs

## Phase 3 Features

- AI structured feedback for submitted essays
- Rubric scores for task response, coherence, lexical range, and grammar
- Sentence-level feedback, improved version, weakness tags, and next exercise
- Deterministic mock provider when no real AI API key is configured
- Optional OpenAI-compatible provider through server-side environment variables
- Strict Zod validation before AI output is saved
- Prompt-injection mitigation using system instructions and essay delimiters

## Phase 4 Features

- Personalized 4-week training plan generation from the latest AI feedback
- Exactly 4 weeks with 5 practice days per week
- Plan progress tracking through completed and uncompleted tasks
- Deterministic mock plan provider for local demos
- Optional OpenAI-compatible plan provider through the existing AI environment
  variables
- Owner-only plan access and task updates
- Zod validation before generated plans are saved

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
AI_PROVIDER="mock"
OPENAI_API_KEY=""
AI_MODEL=""
```

Do not commit real database URLs, API keys, or auth secrets.

Apply the Phase 2 migration:

```bash
npx prisma migrate dev --name writing_core
```

Apply the Phase 3 migration:

```bash
npx prisma migrate dev --name ai_feedback
```

Apply the Phase 4 migration:

```bash
npx prisma migrate dev --name training_plan
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
Phase 3 validation results are recorded in
[`docs/agent-logs/03-ai-feedback.md`](docs/agent-logs/03-ai-feedback.md).
Phase 4 validation results are recorded in
[`docs/agent-logs/04-training-plan.md`](docs/agent-logs/04-training-plan.md).

## AI Safety

AI feedback is generated server-side. API keys are never exposed to client
components. The app defaults to `AI_PROVIDER=mock` when no provider is set, and
OpenAI-compatible feedback requires `OPENAI_API_KEY` on the server.

Provider output is validated with Zod before being stored. Essay content is
wrapped in clear delimiters and treated only as content to evaluate, not as
instructions. See [`SECURITY.md`](SECURITY.md) for details.

Training plans are generated from saved AI feedback, validated with Zod, stored
as structured records, and scoped to the authenticated owner for viewing and
task updates.
