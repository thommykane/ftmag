import { CUISINE_FILTERS } from "@/data/chefs";

/** URL segment for /top-chefs/cuisine/[cuisineSlug] */
export function cuisineLabelToSlug(label: string): string {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function cuisineSlugToLabel(slug: string): string | null {
  const hit = CUISINE_FILTERS.find((c) => cuisineLabelToSlug(c) === slug);
  return hit ?? null;
}
