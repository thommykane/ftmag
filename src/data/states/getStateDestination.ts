import type { StateDestination } from "@/types/stateDestination";
import { parseStateDestinationPayload } from "@/lib/stateDestinationZod";
import { prisma } from "@/lib/prisma";
import { CALIFORNIA_DESTINATION } from "./california";
import { US_STATES_ALPHABETICAL, type USStateRow } from "./usStates";

const BY_SLUG: Record<string, StateDestination> = {
  california: CALIFORNIA_DESTINATION,
};

function placeholderHero(seed: string) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/1920/1080`;
}

function placeholderShape(abbr: string) {
  return `https://placehold.co/250x250/1a0a0c/c9a227/png?font=montserrat&text=${encodeURIComponent(abbr)}`;
}

export function buildPlaceholderDestination(row: USStateRow): StateDestination {
  const slug = row.slug;
  return {
    name: row.name,
    slug,
    heroImage: placeholderHero(slug),
    thumbnailShape: placeholderShape(row.abbr),
    tagline: `A curated field guide to ${row.name}—itineraries, dossier data, and signature routes.`,
    description: `
      <p>Our editorial team is expanding this destination with on-the-ground reporting: regional pacing, airport logic, and the experiences that justify the journey.</p>
      <p>Bookmark this page—full narrative, galleries, and seasonal routing will roll out as the dossier completes.</p>
    `,
    bestSeason: "Year-Round",
    idealFor: ["Couples", "Adventure"],
    population: "—",
    knownFor: ["Signature landscapes", "Regional cuisine", "Road-trip corridors"],
    climate: "Varies by region—consult local forecasts when planning multi-stop routes.",
    avgCostPerDay: "—",
    majorAirports: ["See regional hubs as the guide expands"],
    driveability: "Moderate",
    walkability: "Medium",
    whyVisit: `
      <p>${row.name} will receive the same FTMAG treatment as our flagship destinations: a cinematic hero, a glass dossier card, seasonal tabs, and city cards wired for future deep links.</p>
    `,
    topCities: [],
    topCounties: [],
    showCounties: false,
    featuredExperiences: [
      {
        icon: "◆",
        title: "Itinerary atelier",
        description: "Custom pacing for regions and seasons—coming soon.",
      },
      {
        icon: "◇",
        title: "Local hosts",
        description: "Specialists and drivers—coming soon.",
      },
    ],
    gallery: [
      `https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80`,
      `https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80`,
    ],
    videoUrl: null,
    quickTips: [
      "Start with one region per trip—distance and terrain can surprise first-time visitors.",
      "Book refundable rates while dossier details are still expanding.",
    ],
    seasonalBreakdown: {
      spring: "Spring conditions vary—layered packing recommended.",
      summer: "Peak travel windows—reserve early for popular corridors.",
      fall: "Often ideal shoulder-season pacing in many regions.",
      winter: "Weather windows can shift quickly—check regional advisories.",
    },
    metaTitle: `${row.name} Travel Guide | FTMAG Destinations`,
    metaDescription: `Explore ${row.name} with FTMAG—luxury-forward travel intelligence, seasonal routing, and curated experiences.`,
    contentComplete: false,
  };
}

/** Bundled / generated default (no database row). */
export function getDefaultStateDestination(slug: string): StateDestination | null {
  const row = US_STATES_ALPHABETICAL.find((s) => s.slug === slug);
  if (!row) return null;
  if (BY_SLUG[slug]) return BY_SLUG[slug];
  return buildPlaceholderDestination(row);
}

/** Public pages: DB override when valid, else bundled default. */
export async function resolveStateDestination(slug: string): Promise<StateDestination | null> {
  const row = US_STATES_ALPHABETICAL.find((s) => s.slug === slug);
  if (!row) return null;

  try {
    const db = await prisma.stateDestinationContent.findUnique({ where: { slug } });
    if (db?.payload) {
      const parsed = parseStateDestinationPayload(db.payload);
      if (parsed) return parsed;
    }
  } catch {
    /* DB unavailable — fall back */
  }

  return getDefaultStateDestination(slug);
}

export function getAllStateSlugs(): string[] {
  return US_STATES_ALPHABETICAL.map((s) => s.slug);
}
