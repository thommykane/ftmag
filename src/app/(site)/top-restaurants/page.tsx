import type { Metadata } from "next";
import { TopRestaurantsClient } from "./TopRestaurantsClient";
import { getFilterOptions, getNationalRestaurants } from "@/lib/restaurants-queries";

export const metadata: Metadata = {
  title: "Top Restaurants | Food & Travel Magazine",
  description: "America’s top restaurants—national rankings, filters by state, cuisine, and country.",
};

export const dynamic = "force-dynamic";

export default async function TopRestaurantsPage() {
  const [restaurants, filterOptions] = await Promise.all([
    getNationalRestaurants(),
    getFilterOptions(),
  ]);

  return <TopRestaurantsClient restaurants={restaurants} filterOptions={filterOptions} />;
}
