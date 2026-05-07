import { slugifySegment } from "@/lib/restaurantSlug";

/** European countries represented across the 500 placeholder rows (editorial can refine later). */
export const EU_COUNTRY_POOL = [
  "France",
  "Italy",
  "Spain",
  "Germany",
  "United Kingdom",
  "Netherlands",
  "Belgium",
  "Switzerland",
  "Austria",
  "Portugal",
  "Greece",
  "Sweden",
  "Norway",
  "Denmark",
  "Finland",
  "Poland",
  "Czech Republic",
  "Hungary",
  "Romania",
  "Ireland",
  "Croatia",
  "Slovenia",
  "Luxembourg",
  "Malta",
  "Cyprus",
  "Estonia",
  "Latvia",
  "Lithuania",
  "Slovakia",
  "Bulgaria",
] as const;

export type EuropeSeedRow = {
  europeRank: number;
  name: string;
  address: string;
  phone: string;
  website: string;
  openTableUrl: string;
  cuisine: string;
  city: string;
  county: string;
  citySlug: string;
  countySlug: string;
  nameSlug: string;
  owner: string;
  headChef: string;
  awards: string;
  thumbnailUrl: string;
  country: string;
};

/** DB `stateSlug` for all Europe-list rows — URLs use `/top-restaurants/Europe/[countrySlug]/[nameSlug]`. */
export const EUROPE_REGION_STATE_SLUG = "europe";

export const EUROPE_500_SEED: EuropeSeedRow[] = Array.from({ length: 500 }, (_, i) => {
  const europeRank = i + 1;
  const country = EU_COUNTRY_POOL[i % EU_COUNTRY_POOL.length];
  const countySlug = slugifySegment(country);
  const city = `City ${europeRank}`;
  const citySlug = slugifySegment(city) || "unknown";
  const name = `Europe Ranked Restaurant ${europeRank}`;
  const nameSlug = `${slugifySegment(name) || "restaurant"}-${europeRank}`;
  return {
    europeRank,
    name,
    address: "",
    phone: "",
    website: "",
    openTableUrl: "",
    cuisine: "European",
    city,
    county: country,
    citySlug,
    countySlug,
    nameSlug,
    owner: "",
    headChef: "",
    awards: "—",
    thumbnailUrl: "",
    country,
  };
});
