import { prisma } from "@/lib/prisma";
import { toRestaurantDTO, type RestaurantDTO } from "@/lib/restaurantPublic";

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
