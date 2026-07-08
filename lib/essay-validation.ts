export const MAX_ESSAY_CHARACTERS = 12000;
export const MAX_TITLE_CHARACTERS = 140;

export type EssayValidationResult =
  | {
      ok: true;
      title: string;
      content: string;
      wordCount: number;
    }
  | {
      ok: false;
      error: string;
    };

export function countWords(content: string) {
  const words = content.trim().match(/\S+/g);
  return words ? words.length : 0;
}

export function validateEssayInput(titleInput: unknown, contentInput: unknown): EssayValidationResult {
  const title = String(titleInput ?? "").trim();
  const content = String(contentInput ?? "").trim();

  if (!title) {
    return { ok: false, error: "Add a title before submitting your essay." };
  }

  if (title.length > MAX_TITLE_CHARACTERS) {
    return { ok: false, error: `Keep the title under ${MAX_TITLE_CHARACTERS} characters.` };
  }

  if (!content) {
    return { ok: false, error: "Essay content cannot be empty." };
  }

  if (content.length > MAX_ESSAY_CHARACTERS) {
    return { ok: false, error: `Keep the essay under ${MAX_ESSAY_CHARACTERS} characters.` };
  }

  return {
    ok: true,
    title,
    content,
    wordCount: countWords(content),
  };
}
