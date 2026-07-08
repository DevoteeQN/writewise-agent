"use server";

import { generateAIFeedback } from "@/lib/ai-feedback/service";
import { generateTrainingPlan } from "@/lib/training-plan/service";
import { checkRateLimit } from "@/lib/rate-limit";
import { requireUserId } from "@/lib/session";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type GenerateFeedbackState = {
  error?: string;
};

export type GenerateTrainingPlanState = {
  error?: string;
};

const MAX_ESSAY_CHARACTERS = 12000;
const RATE_LIMIT_MS = 60 * 1000;
const FEEDBACK_RATE_LIMIT_MS = 5 * 60 * 1000;
const TRAINING_PLAN_RATE_LIMIT_MS = 5 * 60 * 1000;

export async function generateFeedbackForEssay(
  essayId: number,
  _previousState: GenerateFeedbackState
): Promise<GenerateFeedbackState> {
  void _previousState;
  const userId = await requireUserId();

  try {
    if (!Number.isInteger(essayId) || essayId <= 0) {
      return { error: "Essay not found." };
    }

    const rateLimit = checkRateLimit(`feedback:${userId}`, 5, FEEDBACK_RATE_LIMIT_MS);

    if (!rateLimit.ok) {
      return {
        error: `Too many feedback requests. Try again in ${rateLimit.retryAfterSeconds} seconds.`,
      };
    }

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

function parseWeaknessTags(value: unknown) {
  return Array.isArray(value)
    ? value.filter((tag): tag is string => typeof tag === "string")
    : [];
}

export async function generateTrainingPlanForEssay(
  essayId: number,
  _previousState: GenerateTrainingPlanState
): Promise<GenerateTrainingPlanState> {
  void _previousState;
  const userId = await requireUserId();
  let planId: number;

  try {
    if (!Number.isInteger(essayId) || essayId <= 0) {
      return { error: "Essay not found." };
    }

    const rateLimit = checkRateLimit(`training-plan:${userId}`, 3, TRAINING_PLAN_RATE_LIMIT_MS);

    if (!rateLimit.ok) {
      return {
        error: `Too many training plan requests. Try again in ${rateLimit.retryAfterSeconds} seconds.`,
      };
    }

    const essay = await prisma.essay.findFirst({
      where: {
        id: essayId,
        userId,
      },
      include: {
        prompt: true,
        feedbacks: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!essay) {
      return { error: "Essay not found." };
    }

    const latestFeedback = essay.feedbacks[0];

    if (!latestFeedback) {
      return { error: "Generate AI feedback before creating a training plan." };
    }

    const existingPlan = await prisma.trainingPlan.findFirst({
      where: {
        userId,
        sourceFeedbackId: latestFeedback.id,
        status: "active",
      },
      select: { id: true },
    });

    if (existingPlan) {
      planId = existingPlan.id;
    } else {
      const result = await generateTrainingPlan({
        essayTitle: essay.title,
        promptTitle: essay.prompt.title,
        promptCategory: essay.prompt.category,
        overallScore: latestFeedback.overallScore,
        summary: latestFeedback.summary,
        weaknessTags: parseWeaknessTags(latestFeedback.weaknessTagsJson),
        nextExercise: latestFeedback.nextExercise,
      });

      const createdPlan = await prisma.$transaction(async (tx) => {
        const plan = await tx.trainingPlan.create({
          data: {
            userId,
            sourceEssayId: essay.id,
            sourceFeedbackId: latestFeedback.id,
            title: result.plan.title,
            level: result.plan.level,
            focusSummary: result.plan.focusSummary,
            status: "active",
          },
          select: { id: true },
        });

        await tx.trainingPlanItem.createMany({
          data: result.plan.weeks.flatMap((week) =>
            week.days.map((day) => ({
              planId: plan.id,
              week: week.week,
              day: day.day,
              theme: week.theme,
              taskTitle: day.taskTitle,
              taskDescription: day.taskDescription,
              targetSkill: day.targetSkill,
              estimatedMinutes: day.estimatedMinutes,
            }))
          ),
        });

        return plan;
      });

      planId = createdPlan.id;
    }
  } catch (error) {
    console.error("Training plan generation failed:", error);
    return {
      error: "We could not generate a training plan right now. Please try again later.",
    };
  }

  revalidatePath(`/essays/${essayId}`);
  revalidatePath("/plans");
  redirect(`/plans/${planId}`);
}
