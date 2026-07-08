import { describe, expect, it } from "vitest";
import { aiFeedbackSchema } from "@/lib/ai-feedback/schema";

const validFeedback = {
  overallScore: 7,
  taskResponseScore: 7,
  coherenceScore: 6.5,
  lexicalScore: 7,
  grammarScore: 6,
  summary: "The essay has a clear position and needs stronger evidence.",
  sentenceFeedback: [
    {
      originalSentence: "Students should study online.",
      issue: "The claim is too broad.",
      suggestion: "Specify which students and why online study helps them.",
    },
  ],
  improvedVersion: "Students can benefit from online study when courses include feedback.",
  weaknessTags: ["evidence development", "coherence"],
  nextExercise: "Write one paragraph with a claim, example, and explanation.",
};

describe("aiFeedbackSchema", () => {
  it("accepts valid structured feedback", () => {
    expect(aiFeedbackSchema.safeParse(validFeedback).success).toBe(true);
  });

  it("rejects scores outside the 0 to 9 range", () => {
    const result = aiFeedbackSchema.safeParse({
      ...validFeedback,
      overallScore: 10,
    });

    expect(result.success).toBe(false);
  });

  it("rejects unknown fields", () => {
    const result = aiFeedbackSchema.safeParse({
      ...validFeedback,
      html: "<strong>unsafe</strong>",
    });

    expect(result.success).toBe(false);
  });
});
