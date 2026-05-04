/**
 * Recompute city, county, citySlug, countySlug for every restaurant from `address`
 * (ZIP → city/county via zipcodes-us). Run after deploy: npx tsx scripts/backfill-restaurant-geo.ts
 */
import { prisma } from "../src/lib/prisma";
import { restaurantGeoFromAddress } from "../src/lib/usRestaurantGeo";

async function main() {
  const rows = await prisma.restaurant.findMany({ select: { id: true, address: true } });
  let n = 0;
  for (const r of rows) {
    const geo = restaurantGeoFromAddress(r.address);
    await prisma.restaurant.update({
      where: { id: r.id },
      data: {
        city: geo.city,
        county: geo.county,
        citySlug: geo.citySlug,
        countySlug: geo.countySlug,
      },
    });
    n++;
    if (n % 200 === 0) console.log(`Updated ${n}/${rows.length}`);
  }
  console.log(`Done. Updated ${n} restaurants.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
