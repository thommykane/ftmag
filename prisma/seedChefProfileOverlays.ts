import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import type { PrismaClient } from "@prisma/client";
import type { Prisma } from "@prisma/client";

export type ChefProfileOverlayFile = Record<
  string,
  {
    description?: string;
    birthDate?: string | null;
    birthPlace?: string;
    specialtyCuisine?: string;
    awards?: string;
    ownedRestaurants?: unknown;
  }
>;

/** Applies bundled profile copy from chefProfileOverlays.json + optional .supplement.json (idempotent). */
export async function applyChefProfileOverlays(prisma: PrismaClient) {
  const file = path.join(process.cwd(), "src/data/chefProfileOverlays.json");
  const supplementFile = path.join(process.cwd(), "src/data/chefProfileOverlays.supplement.json");

  if (!existsSync(file) && !existsSync(supplementFile)) {
    console.log("Seed: no chefProfileOverlays*.json — skip profile overlays");
    return;
  }

  const rawMain = existsSync(file)
    ? (JSON.parse(readFileSync(file, "utf8")) as ChefProfileOverlayFile)
    : {};
  const rawSup = existsSync(supplementFile)
    ? (JSON.parse(readFileSync(supplementFile, "utf8")) as ChefProfileOverlayFile)
    : {};
  const raw: ChefProfileOverlayFile = { ...rawMain, ...rawSup };
  let updated = 0;
  for (const [slug, o] of Object.entries(raw)) {
    if (!slug || !o || typeof o !== "object") continue;
    const data: Prisma.ChefUpdateManyMutationInput = {};
    if (typeof o.description === "string" && o.description.trim()) data.description = o.description.trim();
    if (o.birthDate === null) data.birthDate = null;
    else if (typeof o.birthDate === "string" && o.birthDate.trim()) {
      const d = new Date(o.birthDate);
      if (!Number.isNaN(d.getTime())) data.birthDate = d;
    }
    if (typeof o.birthPlace === "string") data.birthPlace = o.birthPlace;
    if (typeof o.specialtyCuisine === "string") data.specialtyCuisine = o.specialtyCuisine;
    if (typeof o.awards === "string") data.awards = o.awards;
    if (o.ownedRestaurants !== undefined) {
      data.ownedRestaurants = o.ownedRestaurants as Prisma.InputJsonValue;
    }

    if (Object.keys(data).length === 0) continue;
    const res = await prisma.chef.updateMany({ where: { slug }, data });
    if (res.count) updated += res.count;
  }
  console.log(`Seed: chef profile overlays applied to ${updated} rows`);
}
