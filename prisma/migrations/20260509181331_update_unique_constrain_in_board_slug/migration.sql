/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `feedback` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "feedback_slug_boardId_key";

-- CreateIndex
CREATE UNIQUE INDEX "feedback_slug_key" ON "feedback"("slug");
