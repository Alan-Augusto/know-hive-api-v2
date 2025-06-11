-- CreateTable
CREATE TABLE "QuestionUserAccess" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "permission_type_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuestionUserAccess_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "QuestionUserAccess_question_id_idx" ON "QuestionUserAccess"("question_id");

-- CreateIndex
CREATE UNIQUE INDEX "QuestionUserAccess_user_id_question_id_key" ON "QuestionUserAccess"("user_id", "question_id");

-- AddForeignKey
ALTER TABLE "QuestionUserAccess" ADD CONSTRAINT "QuestionUserAccess_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionUserAccess" ADD CONSTRAINT "QuestionUserAccess_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionUserAccess" ADD CONSTRAINT "QuestionUserAccess_permission_type_id_fkey" FOREIGN KEY ("permission_type_id") REFERENCES "CollectionPermissionType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
