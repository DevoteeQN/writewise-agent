# Agent Log 05: Security, Tests, And CI

## Date

2026-07-08

## Scope

Phase 5 hardens WriteWise Agent for competition evaluation without adding major
new product features.

## Changes

- Added shared essay input validation and word-count helper.
- Added process-local in-memory rate limiting.
- Added server-side environment validation helpers.
- Applied rate limits to AI feedback generation, training plan generation, and
  credentials auth attempts.
- Tightened positive integer validation for route/action ids.
- Added Vitest and focused unit tests.
- Added `typecheck` and `test` package scripts.
- Added GitHub Actions CI with PostgreSQL service and `AI_PROVIDER=mock`.
- Expanded `SECURITY.md`.
- Rewrote README with setup, env, commands, CI, and increment summary.
- Added AI-native workflow evidence documentation.
- Added ADR-005.

## Files Touched

- `package.json`
- `package-lock.json`
- `vitest.config.ts`
- `.github/workflows/ci.yml`
- `auth.ts`
- `app/write/[promptId]/actions.ts`
- `app/write/[promptId]/page.tsx`
- `app/essays/[essayId]/actions.ts`
- `app/essays/[essayId]/page.tsx`
- `app/plans/[planId]/actions.ts`
- `app/plans/[planId]/page.tsx`
- `lib/essay-validation.ts`
- `lib/rate-limit.ts`
- `lib/env.ts`
- `lib/ai-feedback/service.ts`
- `lib/training-plan/service.ts`
- `tests/ai-feedback-schema.test.ts`
- `tests/training-plan-schema.test.ts`
- `tests/essay-validation.test.ts`
- `tests/env.test.ts`
- `tests/rate-limit.test.ts`
- `README.md`
- `SECURITY.md`
- `docs/AI_NATIVE_WORKFLOW.md`
- `docs/adr/ADR-005-security-tests-ci.md`
- `docs/agent-logs/05-security-tests-ci.md`

## Commands Run

- `npm install`
- `npx prisma generate`
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`
- Started the local dev server with `npm run dev`
- Requested `http://localhost:3000`
- Requested `http://localhost:3000/plans` without a session

## Validation

- `npm install`: Passed. npm reported existing dependency audit findings: 25
  vulnerabilities.
- `npx prisma generate`: Passed.
- `npm run lint`: Passed.
- `npm run typecheck`: Passed.
- `npm run test`: Passed. 5 test files and 16 tests passed.
- `npm run build`: Passed. Prisma reported no pending migrations and Next.js
  production build completed.
- Local dev server: Running at `http://localhost:3000`.
- Landing page smoke check: `http://localhost:3000` returned HTTP 200 and
  included `WriteWise Agent`.
- Protected route smoke check: unauthenticated request to `/plans` returned
  HTTP 307 and redirected to `/login`.

## Known Limitations

- Rate limiting is in-memory and resets on server restart.
- Tests are unit-level and do not cover full browser flows.
- CI uses mock AI and does not exercise a real OpenAI-compatible provider.
