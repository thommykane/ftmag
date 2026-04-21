-- CreateTable
CREATE TABLE "Chef" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "cuisines" JSONB NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chef_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Chef_slug_key" ON "Chef"("slug");

-- CreateIndex
CREATE INDEX "Chef_sortOrder_idx" ON "Chef"("sortOrder");

-- CreateIndex
CREATE INDEX "Chef_name_idx" ON "Chef"("name");
