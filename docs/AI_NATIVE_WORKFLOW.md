# AI-Native Workflow

WriteWise Agent was developed as a human-in-the-loop AI agent engineering
project. Codex was used as a coding agent to make scoped implementation passes,
run commands, update documentation, and record validation results. Humans guided
the phase goals, reviewed outputs, and decide what gets committed.

## Phase 1: Bootstrap And Rebrand

The base Prisma Next.js Auth Starter was rebranded as WriteWise Agent. The app
kept the starter auth and Prisma setup while adding competition-oriented README,
ADR, and agent-log documentation.

## Phase 2: Writing Core

The starter blog/post demo was replaced with the original writing-training
domain: `WritingPrompt`, `Essay`, prompt bank, essay editor, essay history, and
authenticated ownership checks.

## Phase 3: AI Feedback Agent

Structured AI essay feedback was added with `AIFeedback`, a deterministic mock
provider, optional OpenAI-compatible provider, Zod output validation,
prompt-injection mitigation, and feedback rendering on essay detail pages.

## Phase 4: Training Plan Agent

Saved AI feedback became the source for personalized 4-week training plans.
Plans are stored as structured records, shown by week and day, and support
persisted task completion.

## Phase 5: Security, Tests, And CI

The project was hardened with shared validation helpers, in-memory rate
limiting, server-side environment validation, unit tests, GitHub Actions CI, and
expanded security documentation.

## Codex's Role

Codex acted as a coding agent inside the local repository. It inspected files,
made targeted edits, generated migrations and docs, ran validation commands,
and summarized results. It did not replace human review or product judgment.

## Human Review

Humans supplied the phase requirements, reviewed the generated changes, tested
the app locally, and are responsible for commits and final acceptance.

## Evidence Trail

The repository keeps two forms of AI-agent development evidence:

- `docs/agent-logs`: what changed, commands run, validation results, and known
  limitations per phase.
- `docs/adr`: architecture decisions and rationale for each major increment.

Together, these documents show the project evolving through controlled,
reviewable AI-assisted engineering increments rather than a single unreviewed
generation pass.
