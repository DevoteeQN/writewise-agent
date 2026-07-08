# ADR-005: Security, Tests, And CI

## Status

Accepted

## Context

The core WriteWise Agent flow now includes writing submissions, AI feedback,
and AI-generated training plans. Before competition evaluation, the project
needed stronger security documentation, validation tests, rate limiting, and CI.

## Decision

Add practical hardening after the core workflow stabilized: shared validation
helpers, a process-local rate limiter, server-side environment validation,
Vitest unit tests, and GitHub Actions CI.

## Why After Core Flow Stabilization

Earlier phases were focused on proving the product loop. Hardening after the
core flow exists keeps tests and docs grounded in real behavior: essays,
feedback, and training plans are now stable enough to validate.

## Mock AI In CI

CI uses `AI_PROVIDER=mock` so builds and tests are deterministic and do not
require real OpenAI-compatible API keys. This keeps pull requests safe and
repeatable.

## Zod And Schema Validation

AI output is untrusted. Zod validation ensures feedback and training plans match
strict shapes before the app stores or renders them. Unit tests protect those
schemas from accidental weakening.

## GitHub Actions

GitHub Actions is used because it is standard, visible to reviewers, and easy
to run on push and pull request. The workflow provisions PostgreSQL for Prisma
build steps while keeping OpenAI credentials out of CI.

## Remaining Limitations

- The rate limiter is in-memory and process-local.
- Tests are focused unit tests, not full browser end-to-end tests.
- Database-backed integration tests are deferred.
