import { prisma } from "@/lib/prisma";
import { toRestaurantDTO, type RestaurantDTO } from "@/lib/restaurantPublic";

export async function getStateEatRestaurants(stateSlug: string): Promise<RestaurantDTO[]> {
  try {
    const highlightRows = await prisma.stateRestaurantHighlight.findMany({
      where: { stateSlug },
      include: { restaurant: true },
      orderBy: { position: "asc" },
    });
    if (highlightRows.length > 0) {
      return highlightRows.map((h) => toRestaurantDTO(h.restaurant));
    }

    // Fallback 1: use ranked restaurants from this state when no manual highlights exist.
    const rankedStateRows = await prisma.restaurant.findMany({
      where: {
        stateSlug,
        nationalRank: { not: null },
      },
      orderBy: { nationalRank: "asc" },
      take: 8,
    });
    if (rankedStateRows.length > 0) {
      return rankedStateRows.map(toRestaurantDTO);
    }

    // Fallback 2: keep Eat section populated even for states with no entries in the current national set.
    const rankedNationalRows = await prisma.restaurant.findMany({
      where: { nationalRank: { not: null } },
      orderBy: { nationalRank: "asc" },
      take: 8,
    });
    return rankedNationalRows.map(toRestaurantDTO);
  } catch {
    return [];
  }
}

export async function getNationalRestaurants(): Promise<RestaurantDTO[]> {
  const rows = await prisma.restaurant.findMany({
    where: { nationalRank: { not: null } },
    orderBy: { nationalRank: "asc" },
    take: 1000,
  });
  return rows.map(toRestaurantDTO);
}

export async function getFilterOptions(): Promise<{
  cuisines: string[];
  stateSlugs: string[];
  countries: string[];
}> {
  const [cuisineRows, stateRows, countryRows] = await Promise.all([
    prisma.restaurant.findMany({
      where: { nationalRank: { not: null }, cuisine: { not: "" } },
      select: { cuisine: true },
      distinct: ["cuisine"],
    }),
    prisma.restaurant.findMany({
      where: { nationalRank: { not: null }, stateSlug: { not: "" } },
      select: { stateSlug: true },
      distinct: ["stateSlug"],
    }),
    prisma.restaurant.findMany({
      where: { nationalRank: { not: null }, country: { not: "" } },
      select: { country: true },
      distinct: ["country"],
    }),
  ]);
  return {
    cuisines: cuisineRows.map((r) => r.cuisine).sort((a, b) => a.localeCompare(b)),
    stateSlugs: stateRows.map((r) => r.stateSlug).sort((a, b) => a.localeCompare(b)),
    countries: countryRows.map((r) => r.country).sort((a, b) => a.localeCompare(b)),
  };
}
