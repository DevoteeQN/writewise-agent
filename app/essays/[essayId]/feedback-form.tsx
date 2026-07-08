"use client";

import { useActionState } from "react";
import { generateFeedbackForEssay, type GenerateFeedbackState } from "./actions";

const initialState: GenerateFeedbackState = {};

export default function FeedbackForm({ essayId }: { essayId: number }) {
  const [state, formAction, isPending] = useActionState(
    generateFeedbackForEssay.bind(null, essayId),
    initialState
  );

  return (
    <form action={formAction} className="space-y-3">
      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
      >
        {isPending ? "Generating..." : "Generate AI Feedback"}
      </button>
      {state.error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}
    </form>
  );
}
