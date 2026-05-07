import { prisma } from "@/lib/prisma";
import { toRestaurantDTO, type RestaurantDTO } from "@/lib/restaurantPublic";
import { EUROPE_REGION_STATE_SLUG } from "@/data/restaurants/europe500Seed";

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

export async function getEuropeRestaurants(): Promise<RestaurantDTO[]> {
  const rows = await prisma.restaurant.findMany({
    where: { europeRank: { not: null } },
    orderBy: { europeRank: "asc" },
    take: 500,
  });
  return rows.map(toRestaurantDTO);
}

export async function getFilterOptions(): Promise<{
  cuisines: string[];
  stateSlugs: string[];
  countries: string[];
}> {
  const [cuisineNat, cuisineEu, stateRows, countryNat, countryEu] = await Promise.all([
    prisma.restaurant.findMany({
      where: { nationalRank: { not: null }, cuisine: { not: "" } },
      select: { cuisine: true },
      distinct: ["cuisine"],
    }),
    prisma.restaurant.findMany({
      where: { europeRank: { not: null }, cuisine: { not: "" } },
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
    prisma.restaurant.findMany({
      where: { europeRank: { not: null }, country: { not: "" } },
      select: { country: true },
      distinct: ["country"],
    }),
  ]);

  const cuisines = Array.from(
    new Set([...cuisineNat.map((r) => r.cuisine), ...cuisineEu.map((r) => r.cuisine)]),
  ).sort((a, b) => a.localeCompare(b));

  const countries = Array.from(
    new Set([...countryNat.map((r) => r.country), ...countryEu.map((r) => r.country)]),
  ).sort((a, b) => a.localeCompare(b));

  return {
    cuisines,
    stateSlugs: stateRows.map((r) => r.stateSlug).sort((a, b) => a.localeCompare(b)),
    countries,
  };
}

/** Single restaurant page — composite slug path must match DB. */
export async function getRestaurantByPath(
  stateSlug: string,
  countySlug: string,
  citySlug: string,
  nameSlug: string,
): Promise<RestaurantDTO | null> {
  const row = await prisma.restaurant.findFirst({
    where: { stateSlug, countySlug, citySlug, nameSlug },
  });
  return row ? toRestaurantDTO(row) : null;
}

/** Europe detail — `/top-restaurants/Europe/[country]/[slug]` matches countySlug + nameSlug (state `europe`). */
export async function getRestaurantByEuropePath(
  countrySlug: string,
  nameSlug: string,
): Promise<RestaurantDTO | null> {
  const row = await prisma.restaurant.findFirst({
    where: {
      europeRank: { not: null },
      stateSlug: EUROPE_REGION_STATE_SLUG,
      countySlug: countrySlug,
      nameSlug,
    },
  });
  return row ? toRestaurantDTO(row) : null;
}

/** For county pages — ranked entries in a county (within a state). */
export async function getNationalRestaurantsByCountySlug(
  stateSlug: string,
  countySlug: string,
): Promise<RestaurantDTO[]> {
  const rows = await prisma.restaurant.findMany({
    where: { nationalRank: { not: null }, stateSlug, countySlug },
    orderBy: { nationalRank: "asc" },
    take: 1000,
  });
  return rows.map(toRestaurantDTO);
}

/** For city pages — ranked entries in a city (within state + county). */
export async function getNationalRestaurantsByCitySlug(
  stateSlug: string,
  countySlug: string,
  citySlug: string,
): Promise<RestaurantDTO[]> {
  const rows = await prisma.restaurant.findMany({
    where: { nationalRank: { not: null }, stateSlug, countySlug, citySlug },
    orderBy: { nationalRank: "asc" },
    take: 1000,
  });
  return rows.map(toRestaurantDTO);
}
