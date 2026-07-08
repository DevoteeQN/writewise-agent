"use server";

import prisma from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { redirect } from "next/navigation";

const MAX_ESSAY_CHARACTERS = 12000;
const MAX_TITLE_CHARACTERS = 140;

export type SubmitEssayState = {
  error?: string;
};

function countWords(content: string) {
  const words = content.trim().match(/\S+/g);
  return words ? words.length : 0;
}

export async function submitEssay(
  promptId: number,
  _previousState: SubmitEssayState,
  formData: FormData
): Promise<SubmitEssayState> {
  const userId = await requireUserId();
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();

  if (!title) {
    return { error: "Add a title before submitting your essay." };
  }

  if (title.length > MAX_TITLE_CHARACTERS) {
    return { error: `Keep the title under ${MAX_TITLE_CHARACTERS} characters.` };
  }

  if (!content) {
    return { error: "Essay content cannot be empty." };
  }

  if (content.length > MAX_ESSAY_CHARACTERS) {
    return { error: `Keep the essay under ${MAX_ESSAY_CHARACTERS} characters.` };
  }

  const wordCount = countWords(content);
  let essayId: number;

  try {
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
        title,
        content,
        status: "submitted",
        wordCount,
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
