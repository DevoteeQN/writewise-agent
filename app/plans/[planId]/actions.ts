"use server";

import prisma from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function togglePlanItem(formData: FormData) {
  const userId = await requireUserId();
  const planId = Number(formData.get("planId"));
  const itemId = Number(formData.get("itemId"));
  const completed = formData.get("completed") === "true";

  if (!Number.isInteger(planId) || planId <= 0 || !Number.isInteger(itemId) || itemId <= 0) {
    return;
  }

  const item = await prisma.trainingPlanItem.findFirst({
    where: {
      id: itemId,
      planId,
      plan: {
        userId,
      },
    },
    select: { id: true },
  });

  if (!item) {
    return;
  }

  await prisma.trainingPlanItem.update({
    where: { id: item.id },
    data: {
      completed,
      completedAt: completed ? new Date() : null,
    },
  });

  revalidatePath(`/plans/${planId}`);
  revalidatePath("/plans");
  revalidatePath("/dashboard");
}
