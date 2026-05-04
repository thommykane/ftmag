import zipcodesUs from "zipcodes-us";
import { slugifySegment } from "@/lib/restaurantSlug";

/** Last 5-digit ZIP in the string (US addresses usually end with ZIP). */
export function extractUsZip(address: string): string | null {
  const matches = address.match(/\b(\d{5})(?:-\d{4})?\b/g);
  if (!matches?.length) return null;
  return matches[matches.length - 1].slice(0, 5);
}

/**
 * Prefer ", City, ST ... ZIP" at end of line (handles optional comma before ZIP).
 */
export function parseCityStateFromAddress(address: string): { city: string; stateAbbr: string } | null {
  const trimmed = address.trim();
  const re = /,\s*([^,]+?)\s*,\s*([A-Z]{2})\s*(?:,?\s*\d{5}(?:-\d{4})?)?\s*$/i;
  const m = trimmed.match(re);
  if (m) {
    return { city: m[1].trim().replace(/\s+/g, " "), stateAbbr: m[2].toUpperCase() };
  }
  return null;
}

/**
 * City / county / URL slugs from a US mailing-style address.
 * Uses ZIP → locality lookup when possible (`zipcodes-us`), then city+state lookup if ZIP is missing or unknown,
 * then parses city from the trailing ", City, ST" segment as a last resort.
 */
export function restaurantGeoFromAddress(address: string): {
  city: string;
  county: string;
  citySlug: string;
  countySlug: string;
} {
  const zip = extractUsZip(address);
  if (zip) {
    const info = zipcodesUs.find(zip);
    if (info.isValid && info.city && info.county) {
      return {
        city: info.city,
        county: info.county,
        citySlug: slugifySegment(info.city) || "unknown",
        countySlug: slugifySegment(info.county) || "unknown",
      };
    }
  }

  const parsed = parseCityStateFromAddress(address);
  if (parsed) {
    const list = zipcodesUs.findByCity(parsed.city, parsed.stateAbbr);
    if (list.length > 0) {
      const first = list[0];
      const city = first.placeName || parsed.city;
      const county = first.countyName || "";
      return {
        city,
        county,
        citySlug: slugifySegment(city) || "unknown",
        countySlug: slugifySegment(county) || "unknown",
      };
    }
    return {
      city: parsed.city,
      county: "",
      citySlug: slugifySegment(parsed.city) || "unknown",
      countySlug: "unknown",
    };
  }

  return {
    city: "",
    county: "",
    citySlug: "unknown",
    countySlug: "unknown",
  };
}
