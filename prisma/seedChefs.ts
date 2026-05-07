import type { PrismaClient } from "@prisma/client";
import { ALL_CHEF_SEEDS } from "../src/data/chefs";

/** Ensures every bundled chef row exists in the database without overwriting existing records. */
export async function seedChefsMerge(prisma: PrismaClient) {
  const agg = await prisma.chef.aggregate({ _max: { sortOrder: true } });
  let nextOrder = (agg._max.sortOrder ?? -1) + 1;

  let created = 0;
  for (const c of ALL_CHEF_SEEDS) {
    const existing = await prisma.chef.findUnique({ where: { slug: c.slug } });
    if (existing) continue;
    await prisma.chef.create({
      data: {
        slug: c.slug,
        name: c.name,
        description: c.excerpt,
        imageUrl: c.imageUrl,
        cuisines: c.cuisines,
        sortOrder: nextOrder++,
      },
    });
    created += 1;
  }

  const total = await prisma.chef.count();
  console.log(`Seed: chefs — ${total} rows in DB (${created} newly created from merge list)`);
}
