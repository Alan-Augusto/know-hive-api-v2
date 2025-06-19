-- AlterTable
ALTER TABLE "Collection" ADD COLUMN     "is_public" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "is_public" BOOLEAN NOT NULL DEFAULT false;
