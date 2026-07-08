"use server";

import prisma from "@/lib/prisma";
import { validateEssayInput } from "@/lib/essay-validation";
import { requireUserId } from "@/lib/session";
import { redirect } from "next/navigation";

export type SubmitEssayState = {
  error?: string;
};

export async function submitEssay(
  promptId: number,
  _previousState: SubmitEssayState,
  formData: FormData
): Promise<SubmitEssayState> {
  const userId = await requireUserId();
  const validation = validateEssayInput(formData.get("title"), formData.get("content"));

  if (!validation.ok) {
    return { error: validation.error };
  }

  let essayId: number;

  try {
    if (!Number.isInteger(promptId) || promptId <= 0) {
      return { error: "The selected prompt is invalid." };
    }

    const prompt = await prisma.writingPrompt.findUnique({
      where: { id: promptId },
      select: { id: true },
    });

    if (!prompt) {
      return { error: "The selected prompt is no longer available." };
    }

    const essay = await prisma.essay.create({
      data: {
        userId,
        promptId,
        title: validation.title,
        content: validation.content,
        status: "submitted",
        wordCount: validation.wordCount,
        submittedAt: new Date(),
      },
      select: { id: true },
    });

    essayId = essay.id;
  } catch {
    return {
      error: "We could not save this essay. Please try again.",
    };
  }

  redirect(`/essays/${essayId}`);
}
