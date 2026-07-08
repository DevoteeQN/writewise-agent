"use client";

import { useActionState, useState } from "react";
import { submitEssay, type SubmitEssayState } from "./actions";

const initialState: SubmitEssayState = {};

function countWords(content: string) {
  const words = content.trim().match(/\S+/g);
  return words ? words.length : 0;
}

export default function EssayForm({ promptId }: { promptId: number }) {
  const [content, setContent] = useState("");
  const [state, formAction, isPending] = useActionState(
    submitEssay.bind(null, promptId),
    initialState
  );
  const wordCount = countWords(content);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="title" className="mb-2 block text-sm font-semibold text-gray-800">
          Essay title
        </label>
        <input
          id="title"
          name="title"
          required
          maxLength={140}
          className="w-full rounded-md border px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-hidden"
          placeholder="Add a short title"
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between gap-4">
          <label htmlFor="content" className="block text-sm font-semibold text-gray-800">
            Essay content
          </label>
          <span className="text-sm text-gray-500">{wordCount} words</span>
        </div>
        <textarea
          id="content"
          name="content"
          required
          maxLength={12000}
          rows={16}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          className="w-full rounded-md border px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-hidden"
          placeholder="Write your essay here..."
        />
      </div>

      {state.error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
      >
        {isPending ? "Submitting..." : "Submit Essay"}
      </button>
    </form>
  );
}
