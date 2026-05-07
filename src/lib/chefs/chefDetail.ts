export type ChefOwnedVenue = {
  name: string;
  location: string;
  role?: string;
};

export type ChefDetailExtras = {
  birthDate: Date | null;
  birthPlace: string;
  specialtyCuisine: string;
  awards: string;
  ownedRestaurants: ChefOwnedVenue[];
};

export function parseOwnedRestaurantsJson(raw: unknown): ChefOwnedVenue[] {
  if (!Array.isArray(raw)) return [];
  const out: ChefOwnedVenue[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const name = typeof o.name === "string" ? o.name.trim() : "";
    const location = typeof o.location === "string" ? o.location.trim() : "";
    if (!name || !location) continue;
    const role = typeof o.role === "string" ? o.role.trim() : undefined;
    out.push(role ? { name, location, role } : { name, location });
  }
  return out;
}

export function ageFromBirthDate(birth: Date | null): number | null {
  if (!birth) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age -= 1;
  return age >= 0 && age < 130 ? age : null;
}
