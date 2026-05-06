/**
 * Copies openTableUrlsByRank.json into Postgres `Restaurant.openTableUrl` by nationalRank.
 * Run after opentableUrlsByRank.json is filled:
 *   npx tsx scripts/apply-opentable-urls-to-db.ts
 */
import opentableByRank from "../src/data/restaurants/opentableUrlsByRank.json";
import { prisma } from "../src/lib/prisma";

async function main() {
  const entries = Object.entries(opentableByRank as Record<string, string>).filter(
    ([, url]) => typeof url === "string" && url.startsWith("http"),
  );
  let n = 0;
  for (const [rankStr, url] of entries) {
    const rank = Number(rankStr);
    if (!Number.isFinite(rank)) continue;
    const res = await prisma.restaurant.updateMany({
      where: { nationalRank: rank },
      data: { openTableUrl: url.trim() },
    });
    if (res.count) n++;
  }
  console.log(`Updated rows for ${n} national ranks (matched ${entries.length} URL entries).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
