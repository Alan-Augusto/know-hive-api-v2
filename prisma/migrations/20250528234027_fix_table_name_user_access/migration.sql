/*
  Warnings:

  - You are about to drop the `CollectionUserAcess` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CollectionUserAcess" DROP CONSTRAINT "CollectionUserAcess_collection_id_fkey";

-- DropForeignKey
ALTER TABLE "CollectionUserAcess" DROP CONSTRAINT "CollectionUserAcess_permission_type_id_fkey";

-- DropForeignKey
ALTER TABLE "CollectionUserAcess" DROP CONSTRAINT "CollectionUserAcess_user_id_fkey";

-- DropTable
DROP TABLE "CollectionUserAcess";

-- CreateTable
CREATE TABLE "CollectionUserAccess" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "collection_id" TEXT NOT NULL,
    "permission_type_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CollectionUserAccess_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CollectionUserAccess_collection_id_idx" ON "CollectionUserAccess"("collection_id");

-- CreateIndex
CREATE UNIQUE INDEX "CollectionUserAccess_user_id_collection_id_key" ON "CollectionUserAccess"("user_id", "collection_id");

-- AddForeignKey
ALTER TABLE "CollectionUserAccess" ADD CONSTRAINT "CollectionUserAccess_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionUserAccess" ADD CONSTRAINT "CollectionUserAccess_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "Collection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionUserAccess" ADD CONSTRAINT "CollectionUserAccess_permission_type_id_fkey" FOREIGN KEY ("permission_type_id") REFERENCES "CollectionPermissionType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
