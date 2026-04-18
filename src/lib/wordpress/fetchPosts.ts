import { getWordPressApiBase } from "./apiBase";
import type { SeasonalTabSlug } from "./seasonalCategories";
import { resolveCategorySlug } from "./seasonalCategories";
import type { WpPost } from "./types";
import { mapWpPostToFeed, type SeasonalFeedPost } from "./mapPost";

const FETCH_OPTS = { next: { revalidate: 120 } as const };

export type FetchSeasonalPostsResult =
  | { ok: true; posts: SeasonalFeedPost[] }
  | { ok: false; error: string };

async function getJson<T>(url: string): Promise<{ ok: true; data: T } | { ok: false; status: number }> {
  const res = await fetch(url, {
    ...FETCH_OPTS,
    headers: { Accept: "application/json" },
  });
  if (!res.ok) return { ok: false, status: res.status };
  const data = (await res.json()) as T;
  return { ok: true, data };
}

/** Resolve numeric category id for a tab slug (WP REST). */
async function getCategoryIdForTab(tab: SeasonalTabSlug): Promise<number | null> {
  const api = getWordPressApiBase();
  if (!api) return null;
  const slug = resolveCategorySlug(tab);
  const url = `${api}/wp/v2/categories?slug=${encodeURIComponent(slug)}`;
  const r = await getJson<{ id: number }[]>(url);
  if (!r.ok || !Array.isArray(r.data) || !r.data[0]?.id) return null;
  return r.data[0].id;
}

/**
 * Fetch posts: all (newest first) or filtered by one seasonal category.
 */
export async function fetchSeasonalPosts(filter: "all" | SeasonalTabSlug): Promise<FetchSeasonalPostsResult> {
  const api = getWordPressApiBase();
  if (!api) {
    return { ok: false, error: "WordPress URL is not configured (set WORDPRESS_URL in .env.local)." };
  }

  let categoryParam = "";
  if (filter !== "all") {
    const id = await getCategoryIdForTab(filter);
    if (id == null) {
      return {
        ok: false,
        error: `No WordPress category found for “${filter}”. Create a category with slug “${resolveCategorySlug(filter)}” or set ${`WORDPRESS_CAT_SLUG_${filter.toUpperCase()}`} to match your WP slug.`,
      };
    }
    categoryParam = `&categories=${id}`;
  }

  const url = `${api}/wp/v2/posts?per_page=50&orderby=date&order=desc&_embed=1${categoryParam}`;
  const r = await getJson<WpPost[]>(url);
  if (!r.ok) {
    return {
      ok: false,
      error: `WordPress request failed (${r.status}). Check WORDPRESS_URL and that the REST API is public: ${api}/wp/v2/posts`,
    };
  }

  const posts = Array.isArray(r.data) ? r.data.map(mapWpPostToFeed) : [];
  return { ok: true, posts };
}
