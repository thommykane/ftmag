import type { PrismaClient } from "@prisma/client";
import { CHEFS } from "../src/data/chefs";

export async function seedChefsIfEmpty(prisma: PrismaClient) {
  const n = await prisma.chef.count();
  if (n > 0) {
    console.log("Seed: chefs already present:", n);
    return;
  }

  let order = 0;
  for (const c of CHEFS) {
    await prisma.chef.create({
      data: {
        slug: c.slug,
        name: c.name,
        description: c.excerpt,
        imageUrl: c.imageUrl,
        cuisines: c.cuisines,
        sortOrder: order++,
      },
    });
  }

  console.log(`Seed: created ${CHEFS.length} chefs from bundled list`);
}
