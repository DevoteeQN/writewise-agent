"use server";

import prisma from "@/lib/prisma";

/**
 * Checks if the writing prompt table exists in the database
 * @returns Promise<boolean> - true if the table exists, false otherwise
 */
export async function checkWritingPromptTableExists(): Promise<boolean> {
  try {
    await prisma.writingPrompt.findFirst();
    return true;
  } catch {
    // If there's an error, the table likely doesn't exist
    return false;
  }
}
