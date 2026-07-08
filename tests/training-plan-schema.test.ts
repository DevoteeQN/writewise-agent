import { describe, expect, it } from "vitest";
import { trainingPlanSchema } from "@/lib/training-plan/schema";

function buildValidPlan() {
  return {
    title: "4-Week Writing Plan",
    level: "Intermediate",
    focusSummary: "Focus on coherence and evidence development.",
    weeks: [1, 2, 3, 4].map((week) => ({
      week,
      theme: `Week ${week} theme`,
      days: [1, 2, 3, 4, 5].map((day) => ({
        day,
        taskTitle: `Task ${week}-${day}`,
        taskDescription: "Write a focused paragraph and revise it.",
        targetSkill: "coherence",
        estimatedMinutes: 25,
      })),
    })),
  };
}

describe("trainingPlanSchema", () => {
  it("accepts exactly four weeks with five days each", () => {
    expect(trainingPlanSchema.safeParse(buildValidPlan()).success).toBe(true);
  });

  it("rejects plans with fewer than four weeks", () => {
    const plan = buildValidPlan();
    plan.weeks = plan.weeks.slice(0, 3);

    expect(trainingPlanSchema.safeParse(plan).success).toBe(false);
  });

  it("rejects tasks outside the estimated minute bounds", () => {
    const plan = buildValidPlan();
    plan.weeks[0].days[0].estimatedMinutes = 60;

    expect(trainingPlanSchema.safeParse(plan).success).toBe(false);
  });
});
