/**
 * Tab keys for /seasonal-travel-vacation-spots — must match WordPress category slugs
 * (create these under Posts → Categories, or map via env overrides below).
 */
export const SEASONAL_TAB_ORDER = [
  "spring",
  "summer",
  "fall",
  "winter",
  "editorials",
  "interviews",
] as const;

export type SeasonalTabSlug = (typeof SEASONAL_TAB_ORDER)[number];

const SLUG_ENV_KEYS: Record<SeasonalTabSlug, string> = {
  spring: "WORDPRESS_CAT_SLUG_SPRING",
  summer: "WORDPRESS_CAT_SLUG_SUMMER",
  fall: "WORDPRESS_CAT_SLUG_FALL",
  winter: "WORDPRESS_CAT_SLUG_WINTER",
  editorials: "WORDPRESS_CAT_SLUG_EDITORIALS",
  interviews: "WORDPRESS_CAT_SLUG_INTERVIEWS",
};

/**
 * Defaults match foodandtravelmagazine.com category slugs. Override per env if yours differ.
 * Create a category "Interviews" in WP (slug usually `interviews`) and assign posts there for the Interviews tab.
 */
const DEFAULT_SLUG_BY_TAB: Record<SeasonalTabSlug, string> = {
  spring: "spring-travel-destinations",
  summer: "summer-travel-destinations",
  fall: "top-fall-destinations",
  winter: "winter-travel-destinations",
  editorials: "editorial-features",
  interviews: "interviews",
};

/** Effective WP category slug for API queries (env override or FTMAG defaults). */
export function resolveCategorySlug(tab: SeasonalTabSlug): string {
  const envKey = SLUG_ENV_KEYS[tab];
  const fromEnv = typeof process !== "undefined" ? process.env[envKey]?.trim() : "";
  return fromEnv || DEFAULT_SLUG_BY_TAB[tab];
}

export function tabLabel(slug: SeasonalTabSlug): string {
  const map: Record<SeasonalTabSlug, string> = {
    spring: "Spring",
    summer: "Summer",
    fall: "Fall",
    winter: "Winter",
    editorials: "Editorials",
    interviews: "Interviews",
  };
  return map[slug];
}
