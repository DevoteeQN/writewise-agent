# Security Notes

## AI Feedback Safety

WriteWise Agent treats student essays as untrusted user content.

The AI feedback service mitigates prompt-injection risk by:

- Sending server-side system instructions that tell the model to ignore any
  instruction inside the student essay.
- Wrapping essay text inside `<student_essay>...</student_essay>` delimiters.
- Sending prompt context separately inside `<writing_prompt>...</writing_prompt>`
  delimiters.
- Asking the provider to return JSON only.
- Validating provider output with a strict Zod schema before saving it.
- Rendering feedback as React text, never as raw HTML.

API keys are only read on the server. `OPENAI_API_KEY` must never be exposed to
client components or committed to the repository.

When `AI_PROVIDER` is missing, the app uses the deterministic mock provider so
local development remains available without a real AI key.

## Training Plan Safety

Training plans are generated from already-saved AI feedback rather than raw
essay text. The plan prompt still treats feedback content as untrusted, asks for
JSON only, and validates the response with a strict Zod schema before database
storage.

Plan pages and completion actions require authentication. Plan and task updates
are scoped through `TrainingPlan.userId`, so users cannot view or update another
user's plan items by guessing ids.
