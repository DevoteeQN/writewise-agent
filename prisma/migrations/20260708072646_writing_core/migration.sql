/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropTable
DROP TABLE "Post";

-- CreateTable
CREATE TABLE "WritingPrompt" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "targetSkill" TEXT NOT NULL,
    "wordLimit" INTEGER NOT NULL,
    "estimatedMinutes" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WritingPrompt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Essay" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "promptId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'submitted',
    "wordCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Essay_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WritingPrompt_title_key" ON "WritingPrompt"("title");

-- CreateIndex
CREATE INDEX "Essay_userId_idx" ON "Essay"("userId");

-- CreateIndex
CREATE INDEX "Essay_promptId_idx" ON "Essay"("promptId");

-- AddForeignKey
ALTER TABLE "Essay" ADD CONSTRAINT "Essay_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Essay" ADD CONSTRAINT "Essay_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "WritingPrompt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
