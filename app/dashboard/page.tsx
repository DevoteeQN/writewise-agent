export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import Link from "next/link";

export default async function DashboardPage() {
  const userId = await requireUserId();

  const [essayCount, recentEssays, activePlan] = await Promise.all([
    prisma.essay.count({ where: { userId } }),
    prisma.essay.findMany({
      where: { userId },
      orderBy: { submittedAt: "desc" },
      take: 5,
      include: {
        prompt: {
          select: {
            title: true,
            category: true,
            targetSkill: true,
          },
        },
      },
    }),
    prisma.trainingPlan.findFirst({
      where: {
        userId,
        status: "active",
      },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          select: { completed: true },
        },
      },
    }),
  ]);

  const completedPlanItems =
    activePlan?.items.filter((item) => item.completed).length ?? 0;

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Practice dashboard
            </p>
            <h1 className="mt-2 text-4xl font-bold text-gray-900">
              Your Writing Workspace
            </h1>
          </div>
          <Link
            href="/prompts"
            className="rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Choose a Prompt
          </Link>
        </div>

        <div className="mb-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Submitted essays</p>
            <p className="mt-2 text-5xl font-bold text-gray-900">{essayCount}</p>
          </div>
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Active training plan
                </p>
                {activePlan ? (
                  <>
                    <p className="mt-2 text-2xl font-bold text-gray-900">
                      {completedPlanItems} / {activePlan.items.length} tasks
                    </p>
                    <p className="mt-1 text-sm text-gray-600">{activePlan.title}</p>
                  </>
                ) : (
                  <p className="mt-2 text-gray-600">No active plan yet.</p>
                )}
              </div>
              <Link
                href="/plans"
                className="text-sm font-semibold text-blue-600 hover:underline"
              >
                Plans
              </Link>
            </div>
          </div>
        </div>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">
              Recent Essays
            </h2>
            <Link href="/essays" className="text-sm font-semibold text-blue-600 hover:underline">
              View all
            </Link>
          </div>
          {recentEssays.length === 0 ? (
            <div className="rounded-lg border bg-white p-6 text-gray-600">
              No essays yet. Start with a prompt from the prompt bank.
            </div>
          ) : (
            <div className="space-y-4">
              {recentEssays.map((essay) => (
                <Link
                  key={essay.id}
                  href={`/essays/${essay.id}`}
                  className="block rounded-lg border bg-white p-5 shadow-sm hover:bg-gray-50"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {essay.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        {essay.prompt.title} - {essay.prompt.category} - {essay.prompt.targetSkill}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">{essay.wordCount} words</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
