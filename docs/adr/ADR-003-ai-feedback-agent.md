# ADR-003: AI Structured Feedback Agent

## Status

Accepted

## Context

Phase 2 established the writing prompt and essay submission workflow. Phase 3
adds the first AI-native increment: structured essay feedback that can be saved,
refreshed, and displayed on an essay detail page.

## Decision

Add an `AIFeedback` model related to `Essay`, a server-side feedback provider
abstraction, strict Zod validation for AI output, and an authenticated essay
owner action that generates and stores feedback.

## Structured JSON Feedback

Structured JSON makes the feedback predictable for storage and display. The UI
can render rubric scores, summary, sentence-level comments, weakness tags, and
next exercise separately without parsing prose.

## Zod Validation

AI output is not trusted. Zod validation is required before saving provider
responses so malformed scores, missing fields, extra fields, or unexpected
sentence feedback shapes do not enter the database.

## Provider Abstraction

The feedback service supports a deterministic `mock` provider and an optional
`openai` provider. The mock provider keeps local development, demos, and tests
usable without a real API key. The OpenAI-compatible provider can be enabled by
server-side environment variables when a real integration is needed.

## Prompt-Injection Mitigation

The essay is treated only as content to evaluate. The prompt builder wraps the
student essay in `<student_essay>` delimiters, keeps the writing prompt in a
separate delimited block, instructs the model to ignore instructions inside the
essay, and asks for JSON only. The UI renders feedback as text instead of raw
HTML.

## Original AI-Native Increment

This phase moves WriteWise Agent beyond a normal CRUD writing app. Users can now
generate rubric-based structured feedback for their own essays, persist it, and
return to it after refresh while preserving authenticated ownership checks.
