/** Minimal WP REST v2 shapes we use (_embed). */

export type WpRendered = { rendered: string };

export type WpCategoryTerm = {
  id: number;
  name: string;
  slug: string;
  taxonomy: string;
};

export type WpFeaturedMedia = {
  source_url: string;
  alt_text?: string;
};

export type WpAuthor = {
  name: string;
  avatar_urls?: Record<string, string>;
};

export type WpPost = {
  id: number;
  date: string;
  link: string;
  title: WpRendered;
  excerpt: WpRendered;
  _embedded?: {
    author?: WpAuthor[];
    "wp:featuredmedia"?: WpFeaturedMedia[];
    "wp:term"?: WpCategoryTerm[][];
  };
};
