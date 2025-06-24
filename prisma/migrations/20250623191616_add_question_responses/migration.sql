-- CreateTable
CREATE TABLE "QuestionResponse" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "alternative_id" TEXT NOT NULL,
    "collection_id" TEXT,
    "response_time" INTEGER,
    "answered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuestionResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "QuestionResponse_user_id_idx" ON "QuestionResponse"("user_id");

-- CreateIndex
CREATE INDEX "QuestionResponse_question_id_idx" ON "QuestionResponse"("question_id");

-- CreateIndex
CREATE INDEX "QuestionResponse_collection_id_idx" ON "QuestionResponse"("collection_id");

-- CreateIndex
CREATE INDEX "QuestionResponse_user_id_collection_id_idx" ON "QuestionResponse"("user_id", "collection_id");

-- CreateIndex
CREATE INDEX "QuestionResponse_answered_at_idx" ON "QuestionResponse"("answered_at");

-- AddForeignKey
ALTER TABLE "QuestionResponse" ADD CONSTRAINT "QuestionResponse_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionResponse" ADD CONSTRAINT "QuestionResponse_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionResponse" ADD CONSTRAINT "QuestionResponse_alternative_id_fkey" FOREIGN KEY ("alternative_id") REFERENCES "Alternative"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionResponse" ADD CONSTRAINT "QuestionResponse_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
