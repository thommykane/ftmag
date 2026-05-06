-- AlterTable
ALTER TABLE "Magazine" ADD COLUMN "flipbookUrl" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Magazine" ADD COLUMN "subscribeUrl" TEXT;
ALTER TABLE "Magazine" ALTER COLUMN "pdfSrc" SET DEFAULT '';

-- Seed flipbook URLs for known issues (magazines.foodandtravelmagazine.com branded reader)
UPDATE "Magazine" SET "flipbookUrl" = 'https://magazines.foodandtravelmagazine.com/books/cbkx/' WHERE slug = 'spring-2026';
UPDATE "Magazine" SET "flipbookUrl" = 'https://magazines.foodandtravelmagazine.com/books/izvi/' WHERE slug = 'winter-2025';
UPDATE "Magazine" SET "flipbookUrl" = 'https://magazines.foodandtravelmagazine.com/books/qvsx/' WHERE slug = 'holiday-2025';
UPDATE "Magazine" SET "flipbookUrl" = 'https://magazines.foodandtravelmagazine.com/books/xwzn/' WHERE slug = 'fall-2025';
UPDATE "Magazine" SET "flipbookUrl" = 'https://magazines.foodandtravelmagazine.com/books/nulq/' WHERE slug = 'summer-2025';
