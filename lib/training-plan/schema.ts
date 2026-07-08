import { z } from "zod";

export const trainingPlanDaySchema = z
  .object({
    day: z.number().int().min(1).max(5),
    taskTitle: z.string().min(1).max(160),
    taskDescription: z.string().min(1).max(1200),
    targetSkill: z.string().min(1).max(100),
    estimatedMinutes: z.number().int().min(10).max(45),
  })
  .strict();

export const trainingPlanWeekSchema = z
  .object({
    week: z.number().int().min(1).max(4),
    theme: z.string().min(1).max(160),
    days: z.array(trainingPlanDaySchema).length(5),
  })
  .strict();

export const trainingPlanSchema = z
  .object({
    title: z.string().min(1).max(180),
    level: z.string().min(1).max(80),
    focusSummary: z.string().min(1).max(1000),
    weeks: z.array(trainingPlanWeekSchema).length(4),
  })
  .strict()
  .superRefine((plan, context) => {
    const weekNumbers = plan.weeks.map((week) => week.week);
    if (new Set(weekNumbers).size !== 4 || ![1, 2, 3, 4].every((week) => weekNumbers.includes(week))) {
      context.addIssue({
        code: "custom",
        message: "Training plan must contain weeks 1 through 4 exactly once.",
        path: ["weeks"],
      });
    }

    plan.weeks.forEach((week, weekIndex) => {
      const dayNumbers = week.days.map((day) => day.day);
      if (new Set(dayNumbers).size !== 5 || ![1, 2, 3, 4, 5].every((day) => dayNumbers.includes(day))) {
        context.addIssue({
          code: "custom",
          message: "Each week must contain days 1 through 5 exactly once.",
          path: ["weeks", weekIndex, "days"],
        });
      }
    });
  });

export type TrainingPlanOutput = z.infer<typeof trainingPlanSchema>;
