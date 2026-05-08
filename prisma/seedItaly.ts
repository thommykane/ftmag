import { PrismaClient } from "@prisma/client";
import { applyItalyRestaurantSeed } from "../src/lib/seedItalyRestaurants";

const prisma = new PrismaClient();

async function main() {
  await applyItalyRestaurantSeed(prisma);
  console.log("Italy seed: applied 78 ranked restaurants.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
