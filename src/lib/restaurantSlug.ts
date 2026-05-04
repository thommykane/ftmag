/** Kebab-case segment for URLs (restaurant / city / county). */
export function slugifySegment(input: string): string {
  const s = input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[''"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
  return s.length > 0 ? s.slice(0, 96) : "";
}

export function restaurantPublicPath(r: {
  stateSlug: string;
  countySlug: string;
  citySlug: string;
  nameSlug: string;
}): string {
  const state = slugifySegment(r.stateSlug) || "unknown";
  const county = slugifySegment(r.countySlug) || "unknown";
  const city = slugifySegment(r.citySlug) || "unknown";
  const slug = (r.nameSlug || "").trim() || "restaurant";
  return `/top-restaurants/${state}/${county}/${city}/${slug}`;
}

/** Hostname only, no scheme/path — for visible “domain” link text. */
export function displayWebsiteHostname(url: string): string {
  const u = url.trim();
  if (!u) return "";
  try {
    const parsed = new URL(u.includes("://") ? u : `https://${u}`);
    return parsed.hostname.replace(/^www\./i, "");
  } catch {
    return u.replace(/^https?:\/\//i, "").split("/")[0]?.replace(/^www\./i, "") ?? "";
  }
}
