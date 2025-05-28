-- CreateTable
CREATE TABLE "CollectionPermissionType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "CollectionPermissionType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectionUserAcess" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "collection_id" TEXT NOT NULL,
    "permission_type_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CollectionUserAcess_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CollectionPermissionType_name_key" ON "CollectionPermissionType"("name");

-- CreateIndex
CREATE INDEX "CollectionUserAcess_collection_id_idx" ON "CollectionUserAcess"("collection_id");

-- CreateIndex
CREATE UNIQUE INDEX "CollectionUserAcess_user_id_collection_id_key" ON "CollectionUserAcess"("user_id", "collection_id");

-- AddForeignKey
ALTER TABLE "CollectionUserAcess" ADD CONSTRAINT "CollectionUserAcess_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionUserAcess" ADD CONSTRAINT "CollectionUserAcess_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "Collection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionUserAcess" ADD CONSTRAINT "CollectionUserAcess_permission_type_id_fkey" FOREIGN KEY ("permission_type_id") REFERENCES "CollectionPermissionType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
