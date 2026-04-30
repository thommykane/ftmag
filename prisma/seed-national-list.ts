/**
 * Replaces all Restaurant + StateRestaurantHighlight rows with the offline national list (1000 ranks).
 * Run: npm run db:seed-national
 * Requires DATABASE_URL (e.g. production or local).
 */
import { PrismaClient } from "@prisma/client";
import { applyNationalRestaurantSeed } from "../src/lib/seedNationalRestaurants";

const prisma = new PrismaClient();

async function main() {
  await applyNationalRestaurantSeed(prisma);
  console.log("National restaurant list applied (1000 ranks + California Eat picks).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
