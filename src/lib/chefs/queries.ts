import type { Chef as ChefRow } from "@prisma/client";
import { CHEFS } from "@/data/chefs";
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
  return CHEFS.map((c) => ({
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

export async function getChefBySlug(slug: string): Promise<ChefDTO | null> {
  try {
    const row = await prisma.chef.findUnique({ where: { slug } });
    return row ? toDto(row) : null;
  } catch {
    const c = CHEFS.find((x) => x.slug === slug);
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
