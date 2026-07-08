# Agent Log 02: Writing Core Domain

## Date

2026-07-08

## Scope

Phase 2 replaces the starter blog/post demo with the first original WriteWise
Agent product increment: writing prompts, essay submission, and private essay
history.

## Changes

- Replaced the Prisma `Post` model with `WritingPrompt` and `Essay`.
- Added a User-to-Essay relation and WritingPrompt-to-Essay relation.
- Replaced demo blog seed data with 20 English writing prompts.
- Removed visible `/posts` blog routes and the posts API route.
- Removed the old unauthenticated `/users/new` starter demo route.
- Added authenticated `/dashboard`, `/prompts`, `/write/[promptId]`,
  `/essays`, and `/essays/[essayId]` pages.
- Added essay submission validation, approximate word count, and a max content
  length.
- Added ownership checks so essay lists and detail pages only read essays for
  the authenticated user.
- Added a Phase 3 placeholder for future AI structured feedback.
- Updated README for Phase 2.
- Added ADR-002 for the writing core domain decision.

## Files Touched

- `prisma/schema.prisma`
- `prisma/seed.ts`
- `prisma/migrations/20260708071250_init/migration.sql`
- `prisma/migrations/20260708072646_writing_core/migration.sql`
- `prisma/migrations/migration_lock.toml`
- `prisma/generated/*`
- `lib/session.ts`
- `lib/db-utils.ts`
- `app/Header.tsx`
- `app/layout.tsx`
- `app/page.tsx`
- `app/dashboard/page.tsx`
- `app/prompts/page.tsx`
- `app/write/[promptId]/actions.ts`
- `app/write/[promptId]/essay-form.tsx`
- `app/write/[promptId]/page.tsx`
- `app/essays/page.tsx`
- `app/essays/[essayId]/page.tsx`
- `app/setup/page.tsx`
- `app/setup/setup-steps.tsx`
- `app/login/page.tsx`
- `app/register/page.tsx`
- `app/api/posts/route.ts`
- `app/posts/page.tsx`
- `app/posts/new/actions.ts`
- `app/posts/new/page.tsx`
- `app/posts/[id]/page.tsx`
- `app/users/new/page.tsx`
- `eslint.config.mjs`
- `.gitignore`
- `.env.example`
- `package.json`
- `package-lock.json`
- `README.md`
- `docs/adr/ADR-002-writing-core-domain.md`
- `docs/agent-logs/02-writing-core.md`

## Commands Run

- `npm install`
- `npx prisma migrate dev --name writing_core`
- `npx prisma db seed`
- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`
- Started the local dev server with `npm run dev`
- Requested `http://localhost:3000`
- Requested `http://localhost:3000/prompts` without a session

## Validation

- `npm install`: Passed. Prisma client generated successfully. npm reported
  existing dependency audit findings: 25 vulnerabilities.
- `npx prisma migrate dev --name writing_core`: Initially failed because the
  local database had an applied `20260708071250_init` migration that was missing
  from the repository. Restored the missing starter init migration locally and
  reran the command.
- `npx prisma migrate dev --name writing_core`: Passed on rerun. Prisma created
  and applied `20260708072646_writing_core`.
- `npx prisma db seed`: Passed. Seeded 20 writing prompts.
- `npm run lint`: Passed.
- `npx tsc --noEmit`: Initially failed because stale `.next` route validator
  files still referenced removed `/posts` and `/users/new` routes. Removed the
  generated `.next` directory and reran the command.
- `npx tsc --noEmit`: Passed on rerun.
- `npm run build`: Initially failed for the same stale `.next` validator files.
  Passed after removing `.next`.
- Local dev server: Running at `http://localhost:3000`.
- Landing page smoke check: `http://localhost:3000` returned HTTP 200 and
  included `WriteWise Agent` and `Prompt Bank`.
- Protected route smoke check: unauthenticated request to `/prompts` returned
  HTTP 307 and redirected to `/login`.

## Known Limitations

- AI feedback is intentionally not implemented until Phase 3.
- No dashboard charts, training plans, scoring, or external AI API calls were
  added.
- Essay word count is approximate and based on whitespace-separated tokens.
- The restored `20260708071250_init` migration preserves the local migration
  history expected by the existing development database.
