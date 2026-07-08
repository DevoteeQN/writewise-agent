-- CreateTable
CREATE TABLE "AIFeedback" (
    "id" SERIAL NOT NULL,
    "essayId" INTEGER NOT NULL,
    "overallScore" DOUBLE PRECISION NOT NULL,
    "taskResponseScore" DOUBLE PRECISION NOT NULL,
    "coherenceScore" DOUBLE PRECISION NOT NULL,
    "lexicalScore" DOUBLE PRECISION NOT NULL,
    "grammarScore" DOUBLE PRECISION NOT NULL,
    "summary" TEXT NOT NULL,
    "sentenceFeedbackJson" JSONB NOT NULL,
    "improvedVersion" TEXT NOT NULL,
    "weaknessTagsJson" JSONB NOT NULL,
    "nextExercise" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AIFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AIFeedback_essayId_idx" ON "AIFeedback"("essayId");

-- AddForeignKey
ALTER TABLE "AIFeedback" ADD CONSTRAINT "AIFeedback_essayId_fkey" FOREIGN KEY ("essayId") REFERENCES "Essay"("id") ON DELETE CASCADE ON UPDATE CASCADE;
