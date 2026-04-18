/** Base URL for WP REST API, e.g. https://example.com/wp-json */
export function getWordPressApiBase(): string | null {
  const explicit = process.env.WORDPRESS_API_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const base = process.env.WORDPRESS_URL?.trim();
  if (!base) return null;
  return `${base.replace(/\/$/, "")}/wp-json`;
}

export function isWordPressConfigured(): boolean {
  return !!getWordPressApiBase();
}
