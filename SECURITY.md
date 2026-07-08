# Security Notes

## Authentication

WriteWise Agent uses the existing NextAuth credentials flow from the Prisma
starter. Protected routes call `requireUserId()` server-side and redirect
unauthenticated users to `/login`.

Protected routes include:

- `/dashboard`
- `/prompts`
- `/write/[promptId]`
- `/essays`
- `/essays/[essayId]`
- `/plans`
- `/plans/[planId]`

## Authorization And Ownership

Ownership checks are enforced server-side with Prisma queries scoped by the
authenticated user's id.

- Essay lists and essay details query `Essay` with `userId`.
- AI feedback generation first loads the essay by `id` and `userId`.
- Training plan generation first loads the essay by `id` and `userId`, then uses
  the latest feedback for that essay.
- Plan list and plan detail pages query `TrainingPlan` with `userId`.
- Plan item completion checks the item through `TrainingPlan.userId` before
  updating.

Users should not be able to read, generate, or mutate another user's essays,
feedback, plans, or plan items by guessing ids.

## Input Validation

Essay submission uses shared validation for title length, empty content, maximum
essay length, and approximate word count. Dynamic route params and server action
ids are checked for positive integers before database access.

Database and provider exceptions are caught in server actions and replaced with
safe user-facing messages.

## Rate Limiting

The app includes a small in-memory rate limiter for local/demo hardening:

- AI feedback generation: limited per authenticated user.
- Training plan generation: limited per authenticated user.
- Credentials auth attempts: limited per normalized email.

This limiter is process-local and resets when the server restarts. Production
deployments should replace it with durable storage such as Redis or a managed
rate-limiting service.

## Secret Management

`.env` and `.env.local` are ignored by Git. `.env.example` contains placeholders
only. `OPENAI_API_KEY` is read only from server-side code and is never passed to
client components.

CI uses `AI_PROVIDER=mock` and does not require a real OpenAI-compatible API
key.

## Environment Validation

Server-side helpers validate:

- `DATABASE_URL`
- `AUTH_SECRET` or `NEXTAUTH_SECRET`
- `AI_PROVIDER`
- `OPENAI_API_KEY` when `AI_PROVIDER=openai`
- `AI_MODEL`, with a safe default

Environment validation is not performed in client-side code.

## AI Prompt-Injection Mitigation

WriteWise Agent treats student essays and AI feedback as untrusted content.

The AI feedback service mitigates prompt-injection risk by:

- Sending server-side system instructions that tell the model to ignore any
  instruction inside the student essay.
- Wrapping essay text inside `<student_essay>...</student_essay>` delimiters.
- Sending prompt context separately inside `<writing_prompt>...</writing_prompt>`
  delimiters.
- Asking the provider to return JSON only.
- Validating provider output with a strict Zod schema before saving it.
- Rendering feedback as React text, never as raw HTML.

Training plans are generated from saved AI feedback rather than raw essay text.
The plan prompt treats feedback content as untrusted, asks for JSON only, and
validates the response with a strict Zod schema before database storage.

## Known Limitations

- The in-memory rate limiter is suitable for local demos, not multi-instance
  production deployments.
- Unit tests cover validation and helper behavior; database-backed integration
  tests are not included yet.
- Optional OpenAI-compatible calls are not exercised in CI because CI uses the
  deterministic mock provider.
