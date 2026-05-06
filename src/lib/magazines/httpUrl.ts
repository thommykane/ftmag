/** Returns normalized https URL or null if empty. Throws if non-empty but invalid. */
export function parseOptionalHttpUrl(raw: string): string | null {
  const t = raw.trim();
  if (!t) return null;
  const u = new URL(t);
  if (u.protocol !== "http:" && u.protocol !== "https:") {
    throw new Error("URL must start with http:// or https://");
  }
  return u.href;
}
