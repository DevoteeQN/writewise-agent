export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { notFound } from "next/navigation";
import { togglePlanItem } from "./actions";

export default async function PlanDetailPage({
  params,
}: {
  params: Promise<{ planId: string }>;
}) {
  const userId = await requireUserId();
  const { planId } = await params;
  const id = Number(planId);

  if (!Number.isInteger(id)) {
    notFound();
  }

  const plan = await prisma.trainingPlan.findFirst({
    where: {
      id,
      userId,
    },
    include: {
      items: {
        orderBy: [{ week: "asc" }, { day: "asc" }],
      },
      sourceEssay: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  if (!plan) {
    notFound();
  }

  const completed = plan.items.filter((item) => item.completed).length;
  const groupedWeeks = [1, 2, 3, 4].map((week) => ({
    week,
    theme: plan.items.find((item) => item.week === week)?.theme ?? `Week ${week}`,
    items: plan.items.filter((item) => item.week === week),
  }));

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            4-week training plan
          </p>
          <h1 className="mt-2 text-4xl font-bold text-gray-900">{plan.title}</h1>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-600">
            <span>Level: {plan.level}</span>
            <span>Status: {plan.status}</span>
            <span>{completed} / {plan.items.length} tasks completed</span>
          </div>
          <p className="mt-4 max-w-4xl text-gray-700">{plan.focusSummary}</p>
          {plan.sourceEssay && (
            <p className="mt-3 text-sm text-gray-600">
              Source essay: {plan.sourceEssay.title}
            </p>
          )}
        </div>

        <div className="space-y-8">
          {groupedWeeks.map((week) => (
            <section key={week.week} className="rounded-lg border bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900">
                Week {week.week}: {week.theme}
              </h2>
              <div className="mt-5 space-y-4">
                {week.items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border bg-gray-50 p-5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-blue-600">
                          Day {item.day} - {item.targetSkill} - {item.estimatedMinutes} minutes
                        </p>
                        <h3 className="mt-1 text-xl font-semibold text-gray-900">
                          {item.taskTitle}
                        </h3>
                        <p className="mt-2 text-gray-700">{item.taskDescription}</p>
                      </div>
                      <form action={togglePlanItem}>
                        <input type="hidden" name="planId" value={plan.id} />
                        <input type="hidden" name="itemId" value={item.id} />
                        <input
                          type="hidden"
                          name="completed"
                          value={String(!item.completed)}
                        />
                        <button
                          type="submit"
                          className={
                            item.completed
                              ? "rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
                              : "rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                          }
                        >
                          {item.completed ? "Mark Uncompleted" : "Mark Completed"}
                        </button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
