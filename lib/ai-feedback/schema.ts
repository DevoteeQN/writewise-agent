import { z } from "zod";

const scoreSchema = z.number().min(0).max(9);

export const sentenceFeedbackSchema = z
  .object({
    originalSentence: z.string().min(1),
    issue: z.string().min(1),
    suggestion: z.string().min(1),
  })
  .strict();

export const aiFeedbackSchema = z
  .object({
    overallScore: scoreSchema,
    taskResponseScore: scoreSchema,
    coherenceScore: scoreSchema,
    lexicalScore: scoreSchema,
    grammarScore: scoreSchema,
    summary: z.string().min(1).max(1200),
    sentenceFeedback: z.array(sentenceFeedbackSchema).max(12),
    improvedVersion: z.string().min(1).max(14000),
    weaknessTags: z.array(z.string().min(1).max(80)).max(12),
    nextExercise: z.string().min(1).max(800),
  })
  .strict();

export type AIFeedbackOutput = z.infer<typeof aiFeedbackSchema>;
export type SentenceFeedback = z.infer<typeof sentenceFeedbackSchema>;
