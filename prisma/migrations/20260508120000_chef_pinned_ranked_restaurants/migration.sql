-- AlterTable
ALTER TABLE "Chef" ADD COLUMN "pinnedRankedRestaurantIds" JSONB NOT NULL DEFAULT '[]';
