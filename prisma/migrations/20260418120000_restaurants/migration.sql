-- CreateTable
CREATE TABLE "Restaurant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "website" TEXT NOT NULL DEFAULT '',
    "openTableUrl" TEXT NOT NULL DEFAULT '',
    "cuisine" TEXT NOT NULL DEFAULT '',
    "ownerChef" TEXT NOT NULL DEFAULT '',
    "awards" TEXT NOT NULL DEFAULT '—',
    "thumbnailUrl" TEXT NOT NULL DEFAULT '',
    "stateSlug" TEXT NOT NULL DEFAULT '',
    "country" TEXT NOT NULL DEFAULT 'United States',
    "nationalRank" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Restaurant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StateRestaurantHighlight" (
    "id" TEXT NOT NULL,
    "stateSlug" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "StateRestaurantHighlight_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Restaurant_nationalRank_key" ON "Restaurant"("nationalRank");

-- CreateIndex
CREATE INDEX "Restaurant_stateSlug_idx" ON "Restaurant"("stateSlug");

-- CreateIndex
CREATE INDEX "Restaurant_country_idx" ON "Restaurant"("country");

-- CreateIndex
CREATE INDEX "Restaurant_cuisine_idx" ON "Restaurant"("cuisine");

-- CreateIndex
CREATE UNIQUE INDEX "StateRestaurantHighlight_stateSlug_position_key" ON "StateRestaurantHighlight"("stateSlug", "position");

-- CreateIndex
CREATE UNIQUE INDEX "StateRestaurantHighlight_stateSlug_restaurantId_key" ON "StateRestaurantHighlight"("stateSlug", "restaurantId");

-- CreateIndex
CREATE INDEX "StateRestaurantHighlight_stateSlug_idx" ON "StateRestaurantHighlight"("stateSlug");

-- AddForeignKey
ALTER TABLE "StateRestaurantHighlight" ADD CONSTRAINT "StateRestaurantHighlight_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
