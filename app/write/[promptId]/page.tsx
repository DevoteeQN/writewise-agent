export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { notFound } from "next/navigation";
import EssayForm from "./essay-form";

export default async function WritePage({
  params,
}: {
  params: Promise<{ promptId: string }>;
}) {
  await requireUserId();
  const { promptId } = await params;
  const id = Number(promptId);

  if (!Number.isInteger(id)) {
    notFound();
  }

  const prompt = await prisma.writingPrompt.findUnique({
    where: { id },
  });

  if (!prompt) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-10">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.4fr]">
        <aside className="rounded-lg border bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Selected prompt
          </p>
          <h1 className="mt-3 text-3xl font-bold text-gray-900">
            {prompt.title}
          </h1>
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
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
          <p className="mt-5 text-gray-700">{prompt.content}</p>
          <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="font-semibold text-gray-900">Word limit</dt>
              <dd className="text-gray-600">{prompt.wordLimit}</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">Estimated time</dt>
              <dd className="text-gray-600">{prompt.estimatedMinutes} minutes</dd>
            </div>
          </dl>
        </aside>

        <main className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900">
            Write Your Essay
          </h2>
          <p className="mt-2 text-gray-600">
            Submit a complete draft for this prompt. AI feedback is not enabled
            in Phase 2.
          </p>
          <div className="mt-6">
            <EssayForm promptId={prompt.id} />
          </div>
        </main>
      </div>
    </div>
  );
}
