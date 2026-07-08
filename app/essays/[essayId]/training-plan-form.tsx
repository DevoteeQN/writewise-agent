"use client";

import { useActionState } from "react";
import {
  generateTrainingPlanForEssay,
  type GenerateTrainingPlanState,
} from "./actions";

const initialState: GenerateTrainingPlanState = {};

export default function TrainingPlanForm({ essayId }: { essayId: number }) {
  const [state, formAction, isPending] = useActionState(
    generateTrainingPlanForEssay.bind(null, essayId),
    initialState
  );

  return (
    <form action={formAction} className="space-y-3">
      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300"
      >
        {isPending ? "Generating..." : "Generate 4-Week Training Plan"}
      </button>
      {state.error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}
    </form>
  );
}
