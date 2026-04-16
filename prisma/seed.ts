import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const ADMIN_EMAIL = "tkane@foodandtravel.net";
const TEMP_PASSWORD = "12345678";

async function main() {
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

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
