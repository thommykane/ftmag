import { PrismaClient } from "@prisma/client";
import { normalizeDatabaseUrl } from "@/lib/databaseUrl";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const dbUrl = normalizeDatabaseUrl(process.env.DATABASE_URL);

if (process.env.VERCEL === "1" && process.env.DATABASE_URL?.includes("127.0.0.1")) {
  console.error(
    "[prisma] DATABASE_URL points to 127.0.0.1 on Vercel — use your host’s Postgres URL in Project → Environment Variables.",
  );
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    ...(dbUrl ? { datasources: { db: { url: dbUrl } } } : {}),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

globalForPrisma.prisma = prisma;
