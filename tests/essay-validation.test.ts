import { describe, expect, it } from "vitest";
import {
  countWords,
  MAX_ESSAY_CHARACTERS,
  validateEssayInput,
} from "@/lib/essay-validation";

describe("essay validation", () => {
  it("counts words using non-whitespace tokens", () => {
    expect(countWords("  One two\nthree  ")).toBe(3);
  });

  it("accepts valid essay input and trims it", () => {
    const result = validateEssayInput("  My Essay  ", "  This is a draft.  ");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.title).toBe("My Essay");
      expect(result.wordCount).toBe(4);
    }
  });

  it("rejects empty content", () => {
    expect(validateEssayInput("Title", "   ").ok).toBe(false);
  });

  it("rejects extremely long essays", () => {
    const result = validateEssayInput("Title", "a".repeat(MAX_ESSAY_CHARACTERS + 1));

    expect(result.ok).toBe(false);
  });
});
