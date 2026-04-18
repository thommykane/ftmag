import type { WpPost } from "./types";
import { decodeWpEntities, excerptWords, stripHtml } from "./parse";

export type SeasonalFeedPost = {
  id: number;
  href: string;
  title: string;
  excerpt: string;
  categoryLabel: string;
  /** Primary WP category slug (for label color) */
  categorySlug: string;
  /** Circular thumb (author avatar preferred) */
  thumbUrl: string | null;
  thumbAlt: string;
  featuredImageUrl: string | null;
  featuredAlt: string;
  dateIso: string;
};

function primaryCategory(post: WpPost): { name: string; slug: string } {
  const groups = post._embedded?.["wp:term"];
  const firstGroup = groups?.[0];
  if (!firstGroup?.length) return { name: "Article", slug: "article" };
  const cat = firstGroup.find((t) => t.taxonomy === "category") ?? firstGroup[0];
  return { name: cat?.name ?? "Article", slug: cat?.slug ?? "article" };
}

export function mapWpPostToFeed(post: WpPost): SeasonalFeedPost {
  const title = decodeWpEntities(stripHtml(post.title.rendered));
  const rawExcerpt = stripHtml(post.excerpt.rendered);
  const excerpt = excerptWords(rawExcerpt, 36);

  const author = post._embedded?.author?.[0];
  const avatar =
    author?.avatar_urls?.["96"] ?? author?.avatar_urls?.["48"] ?? author?.avatar_urls?.["24"] ?? null;

  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  const featuredUrl = media?.source_url ?? null;
  const featuredAlt = media?.alt_text?.trim() || title;

  const thumbUrl = avatar || featuredUrl;
  const thumbAlt = author?.name ? `${author.name}` : featuredAlt;

  const cat = primaryCategory(post);
  return {
    id: post.id,
    href: post.link,
    title,
    excerpt,
    categoryLabel: cat.name,
    categorySlug: cat.slug,
    thumbUrl,
    thumbAlt,
    featuredImageUrl: featuredUrl,
    featuredAlt,
    dateIso: post.date,
  };
}
