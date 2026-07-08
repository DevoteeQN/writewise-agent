export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import Link from "next/link";

export default async function PlansPage() {
  const userId = await requireUserId();

  const plans = await prisma.trainingPlan.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        select: { completed: true },
      },
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Training plans
          </p>
          <h1 className="mt-2 text-4xl font-bold text-gray-900">
            Your 4-Week Plans
          </h1>
        </div>

        {plans.length === 0 ? (
          <div className="rounded-lg border bg-white p-6 text-gray-600">
            No training plans yet. Generate AI feedback for an essay, then
            create a plan from that feedback.
          </div>
        ) : (
          <div className="space-y-4">
            {plans.map((plan) => {
              const completed = plan.items.filter((item) => item.completed).length;
              return (
                <Link
                  key={plan.id}
                  href={`/plans/${plan.id}`}
                  className="block rounded-lg border bg-white p-5 shadow-sm hover:bg-gray-50"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900">
                        {plan.title}
                      </h2>
                      <p className="mt-1 text-sm text-gray-600">
                        {plan.level} - {plan.status}
                      </p>
                      <p className="mt-2 max-w-3xl text-gray-700">
                        {plan.focusSummary}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500 sm:text-right">
                      <p>{completed} / {plan.items.length} tasks completed</p>
                      <p>{plan.createdAt.toLocaleDateString("en-US")}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
