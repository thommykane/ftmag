import { prisma } from "@/lib/prisma";
import { toRestaurantDTO, type RestaurantDTO } from "@/lib/restaurantPublic";

export type RankedRestaurantsSource = "pinned" | "auto";

/**
 * Pinned Restaurant ids (from admin) take precedence; otherwise match owner/headChef text to the chef name.
 */
export async function getRankedRestaurantsForChefProfile(
  chefDisplayName: string,
  pinnedIds: string[],
): Promise<{ rows: RestaurantDTO[]; source: RankedRestaurantsSource }> {
  const uniquePins = Array.from(new Set(pinnedIds.filter(Boolean)));
  if (uniquePins.length > 0) {
    const found = await prisma.restaurant.findMany({
      where: {
        id: { in: uniquePins },
        nationalRank: { not: null },
      },
    });
    const byId = new Map(found.map((r) => [r.id, r]));
    const ordered = uniquePins.map((id) => byId.get(id)).filter((r): r is NonNullable<typeof r> => Boolean(r));
    ordered.sort((a, b) => (a.nationalRank ?? 99_999) - (b.nationalRank ?? 99_999));
    return { rows: ordered.map(toRestaurantDTO), source: "pinned" };
  }
  const rows = await getNationalRankedRestaurantsForChef(chefDisplayName);
  return { rows, source: "auto" };
}

/**
 * U.S. national list rows where owner or head chef text mentions this chef (by last name + full normalized name).
 */
export async function getNationalRankedRestaurantsForChef(chefDisplayName: string): Promise<RestaurantDTO[]> {
  const normalized = chefDisplayName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
  const parts = normalized.split(/\s+/).filter(Boolean);
  const lastName = parts[parts.length - 1] ?? "";
  if (lastName.length < 2) return [];

  const nameOr = [
    { headChef: { contains: lastName, mode: "insensitive" as const } },
    { owner: { contains: lastName, mode: "insensitive" as const } },
  ];
  if (normalized.length >= 4) {
    nameOr.push({ headChef: { contains: normalized, mode: "insensitive" as const } });
  }

  const rows = await prisma.restaurant.findMany({
    where: {
      nationalRank: { not: null },
      OR: nameOr,
    },
    orderBy: { nationalRank: "asc" },
  });

  return rows.map(toRestaurantDTO);
}
