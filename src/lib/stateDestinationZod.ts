import { z } from "zod";
import type { StateDestination } from "@/types/stateDestination";

const nonEmpty = z.string().min(1);

const bestSeasonEnum = z.enum(["Spring", "Summer", "Fall", "Winter", "Year-Round"]);
const idealForEnum = z.enum([
  "Couples",
  "Families",
  "Solo Travelers",
  "Luxury",
  "Foodies",
  "Adventure",
  "Nightlife",
]);
const driveEnum = z.enum(["Easy", "Moderate", "Difficult"]);
const walkEnum = z.enum(["High", "Medium", "Low"]);

const destinationCityZ = z.object({
  name: nonEmpty,
  slug: nonEmpty,
  shortDescription: nonEmpty,
  imageUrl: z.union([z.string().url(), z.literal("")]).optional(),
});

const destinationCountyZ = z.object({
  name: nonEmpty,
  slug: nonEmpty,
  shortDescription: nonEmpty,
});

const featuredZ = z.object({
  title: nonEmpty,
  description: nonEmpty,
  icon: nonEmpty,
});

const ZERO_EXPLORE = {
  counties: 0,
  cities: 0,
  touristAttractions: 0,
  nationalParks: 0,
  monumentsLandmarks: 0,
  publicBeaches: 0,
} as const;

const thingsToExploreCountsSchema = z
  .object({
    counties: z.number().int().nonnegative().default(0),
    cities: z.number().int().nonnegative().default(0),
    touristAttractions: z.number().int().nonnegative().default(0),
    nationalParks: z.number().int().nonnegative().default(0),
    monumentsLandmarks: z.number().int().nonnegative().default(0),
    publicBeaches: z.number().int().nonnegative().default(0),
  })
  .default(ZERO_EXPLORE);

const mapPlaceZ = z.object({
  name: z.string(),
  address: z.string(),
});

const seasonalZ = z.object({
  spring: z.string(),
  summer: z.string(),
  fall: z.string(),
  winter: z.string(),
});

export const stateDestinationPayloadZ = z
  .object({
    name: nonEmpty,
    slug: nonEmpty,
    heroImage: nonEmpty,
    thumbnailShape: nonEmpty,
    tagline: nonEmpty,
    description: z.string(),
    bestSeason: bestSeasonEnum,
    idealFor: z.array(idealForEnum),
    population: z.string(),
    knownFor: z.array(z.string()),
    climate: z.string(),
    avgCostPerDay: z.union([z.string(), z.number()]).transform((v) => String(v)),
    majorAirports: z.array(z.string()),
    driveability: driveEnum,
    walkability: walkEnum,
    whyVisit: z.string(),
    thingsToExplore: thingsToExploreCountsSchema,
    touristAttractionSpots: z.array(mapPlaceZ).default([]),
    landmarkMonumentSpots: z.array(mapPlaceZ).default([]),
    topCities: z.array(destinationCityZ),
    topCounties: z.array(destinationCountyZ),
    showCounties: z.boolean(),
    featuredExperiences: z.array(featuredZ),
    gallery: z.array(z.string()),
    videoUrl: z.union([z.string().url(), z.literal(""), z.null()]),
    quickTips: z.array(z.string()),
    seasonalBreakdown: seasonalZ,
    metaTitle: nonEmpty,
    metaDescription: nonEmpty,
    contentComplete: z.boolean().optional(),
  })
  .transform((d) => ({
    ...d,
    videoUrl: d.videoUrl === "" || d.videoUrl === null ? null : d.videoUrl,
    topCities: d.topCities.map((c) => ({
      ...c,
      imageUrl: c.imageUrl && c.imageUrl !== "" ? c.imageUrl : undefined,
    })),
    touristAttractionSpots: d.touristAttractionSpots
      .map((p) => ({ name: p.name.trim(), address: p.address.trim() }))
      .filter((p) => p.name.length > 0),
    landmarkMonumentSpots: d.landmarkMonumentSpots
      .map((p) => ({ name: p.name.trim(), address: p.address.trim() }))
      .filter((p) => p.name.length > 0),
  }));

export type StateDestinationPayloadInput = z.input<typeof stateDestinationPayloadZ>;

export function parseStateDestinationPayload(data: unknown): StateDestination | null {
  const r = stateDestinationPayloadZ.safeParse(data);
  if (!r.success) return null;
  return r.data as StateDestination;
}
