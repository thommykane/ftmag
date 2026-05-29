import { getWordPressApiBase } from "./apiBase";
import type { WpPost } from "./types";
import { mapWpPostToFeed, type SeasonalFeedPost } from "./mapPost";

const CMS_FALLBACK = "https://cms.foodandtravelmagazine.com";

function resolveApiBase(): string | null {
  const configured = getWordPressApiBase();
  if (configured) return configured;
  return `${CMS_FALLBACK.replace(/\/$/, "")}/wp-json`;
}

export async function fetchLatestPost(): Promise<SeasonalFeedPost | null> {
  const api = resolveApiBase();
  if (!api) return null;

  try {
    const url = `${api}/wp/v2/posts?per_page=1&orderby=date&order=desc&_embed=1`;
    const res = await fetch(url, {
      next: { revalidate: 120 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as WpPost[];
    const post = Array.isArray(data) ? data[0] : null;
    return post ? mapWpPostToFeed(post) : null;
  } catch {
    return null;
  }
}

export async function fetchPostBySlugFromCms(slug: string): Promise<SeasonalFeedPost | null> {
  const api = resolveApiBase();
  if (!api || !slug.trim()) return null;

  try {
    const url = `${api}/wp/v2/posts?slug=${encodeURIComponent(slug.trim())}&_embed=1`;
    const res = await fetch(url, {
      next: { revalidate: 120 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as WpPost[];
    const post = Array.isArray(data) ? data[0] : null;
    return post ? mapWpPostToFeed(post) : null;
  } catch {
    return null;
  }
}
