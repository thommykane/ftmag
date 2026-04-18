import { getWordPressApiBase } from "./apiBase";
import type { WpPost } from "./types";
import { mapWpPostToFeed, type SeasonalFeedPost } from "./mapPost";
import { sanitizeWpPostHtml } from "./sanitizeWpHtml";

const FETCH_OPTS = { next: { revalidate: 120 } as const };

export type FeaturedArticlePageData = SeasonalFeedPost & {
  bodyHtml: string;
};

async function getJson<T>(url: string): Promise<{ ok: true; data: T } | { ok: false; status: number }> {
  const res = await fetch(url, {
    ...FETCH_OPTS,
    headers: { Accept: "application/json" },
  });
  if (!res.ok) return { ok: false, status: res.status };
  const data = (await res.json()) as T;
  return { ok: true, data };
}

export type FetchPostResult =
  | { ok: true; post: FeaturedArticlePageData }
  | { ok: false; error: string; notFound?: boolean };

/**
 * Load a single post by WordPress slug for /featured-articles/[slug].
 */
export async function fetchWordPressPostBySlug(slug: string): Promise<FetchPostResult> {
  const api = getWordPressApiBase();
  if (!api) {
    return { ok: false, error: "WordPress URL is not configured (set WORDPRESS_URL)." };
  }

  const url = `${api}/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed=1`;
  const r = await getJson<WpPost[]>(url);
  if (!r.ok) {
    return {
      ok: false,
      error: `WordPress request failed (${r.status}).`,
    };
  }

  const raw = Array.isArray(r.data) ? r.data[0] : undefined;
  if (!raw) {
    return { ok: false, error: "Post not found.", notFound: true };
  }

  const feed = mapWpPostToFeed(raw);
  const bodyHtml = sanitizeWpPostHtml(raw.content?.rendered ?? "");

  return {
    ok: true,
    post: {
      ...feed,
      bodyHtml,
    },
  };
}
