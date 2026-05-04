-- Add new columns (keep email/ownerChef until backfill)
ALTER TABLE "Restaurant" ADD COLUMN IF NOT EXISTS "city" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Restaurant" ADD COLUMN IF NOT EXISTS "county" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Restaurant" ADD COLUMN IF NOT EXISTS "citySlug" TEXT NOT NULL DEFAULT 'unknown';
ALTER TABLE "Restaurant" ADD COLUMN IF NOT EXISTS "countySlug" TEXT NOT NULL DEFAULT 'unknown';
ALTER TABLE "Restaurant" ADD COLUMN IF NOT EXISTS "nameSlug" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Restaurant" ADD COLUMN IF NOT EXISTS "owner" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Restaurant" ADD COLUMN IF NOT EXISTS "headChef" TEXT NOT NULL DEFAULT '';

-- Copy legacy combined field
UPDATE "Restaurant" SET "owner" = "ownerChef", "headChef" = "ownerChef" WHERE "owner" = '' AND "headChef" = '';

-- URL slug: kebab(name) + rank or id tail (unique per row)
UPDATE "Restaurant" SET "nameSlug" = CONCAT(
  COALESCE(
    NULLIF(
      TRIM(BOTH '-' FROM LOWER(REGEXP_REPLACE(REGEXP_REPLACE(TRIM("name"), '[^a-zA-Z0-9]+', '-', 'g'), '-+', '-', 'g'))),
      ''
    ),
    'restaurant'
  ),
  '-',
  COALESCE("nationalRank"::text, SUBSTRING("id" FROM 1 FOR 8))
)
WHERE "nameSlug" = '' OR TRIM("nameSlug") = '';

-- Drop removed columns
ALTER TABLE "Restaurant" DROP COLUMN IF EXISTS "email";
ALTER TABLE "Restaurant" DROP COLUMN IF EXISTS "ownerChef";

-- Unique path for public restaurant pages
CREATE UNIQUE INDEX "Restaurant_stateSlug_countySlug_citySlug_nameSlug_key" ON "Restaurant"("stateSlug", "countySlug", "citySlug", "nameSlug");

CREATE INDEX "Restaurant_citySlug_idx" ON "Restaurant"("citySlug");
CREATE INDEX "Restaurant_countySlug_idx" ON "Restaurant"("countySlug");
CREATE INDEX "Restaurant_nameSlug_idx" ON "Restaurant"("nameSlug");
