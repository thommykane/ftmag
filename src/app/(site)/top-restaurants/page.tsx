import type { Metadata } from "next";
import { TopRestaurantsClient } from "./TopRestaurantsClient";
import { getEuropeRestaurants, getFilterOptions, getItalyRestaurants, getNationalRestaurants } from "@/lib/restaurants-queries";

export const metadata: Metadata = {
  title: "Top Restaurants | Food & Travel Magazine",
  description:
    "America’s top restaurants, Europe’s top tables, and Italy’s leading dining rooms—filters by state, cuisine, and country.",
};

export const dynamic = "force-dynamic";

function parsePage(raw: string | string[] | undefined): number {
  const s = Array.isArray(raw) ? raw[0] : raw;
  const n = parseInt(s ?? "1", 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

export default async function TopRestaurantsPage({
  searchParams,
}: {
  searchParams?: { page?: string | string[] };
}) {
  const currentPage = parsePage(searchParams?.page);

  const [restaurantsNational, restaurantsEurope, restaurantsItaly, filterOptions] = await Promise.all([
    getNationalRestaurants(),
    getEuropeRestaurants(),
    getItalyRestaurants(),
    getFilterOptions(),
  ]);

  return (
    <TopRestaurantsClient
      restaurantsNational={restaurantsNational}
      restaurantsEurope={restaurantsEurope}
      restaurantsItaly={restaurantsItaly}
      filterOptions={filterOptions}
      currentPage={currentPage}
    />
  );
}
