import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { seedMagazinesIfEmpty } from "./seedMagazines";
import { seedChefsIfEmpty } from "./seedChefs";
import { applyNationalRestaurantSeed } from "../src/lib/seedNationalRestaurants";

const prisma = new PrismaClient();

const ADMIN_EMAIL = "tkane@foodandtravel.net";
const TEMP_PASSWORD = "12345678";

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

  await applyNationalRestaurantSeed(prisma);
  console.log("Seed: applied offline national list (1000 ranks) + California Eat picks");
}

async function main() {
  await ensureAdmin();
  await seedRestaurantsIfEmpty();
  await seedChefsIfEmpty(prisma);
  await seedMagazinesIfEmpty(prisma);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
