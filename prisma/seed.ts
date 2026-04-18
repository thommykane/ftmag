import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { US_STATES_ALPHABETICAL } from "../src/data/states/usStates";

const prisma = new PrismaClient();

const ADMIN_EMAIL = "tkane@foodandtravel.net";
const TEMP_PASSWORD = "12345678";

const CUISINES = [
  "American",
  "Italian",
  "French",
  "Japanese",
  "Mexican",
  "Steakhouse",
  "Seafood",
  "Farm-to-table",
  "Californian",
  "Southern",
  "Chinese",
  "Indian",
  "Spanish",
  "Korean",
  "Peruvian",
];

async function ensureAdmin() {
  const existing = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });
  if (existing) {
    console.log("Seed: admin user already exists:", ADMIN_EMAIL);
    return;
  }

  await prisma.user.create({
    data: {
      email: ADMIN_EMAIL,
      name: "Admin",
      passwordHash: await bcrypt.hash(TEMP_PASSWORD, 12),
      isAdmin: true,
      mustChangePassword: true,
    },
  });

  console.log("Seed: created admin", ADMIN_EMAIL, "(must change password on first login)");
}

async function seedRestaurantsIfEmpty() {
  const n = await prisma.restaurant.count();
  if (n > 0) {
    console.log("Seed: restaurants already present:", n);
    return;
  }

  const states = US_STATES_ALPHABETICAL;

  for (let rank = 1; rank <= 150; rank++) {
    const row = states[(rank - 1) % states.length];
    const stateSlug = row.slug;
    await prisma.restaurant.create({
      data: {
        name: `FTMAG Table ${rank}`,
        address: `${rank} Culinary Avenue, Sample City, ${row.abbr} ${10000 + rank}`,
        email: `dining${rank}@example.com`,
        phone: `+1 555 010 ${String(rank).padStart(4, "0")}`,
        website: `https://example.com/restaurants/${rank}`,
        openTableUrl: rank % 4 === 0 ? `https://www.opentable.com/r/${rank}` : "",
        cuisine: CUISINES[rank % CUISINES.length],
        ownerChef: `Chef Placeholder ${rank}`,
        awards: rank % 7 === 0 ? "Illustrative award — replace in admin" : "—",
        thumbnailUrl: `https://picsum.photos/seed/ftmag${rank}/75/75`,
        stateSlug,
        country: "United States",
        nationalRank: rank,
      },
    });
  }

  const ca = await prisma.restaurant.findMany({
    where: { stateSlug: "california" },
    orderBy: { nationalRank: "asc" },
    take: 8,
  });

  const need = 8 - ca.length;
  const extra: { id: string }[] = [];
  for (let i = 0; i < need; i++) {
    const r = await prisma.restaurant.create({
      data: {
        name: `California Guest Table ${i + 1}`,
        address: `${200 + i} Pacific Ave, Los Angeles, CA 9000${i}`,
        email: `caguest${i}@example.com`,
        phone: `+1 310 555 ${String(2000 + i).padStart(4, "0")}`,
        website: "https://example.com",
        cuisine: "Californian",
        ownerChef: "TBD",
        awards: "—",
        thumbnailUrl: `https://picsum.photos/seed/caguest${i}/75/75`,
        stateSlug: "california",
        country: "United States",
        nationalRank: null,
      },
    });
    extra.push(r);
  }

  const allCa = [...ca, ...extra].slice(0, 8);
  for (let i = 0; i < allCa.length; i++) {
    await prisma.stateRestaurantHighlight.create({
      data: {
        stateSlug: "california",
        position: i + 1,
        restaurantId: allCa[i].id,
      },
    });
  }

  console.log("Seed: created 150 nationally ranked restaurants + California Eat picks");
}

async function main() {
  await ensureAdmin();
  await seedRestaurantsIfEmpty();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
