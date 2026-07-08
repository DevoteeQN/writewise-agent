# ADR-004: Training Plan Agent

## Status

Accepted

## Context

Phase 3 added structured AI feedback for essays. Phase 4 extends that feedback
into a coaching workflow: a personalized 4-week writing plan with concrete daily
practice tasks.

## Decision

Generate training plans from the user's latest saved `AIFeedback`, store the
plan and daily tasks as structured database records, and allow the owner to
track task completion.

## Why Generate From AI Feedback

The feedback record already contains rubric scores, summary, weakness tags, and
next exercise. It is a better coaching input than the raw essay alone because it
captures the diagnosed writing issues. Using feedback also completes the loop:
write, receive feedback, then practice the specific weaknesses.

## Structured Database Records

Plans are stored as `TrainingPlan` and `TrainingPlanItem` records instead of a
large text blob. This lets the UI group tasks by week, persist completion state,
enforce ownership checks at the item level, and later support simple progress
views without reparsing AI prose.

## Four Weeks And Five Days

Exactly 4 weeks and 5 practice days per week gives a bounded, demo-friendly
coaching plan: long enough to feel personalized and actionable, but small enough
to validate and display reliably. Zod enforces this shape before the plan is
saved.

## Mock Provider

The deterministic mock provider generates useful plans from weakness tags
without an API key. This keeps local demos and competition review flows
repeatable with `AI_PROVIDER=mock`.

## AI Coaching Loop

This phase completes the first end-to-end AI coaching loop in WriteWise Agent:
the user writes an essay, generates AI feedback, turns that feedback into a
practice plan, and tracks completion across 20 tasks.
