-- CreateTable
CREATE TABLE "HomePageConfig" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "restaurantEnabled" BOOLEAN NOT NULL DEFAULT true,
    "restaurantTitle" TEXT NOT NULL DEFAULT 'Top Restaurant of the Summer',
    "restaurantSubtitle" TEXT NOT NULL DEFAULT '2026',
    "restaurantMode" TEXT NOT NULL DEFAULT 'auto',
    "restaurantId" TEXT,
    "chefEnabled" BOOLEAN NOT NULL DEFAULT true,
    "chefTitle" TEXT NOT NULL DEFAULT 'Chef of the Month',
    "chefMode" TEXT NOT NULL DEFAULT 'auto',
    "chefId" TEXT,
    "destinationEnabled" BOOLEAN NOT NULL DEFAULT true,
    "destinationTitle" TEXT NOT NULL DEFAULT 'Top Summer Vacation Spot',
    "destinationMode" TEXT NOT NULL DEFAULT 'state',
    "destinationStateSlug" TEXT NOT NULL DEFAULT 'california',
    "articleEnabled" BOOLEAN NOT NULL DEFAULT true,
    "articleTitle" TEXT NOT NULL DEFAULT 'Most Recent Article',
    "articleMode" TEXT NOT NULL DEFAULT 'latest',
    "articleSlug" TEXT,
    "recipeEnabled" BOOLEAN NOT NULL DEFAULT true,
    "recipeTitle" TEXT NOT NULL DEFAULT 'Recipe of the Week',
    "recipeBlurb" TEXT NOT NULL DEFAULT '',
    "recipeHref" TEXT NOT NULL DEFAULT '',
    "recipeImageUrl" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomePageConfig_pkey" PRIMARY KEY ("id")
);
