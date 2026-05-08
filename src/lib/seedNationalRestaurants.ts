import type { PrismaClient } from "@prisma/client";
import { NATIONAL_150_SEED } from "@/data/restaurants/national150Seed";

/** Replace nationally ranked U.S. rows + highlights; leaves Europe-ranked rows untouched. */
export async function applyNationalRestaurantSeed(prisma: PrismaClient): Promise<void> {
  await prisma.stateRestaurantHighlight.deleteMany();
  await prisma.restaurant.deleteMany({ where: { nationalRank: { not: null } } });

  for (const r of NATIONAL_150_SEED) {
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
        stateSlug: r.stateSlug,
        country: r.country,
        nationalRank: r.nationalRank,
        europeRank: null,
        italyRank: null,
      },
    });
  }

  const ca = await prisma.restaurant.findMany({
    where: { stateSlug: "california" },
    orderBy: { nationalRank: "asc" },
    take: 8,
  });

  for (let i = 0; i < ca.length; i++) {
    await prisma.stateRestaurantHighlight.create({
      data: {
        stateSlug: "california",
        position: i + 1,
        restaurantId: ca[i].id,
      },
    });
  }
}
