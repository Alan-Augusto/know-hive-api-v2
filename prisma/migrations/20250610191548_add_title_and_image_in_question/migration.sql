-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "image_url" TEXT,
ADD COLUMN     "title" TEXT NOT NULL DEFAULT 'Título';
