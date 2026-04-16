/** Reusable destination model — states now, cities later (same shape). */

export const BEST_SEASONS = ["Spring", "Summer", "Fall", "Winter", "Year-Round"] as const;
export type BestSeason = (typeof BEST_SEASONS)[number];

export const IDEAL_FOR_OPTIONS = [
  "Couples",
  "Families",
  "Solo Travelers",
  "Luxury",
  "Foodies",
  "Adventure",
  "Nightlife",
] as const;
export type IdealForOption = (typeof IDEAL_FOR_OPTIONS)[number];

export const DRIVEABILITY = ["Easy", "Moderate", "Difficult"] as const;
export type Driveability = (typeof DRIVEABILITY)[number];

export const WALKABILITY = ["High", "Medium", "Low"] as const;
export type Walkability = (typeof WALKABILITY)[number];

export type DestinationCity = {
  name: string;
  slug: string;
  shortDescription: string;
  imageUrl?: string;
};

export type DestinationCounty = {
  name: string;
  slug: string;
  shortDescription: string;
};

export type FeaturedExperience = {
  title: string;
  description: string;
  /** Emoji or short label for icon strip */
  icon: string;
};

export type SeasonalBreakdown = {
  spring: string;
  summer: string;
  fall: string;
  winter: string;
};

export type StateDestination = {
  name: string;
  slug: string;
  heroImage: string;
  thumbnailShape: string;
  tagline: string;
  /** Sanitized HTML or plain text paragraphs wrapped at render */
  description: string;
  bestSeason: BestSeason;
  idealFor: IdealForOption[];
  population: string;
  knownFor: string[];
  climate: string;
  avgCostPerDay: string;
  majorAirports: string[];
  driveability: Driveability;
  walkability: Walkability;
  whyVisit: string;
  topCities: DestinationCity[];
  topCounties: DestinationCounty[];
  showCounties: boolean;
  featuredExperiences: FeaturedExperience[];
  gallery: string[];
  videoUrl: string | null;
  quickTips: string[];
  seasonalBreakdown: SeasonalBreakdown;
  metaTitle: string;
  metaDescription: string;
  /** When false, page shows a slim “guide in progress” ribbon */
  contentComplete?: boolean;
};
