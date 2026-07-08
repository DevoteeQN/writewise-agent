# ADR-002: Writing Core Domain

## Status

Accepted

## Context

WriteWise Agent started from the Prisma Next.js Auth Starter, which included a
generic blog/post demo. The competition project needs original writing-training
behavior, so the starter domain no longer represented the product direction.

## Decision

Replace the starter blog/post domain with a writing prompt and essay submission
domain for Phase 2.

## Why Replace Blog Posts

Blog posts demonstrated CRUD behavior, but they did not model a writing
practice workflow. Phase 2 introduces user-facing behavior specific to
WriteWise Agent: users choose a writing prompt, submit an essay, and review
their own essay history.

## Why Separate WritingPrompt And Essay

`WritingPrompt` represents reusable practice material. It is seeded once and
can be used by many users.

`Essay` represents a user's private submission for one prompt. It belongs to
both a `User` and a `WritingPrompt`, stores the submitted content and word
count, and is always queried through the authenticated user's id when shown in
the UI.

Separating these concepts avoids duplicating prompt text on every submission
and creates a clear place for future feedback records to attach to essays.

## Why Postpone AI Feedback

AI feedback is postponed to Phase 3 to keep this phase buildable, testable, and
focused on the core data model and ownership rules. This also avoids premature
external API integration before the prompt and essay workflow is stable.

## Original Increment

This phase demonstrates original work beyond the base GitHub starter by adding:

- A prompt bank seeded with English writing tasks
- An authenticated essay editor
- User-owned essay history
- Essay detail pages with prompt context
- Ownership checks that prevent users from reading another user's essays

The starter's authentication and Prisma setup are reused, but the product
domain and user workflow are now specific to WriteWise Agent.
