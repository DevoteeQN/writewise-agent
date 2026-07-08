-- CreateTable
CREATE TABLE "TrainingPlan" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "sourceEssayId" INTEGER,
    "sourceFeedbackId" INTEGER,
    "title" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "focusSummary" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainingPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingPlanItem" (
    "id" SERIAL NOT NULL,
    "planId" INTEGER NOT NULL,
    "week" INTEGER NOT NULL,
    "day" INTEGER NOT NULL,
    "theme" TEXT NOT NULL,
    "taskTitle" TEXT NOT NULL,
    "taskDescription" TEXT NOT NULL,
    "targetSkill" TEXT NOT NULL,
    "estimatedMinutes" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainingPlanItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TrainingPlan_userId_idx" ON "TrainingPlan"("userId");

-- CreateIndex
CREATE INDEX "TrainingPlan_sourceEssayId_idx" ON "TrainingPlan"("sourceEssayId");

-- CreateIndex
CREATE INDEX "TrainingPlan_sourceFeedbackId_idx" ON "TrainingPlan"("sourceFeedbackId");

-- CreateIndex
CREATE INDEX "TrainingPlanItem_planId_idx" ON "TrainingPlanItem"("planId");

-- CreateIndex
CREATE UNIQUE INDEX "TrainingPlanItem_planId_week_day_key" ON "TrainingPlanItem"("planId", "week", "day");

-- AddForeignKey
ALTER TABLE "TrainingPlan" ADD CONSTRAINT "TrainingPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingPlan" ADD CONSTRAINT "TrainingPlan_sourceEssayId_fkey" FOREIGN KEY ("sourceEssayId") REFERENCES "Essay"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingPlan" ADD CONSTRAINT "TrainingPlan_sourceFeedbackId_fkey" FOREIGN KEY ("sourceFeedbackId") REFERENCES "AIFeedback"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingPlanItem" ADD CONSTRAINT "TrainingPlanItem_planId_fkey" FOREIGN KEY ("planId") REFERENCES "TrainingPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
