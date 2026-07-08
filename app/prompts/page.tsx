export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import Link from "next/link";

export default async function PromptsPage() {
  await requireUserId();

  const prompts = await prisma.writingPrompt.findMany({
    orderBy: [{ category: "asc" }, { difficulty: "asc" }, { title: "asc" }],
  });

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Prompt bank
          </p>
          <h1 className="mt-2 text-4xl font-bold text-gray-900">
            Choose a Writing Prompt
          </h1>
          <p className="mt-3 max-w-3xl text-gray-700">
            Browse targeted prompts by category, difficulty, skill focus, word
            limit, and estimated completion time.
          </p>
        </div>

        {prompts.length === 0 ? (
          <div className="rounded-lg border bg-white p-6 text-gray-600">
            No prompts are available yet. Run <code>npx prisma db seed</code> to
            load the Phase 2 prompt bank.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {prompts.map((prompt) => (
              <div key={prompt.id} className="rounded-lg border bg-white p-6 shadow-sm">
                <div className="mb-4 flex flex-wrap gap-2 text-xs font-semibold">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">
                    {prompt.category}
                  </span>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700">
                    {prompt.difficulty}
                  </span>
                  <span className="rounded-full bg-green-50 px-3 py-1 text-green-700">
                    {prompt.targetSkill}
                  </span>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {prompt.title}
                </h2>
                <p className="mt-3 text-gray-700">{prompt.content}</p>
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
                  <span>{prompt.wordLimit} words</span>
                  <span>{prompt.estimatedMinutes} minutes</span>
                </div>
                <Link
                  href={`/write/${prompt.id}`}
                  className="mt-5 inline-flex rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Write Essay
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
