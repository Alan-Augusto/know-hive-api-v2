/*
  Warnings:

  - You are about to drop the column `alternative_id` on the `QuestionResponse` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "QuestionResponse" DROP CONSTRAINT "QuestionResponse_alternative_id_fkey";

-- AlterTable
ALTER TABLE "QuestionResponse" DROP COLUMN "alternative_id",
ADD COLUMN     "attempt_number" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "is_final" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "ResponseAlternative" (
    "id" TEXT NOT NULL,
    "response_id" TEXT NOT NULL,
    "alternative_id" TEXT NOT NULL,

    CONSTRAINT "ResponseAlternative_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ResponseAlternative_response_id_idx" ON "ResponseAlternative"("response_id");

-- CreateIndex
CREATE INDEX "ResponseAlternative_alternative_id_idx" ON "ResponseAlternative"("alternative_id");

-- CreateIndex
CREATE UNIQUE INDEX "ResponseAlternative_response_id_alternative_id_key" ON "ResponseAlternative"("response_id", "alternative_id");

-- CreateIndex
CREATE INDEX "QuestionResponse_user_id_question_id_attempt_number_idx" ON "QuestionResponse"("user_id", "question_id", "attempt_number");

-- CreateIndex
CREATE INDEX "QuestionResponse_user_id_question_id_is_final_idx" ON "QuestionResponse"("user_id", "question_id", "is_final");

-- AddForeignKey
ALTER TABLE "ResponseAlternative" ADD CONSTRAINT "ResponseAlternative_response_id_fkey" FOREIGN KEY ("response_id") REFERENCES "QuestionResponse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponseAlternative" ADD CONSTRAINT "ResponseAlternative_alternative_id_fkey" FOREIGN KEY ("alternative_id") REFERENCES "Alternative"("id") ON DELETE CASCADE ON UPDATE CASCADE;
