-- CreateTable
CREATE TABLE "Magazine" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "displayTitle" TEXT NOT NULL,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "releaseLabel" TEXT NOT NULL,
    "blurb" TEXT NOT NULL,
    "coverSrc" TEXT NOT NULL,
    "pdfSrc" TEXT NOT NULL,
    "purchaseUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Magazine_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Magazine_slug_key" ON "Magazine"("slug");

-- CreateIndex
CREATE INDEX "Magazine_releaseDate_idx" ON "Magazine"("releaseDate");
