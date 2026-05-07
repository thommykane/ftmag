import type { PrismaClient } from "@prisma/client";
import { EUROPE_500_SEED, EUROPE_REGION_STATE_SLUG } from "@/data/restaurants/europe500Seed";

/** Replace all Europe-ranked rows (1–500) from offline seed. Safe to run when U.S. national rows already exist. */
export async function applyEuropeRestaurantSeed(prisma: PrismaClient): Promise<void> {
  await prisma.restaurant.deleteMany({ where: { europeRank: { not: null } } });

  await prisma.restaurant.createMany({
    data: EUROPE_500_SEED.map((r) => ({
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
      stateSlug: EUROPE_REGION_STATE_SLUG,
      country: r.country,
      nationalRank: null,
      europeRank: r.europeRank,
    })),
  });
}
