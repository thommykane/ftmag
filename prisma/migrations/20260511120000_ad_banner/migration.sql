-- CreateTable
CREATE TABLE "AdBanner" (
    "id" TEXT NOT NULL,
    "imageSrc" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "label" TEXT NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdBanner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AdBanner_sortOrder_idx" ON "AdBanner"("sortOrder");
