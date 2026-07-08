"use server";

import { generateAIFeedback } from "@/lib/ai-feedback/service";
import { requireUserId } from "@/lib/session";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type GenerateFeedbackState = {
  error?: string;
};

const MAX_ESSAY_CHARACTERS = 12000;
const RATE_LIMIT_MS = 60 * 1000;

export async function generateFeedbackForEssay(
  essayId: number,
  _previousState: GenerateFeedbackState
): Promise<GenerateFeedbackState> {
  void _previousState;
  const userId = await requireUserId();

  try {
    const essay = await prisma.essay.findFirst({
      where: {
        id: essayId,
        userId,
      },
      include: {
        prompt: true,
      },
    });

    if (!essay) {
      return { error: "Essay not found." };
    }

    const content = essay.content.trim();

    if (!content) {
      return { error: "Empty essays cannot be evaluated." };
    }

    if (content.length > MAX_ESSAY_CHARACTERS) {
      return { error: "This essay is too long to evaluate in one request." };
    }

    const recentFeedback = await prisma.aIFeedback.findFirst({
      where: {
        essayId: essay.id,
        createdAt: {
          gte: new Date(Date.now() - RATE_LIMIT_MS),
        },
      },
      select: { id: true },
    });

    if (recentFeedback) {
      return {
        error: "Feedback was generated recently. Please wait a minute before trying again.",
      };
    }

    const result = await generateAIFeedback({
      essayTitle: essay.title,
      essayContent: content,
      promptTitle: essay.prompt.title,
      promptCategory: essay.prompt.category,
      promptTargetSkill: essay.prompt.targetSkill,
      promptContent: essay.prompt.content,
      wordCount: essay.wordCount,
    });

    await prisma.aIFeedback.create({
      data: {
        essayId: essay.id,
        overallScore: result.feedback.overallScore,
        taskResponseScore: result.feedback.taskResponseScore,
        coherenceScore: result.feedback.coherenceScore,
        lexicalScore: result.feedback.lexicalScore,
        grammarScore: result.feedback.grammarScore,
        summary: result.feedback.summary,
        sentenceFeedbackJson: result.feedback.sentenceFeedback,
        improvedVersion: result.feedback.improvedVersion,
        weaknessTagsJson: result.feedback.weaknessTags,
        nextExercise: result.feedback.nextExercise,
        provider: result.provider,
        model: result.model,
      },
    });
  } catch (error) {
    console.error("AI feedback generation failed:", error);
    return {
      error: "We could not generate feedback right now. Please try again later.",
    };
  }

  revalidatePath(`/essays/${essayId}`);
  redirect(`/essays/${essayId}`);
}
