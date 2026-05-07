/** Parse admin textarea: JSON string array or one Restaurant `id` per line. */
export function parsePinnedRestaurantIdsFromForm(raw: string): string[] {
  const t = raw.trim();
  if (!t) return [];
  try {
    const parsed = JSON.parse(t) as unknown;
    if (Array.isArray(parsed)) {
      return Array.from(
        new Set(parsed.filter((x): x is string => typeof x === "string").map((s) => s.trim()).filter(Boolean)),
      );
    }
  } catch {
    /* not JSON */
  }
  return Array.from(
    new Set(
      t
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && !s.startsWith("#")),
    ),
  );
}

export function parsePinnedRestaurantIdsFromJson(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((x): x is string => typeof x === "string" && x.trim().length > 0).map((s) => s.trim());
}
