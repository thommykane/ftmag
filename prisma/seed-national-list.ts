/**
 * Replaces all Restaurant + StateRestaurantHighlight rows with the offline national 150 list.
 * Run: npm run db:seed-national
 * Requires DATABASE_URL (e.g. production or local).
 */
import { PrismaClient } from "@prisma/client";
import { applyNationalRestaurantSeed } from "../src/lib/seedNationalRestaurants";

const prisma = new PrismaClient();

async function main() {
  await applyNationalRestaurantSeed(prisma);
  console.log("National restaurant list applied (150 rows + California Eat picks).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
