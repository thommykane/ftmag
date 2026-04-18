import type { PrismaClient } from "@prisma/client";
import { NATIONAL_150_SEED } from "@/data/restaurants/national150Seed";

/** Replace all restaurants + highlights with the offline national list + California Eat picks. */
export async function applyNationalRestaurantSeed(prisma: PrismaClient): Promise<void> {
  await prisma.stateRestaurantHighlight.deleteMany();
  await prisma.restaurant.deleteMany();

  for (const r of NATIONAL_150_SEED) {
    await prisma.restaurant.create({
      data: {
        name: r.name,
        address: r.address,
        email: r.email,
        phone: r.phone,
        website: r.website,
        openTableUrl: r.openTableUrl,
        cuisine: r.cuisine,
        ownerChef: r.ownerChef,
        awards: r.awards,
        thumbnailUrl: r.thumbnailUrl,
        stateSlug: r.stateSlug,
        country: r.country,
        nationalRank: r.nationalRank,
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
