-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN "europeRank" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Restaurant_europeRank_key" ON "Restaurant"("europeRank");
