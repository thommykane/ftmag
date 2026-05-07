import { PrismaClient } from "@prisma/client";
import { applyEuropeRestaurantSeed } from "../src/lib/seedEuropeRestaurants";

const prisma = new PrismaClient();

async function main() {
  await applyEuropeRestaurantSeed(prisma);
  console.log("Europe seed: replaced europeRank 1–500 rows.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
