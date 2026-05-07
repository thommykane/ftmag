import type { Chef as ChefRow } from "@prisma/client";
import { ALL_CHEF_SEEDS } from "@/data/chefs";
import { prisma } from "@/lib/prisma";

/** Public chef shape for Top Chefs UI and profile pages */
export type ChefDTO = {
  id: string;
  slug: string;
  name: string;
  description: string;
  cuisines: string[];
  imageUrl: string;
};

function toDto(row: ChefRow): ChefDTO {
  const cuisines = Array.isArray(row.cuisines)
    ? (row.cuisines as unknown[]).filter((x): x is string => typeof x === "string")
    : [];
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    cuisines,
    imageUrl: row.imageUrl,
  };
}

/** When DB is unavailable (e.g. CI before migrate), use bundled seed rows for read-only pages. */
function legacyDtoFromSeed(): ChefDTO[] {
  return ALL_CHEF_SEEDS.map((c) => ({
    id: `seed-${c.slug}`,
    slug: c.slug,
    name: c.name,
    description: c.excerpt,
    cuisines: c.cuisines,
    imageUrl: c.imageUrl,
  }));
}

export async function getAllChefsOrdered(): Promise<ChefDTO[]> {
  try {
    const rows = await prisma.chef.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
    return rows.map(toDto);
  } catch {
    return legacyDtoFromSeed();
  }
}

/** First twelve names from the editorial directory list — default grid on /top-chefs (not cuisine sub-routes). */
export const TOP_CHEFS_DEFAULT_SLUGS = [
  "gordon-ramsay",
  "massimo-bottura",
  "alain-ducasse",
  "joel-robuchon",
  "thomas-keller",
  "rene-redzepi",
  "ferran-adria",
  "heston-blumenthal",
  "wolfgang-puck",
  "daniel-boulud",
  "eric-ripert",
  "grant-achatz",
] as const;

/** Picks and orders chefs for the main Top Chefs landing; missing slugs are skipped. */
export function chefsForDefaultTopChefsPage(all: ChefDTO[]): ChefDTO[] {
  const bySlug = new Map(all.map((c) => [c.slug, c]));
  const out: ChefDTO[] = [];
  for (const slug of TOP_CHEFS_DEFAULT_SLUGS) {
    const row = bySlug.get(slug);
    if (row) out.push(row);
  }
  return out;
}

export async function getChefBySlug(slug: string): Promise<ChefDTO | null> {
  try {
    const row = await prisma.chef.findUnique({ where: { slug } });
    return row ? toDto(row) : null;
  } catch {
    const c = ALL_CHEF_SEEDS.find((x) => x.slug === slug);
    if (!c) return null;
    return {
      id: `seed-${c.slug}`,
      slug: c.slug,
      name: c.name,
      description: c.excerpt,
      cuisines: c.cuisines,
      imageUrl: c.imageUrl,
    };
  }
}

export async function getNextSortOrder(): Promise<number> {
  const agg = await prisma.chef.aggregate({ _max: { sortOrder: true } });
  return (agg._max.sortOrder ?? -1) + 1;
}
