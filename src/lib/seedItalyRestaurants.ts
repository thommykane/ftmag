import type { PrismaClient } from "@prisma/client";
import { ITALY_78_SEED, ITALY_REGION_STATE_SLUG } from "@/data/restaurants/italy78Seed";

/** Replace Italy-ranked rows from bundled seed (78 venues). */
export async function applyItalyRestaurantSeed(prisma: PrismaClient): Promise<void> {
  await prisma.restaurant.deleteMany({ where: { italyRank: { not: null } } });

  for (const r of ITALY_78_SEED) {
    await prisma.restaurant.create({
      data: {
        name: r.name,
        address: r.address,
        phone: r.phone,
        website: r.website,
        openTableUrl: r.openTableUrl,
        cuisine: r.cuisine,
        city: r.city,
        county: r.county,
        citySlug: r.citySlug,
        countySlug: r.countySlug,
        nameSlug: r.nameSlug,
        owner: r.owner,
        headChef: r.headChef,
        awards: r.awards,
        thumbnailUrl: r.thumbnailUrl,
        stateSlug: ITALY_REGION_STATE_SLUG,
        country: r.country,
        nationalRank: null,
        europeRank: null,
        italyRank: r.italyRank,
      },
    });
  }
}
