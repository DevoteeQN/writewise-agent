export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import Link from "next/link";

export default async function EssaysPage() {
  const userId = await requireUserId();

  const essays = await prisma.essay.findMany({
    where: { userId },
    orderBy: { submittedAt: "desc" },
    include: {
      prompt: {
        select: {
          title: true,
          category: true,
          difficulty: true,
          targetSkill: true,
        },
      },
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Essay history
            </p>
            <h1 className="mt-2 text-4xl font-bold text-gray-900">
              Your Essays
            </h1>
          </div>
          <Link
            href="/prompts"
            className="rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Write Another Essay
          </Link>
        </div>

        {essays.length === 0 ? (
          <div className="rounded-lg border bg-white p-6 text-gray-600">
            You have not submitted an essay yet.
          </div>
        ) : (
          <div className="space-y-4">
            {essays.map((essay) => (
              <Link
                key={essay.id}
                href={`/essays/${essay.id}`}
                className="block rounded-lg border bg-white p-5 shadow-sm hover:bg-gray-50"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">
                      {essay.title}
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                      {essay.prompt.title} - {essay.prompt.category} - {essay.prompt.difficulty}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Target skill: {essay.prompt.targetSkill}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500 sm:text-right">
                    <p>{essay.wordCount} words</p>
                    <p>{essay.submittedAt.toLocaleDateString("en-US")}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
