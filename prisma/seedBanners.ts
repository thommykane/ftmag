import { PrismaClient } from "@prisma/client";
import { applyAdBannerSeed } from "../src/lib/seedAdBanners";

const prisma = new PrismaClient();

async function main() {
  const n = await applyAdBannerSeed(prisma);
  console.log(n > 0 ? `Ad banner seed: applied ${n} default slides.` : "Ad banner seed: rows already present.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
