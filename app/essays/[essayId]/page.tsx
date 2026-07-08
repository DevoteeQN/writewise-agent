export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { sentenceFeedbackSchema } from "@/lib/ai-feedback/schema";
import { requireUserId } from "@/lib/session";
import { notFound } from "next/navigation";
import FeedbackForm from "./feedback-form";

function parseSentenceFeedback(value: unknown) {
  const parsed = sentenceFeedbackSchema.array().safeParse(value);
  return parsed.success ? parsed.data : [];
}

function parseWeaknessTags(value: unknown) {
  return Array.isArray(value)
    ? value.filter((tag): tag is string => typeof tag === "string")
    : [];
}

export default async function EssayDetailPage({
  params,
}: {
  params: Promise<{ essayId: string }>;
}) {
  const userId = await requireUserId();
  const { essayId } = await params;
  const id = Number(essayId);

  if (!Number.isInteger(id)) {
    notFound();
  }

  const essay = await prisma.essay.findFirst({
    where: {
      id,
      userId,
    },
    include: {
      prompt: true,
      feedbacks: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!essay) {
    notFound();
  }

  const latestFeedback = essay.feedbacks[0];
  const sentenceFeedback = latestFeedback
    ? parseSentenceFeedback(latestFeedback.sentenceFeedbackJson)
    : [];
  const weaknessTags = latestFeedback
    ? parseWeaknessTags(latestFeedback.weaknessTagsJson)
    : [];

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-10">
      <article className="mx-auto max-w-4xl rounded-lg border bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Submitted essay
        </p>
        <h1 className="mt-3 text-4xl font-bold text-gray-900">{essay.title}</h1>
        <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-600">
          <span>{essay.wordCount} words</span>
          <span>Status: {essay.status}</span>
          <span>Submitted {essay.submittedAt.toLocaleDateString("en-US")}</span>
        </div>

        <section className="mt-8 rounded-lg border bg-gray-50 p-5">
          <h2 className="text-xl font-semibold text-gray-900">
            Prompt Information
          </h2>
          <p className="mt-2 font-medium text-gray-800">{essay.prompt.title}</p>
          <p className="mt-2 text-gray-700">{essay.prompt.content}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">
              {essay.prompt.category}
            </span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700">
              {essay.prompt.difficulty}
            </span>
            <span className="rounded-full bg-green-50 px-3 py-1 text-green-700">
              {essay.prompt.targetSkill}
            </span>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900">Essay Content</h2>
          <div className="mt-4 whitespace-pre-wrap rounded-lg border p-5 leading-7 text-gray-800">
            {essay.content}
          </div>
        </section>

        <section className="mt-8 rounded-lg border bg-blue-50 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                AI Structured Feedback
              </h2>
              <p className="mt-2 text-gray-700">
                Generate rubric-based feedback for this essay. Local
                development uses the deterministic mock provider unless another
                server-side provider is configured.
              </p>
            </div>
            <FeedbackForm essayId={essay.id} />
          </div>

          {!latestFeedback ? (
            <div className="mt-6 rounded-lg border border-dashed border-blue-200 bg-white p-5 text-gray-700">
              No AI feedback has been generated for this essay yet.
            </div>
          ) : (
            <div className="mt-6 space-y-6">
              <div className="rounded-lg border bg-white p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Overall score
                    </p>
                    <p className="text-5xl font-bold text-gray-900">
                      {latestFeedback.overallScore.toFixed(1)}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">
                    {latestFeedback.provider} / {latestFeedback.model}
                  </p>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-4">
                  <ScoreCard label="Task response" score={latestFeedback.taskResponseScore} />
                  <ScoreCard label="Coherence" score={latestFeedback.coherenceScore} />
                  <ScoreCard label="Lexical" score={latestFeedback.lexicalScore} />
                  <ScoreCard label="Grammar" score={latestFeedback.grammarScore} />
                </div>
              </div>

              <FeedbackSection title="Summary">
                <p>{latestFeedback.summary}</p>
              </FeedbackSection>

              <FeedbackSection title="Sentence-Level Feedback">
                {sentenceFeedback.length === 0 ? (
                  <p>No sentence-level notes were returned.</p>
                ) : (
                  <div className="space-y-4">
                    {sentenceFeedback.map((item, index) => (
                      <div key={`${item.originalSentence}-${index}`} className="rounded-md border p-4">
                        <p className="font-medium text-gray-900">{item.originalSentence}</p>
                        <p className="mt-2 text-sm text-red-700">Issue: {item.issue}</p>
                        <p className="mt-1 text-sm text-green-700">
                          Suggestion: {item.suggestion}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </FeedbackSection>

              <FeedbackSection title="Improved Version">
                <div className="whitespace-pre-wrap">{latestFeedback.improvedVersion}</div>
              </FeedbackSection>

              <FeedbackSection title="Weakness Tags">
                <div className="flex flex-wrap gap-2">
                  {weaknessTags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </FeedbackSection>

              <FeedbackSection title="Next Exercise">
                <p>{latestFeedback.nextExercise}</p>
              </FeedbackSection>
            </div>
          )}
        </section>
      </article>
    </div>
  );
}

function ScoreCard({ label, score }: { label: string; score: number }) {
  return (
    <div className="rounded-md border bg-gray-50 p-4">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900">{score.toFixed(1)}</p>
    </div>
  );
}

function FeedbackSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border bg-white p-5 text-gray-800">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <div className="mt-3 leading-7">{children}</div>
    </section>
  );
}
