-- AlterTable
ALTER TABLE "Chef" ADD COLUMN     "birthDate" TIMESTAMP(3),
ADD COLUMN     "birthPlace" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "specialtyCuisine" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "awards" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "ownedRestaurants" JSONB NOT NULL DEFAULT '[]';

-- René Redzepi — rich profile for /top-chefs/rene-redzepi
UPDATE "Chef" SET
  "birthDate" = '1977-12-16 00:00:00',
  "birthPlace" = 'Copenhagen, Denmark',
  "specialtyCuisine" = 'New Nordic / progressive fine dining',
  "awards" = 'Noma: 3 Michelin stars • The World''s 50 Best — #1 (multiple years) • Time 100 • Global recognition for foraging, fermentation, and redefining Nordic cuisine.',
  "ownedRestaurants" = '[
    {"name":"Noma","location":"Copenhagen, Denmark","role":"Co-founder & executive chef (reimagined service through 2024)"},
    {"name":"Noma Projects","location":"Copenhagen, Denmark","role":"R&D, fermentation lab & guest experiences"}
  ]'::jsonb
WHERE "slug" = 'rene-redzepi';
