-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN "italyRank" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Restaurant_italyRank_key" ON "Restaurant"("italyRank");
