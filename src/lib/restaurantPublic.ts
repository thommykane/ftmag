import type { Restaurant } from "@prisma/client";

export type RestaurantDTO = {
  id: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  website: string;
  openTableUrl: string;
  cuisine: string;
  ownerChef: string;
  awards: string;
  thumbnailUrl: string;
  stateSlug: string;
  country: string;
  nationalRank: number | null;
};

export function toRestaurantDTO(r: Restaurant): RestaurantDTO {
  return {
    id: r.id,
    name: r.name,
    address: r.address,
    email: r.email,
    phone: r.phone,
    website: r.website,
    openTableUrl: r.openTableUrl,
    cuisine: r.cuisine,
    ownerChef: r.ownerChef,
    awards: r.awards,
    thumbnailUrl: r.thumbnailUrl,
    stateSlug: r.stateSlug,
    country: r.country,
    nationalRank: r.nationalRank,
  };
}

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
