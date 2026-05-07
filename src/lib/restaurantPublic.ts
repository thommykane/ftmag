import type { Restaurant } from "@prisma/client";
import { displayWebsiteHostname, restaurantPublicPath, slugifySegment } from "@/lib/restaurantSlug";

export type RestaurantDTO = {
  id: string;
  name: string;
  address: string;
  phone: string;
  website: string;
  openTableUrl: string;
  cuisine: string;
  city: string;
  county: string;
  citySlug: string;
  countySlug: string;
  nameSlug: string;
  owner: string;
  headChef: string;
  awards: string;
  thumbnailUrl: string;
  stateSlug: string;
  country: string;
  nationalRank: number | null;
  europeRank: number | null;
};

export function toRestaurantDTO(r: Restaurant): RestaurantDTO {
  return {
    id: r.id,
    name: r.name,
    address: r.address,
    phone: r.phone,
    website: r.website,
    openTableUrl: r.openTableUrl,
    cuisine: r.cuisine,
    city: r.city,
    county: r.county,
    citySlug: r.citySlug,
    countySlug: r.countySlug,
    nameSlug: r.nameSlug,
    owner: r.owner,
    headChef: r.headChef,
    awards: r.awards,
    thumbnailUrl: r.thumbnailUrl,
    stateSlug: r.stateSlug,
    country: r.country,
    nationalRank: r.nationalRank,
    europeRank: r.europeRank,
  };
}

/** Public detail URL — U.S. national uses state/county/city/slug; Europe uses `/top-restaurants/Europe/[country]/[slug]`. */
export function restaurantDetailHref(
  r: Pick<RestaurantDTO, "stateSlug" | "countySlug" | "citySlug" | "nameSlug" | "europeRank" | "country">,
): string {
  if (r.europeRank != null) {
    const countrySeg =
      (r.countySlug && r.countySlug.trim() && r.countySlug !== "unknown"
        ? r.countySlug
        : slugifySegment(r.country)) || "unknown";
    const slug = (r.nameSlug || "").trim() || "restaurant";
    return `/top-restaurants/Europe/${countrySeg}/${slug}`;
  }
  return restaurantPublicPath(r);
}

export { displayWebsiteHostname };

export function bookingHref(r: Pick<RestaurantDTO, "openTableUrl" | "website">): string {
  const ot = r.openTableUrl?.trim();
  if (ot) return ot;
  return r.website?.trim() || "#";
}

export function bookingLabel(r: Pick<RestaurantDTO, "openTableUrl" | "website">): string {
  return r.openTableUrl?.trim() ? "OpenTable" : "Website";
}

export function telHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : "";
}
