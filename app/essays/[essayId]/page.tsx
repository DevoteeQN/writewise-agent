export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { notFound } from "next/navigation";

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
    },
  });

  if (!essay) {
    notFound();
  }

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

        <section className="mt-8 rounded-lg border border-dashed bg-blue-50 p-5">
          <h2 className="text-xl font-semibold text-gray-900">
            Phase 3 Feedback Placeholder
          </h2>
          <p className="mt-2 text-gray-700">
            AI structured feedback will be added in Phase 3. This phase only
            stores the essay and enforces authenticated ownership.
          </p>
        </section>
      </article>
    </div>
  );
}
