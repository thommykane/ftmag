import type { StateDestination } from "@/types/stateDestination";
import { parseStateDestinationPayload } from "@/lib/stateDestinationZod";
import { prisma } from "@/lib/prisma";
import { CALIFORNIA_DESTINATION } from "./california";
import { US_STATES_ALPHABETICAL, type USStateRow } from "./usStates";

const BY_SLUG: Record<string, StateDestination> = {
  california: {
    ...CALIFORNIA_DESTINATION,
    seasonalBreakdown: {
      spring: "",
      summer: "",
      fall: "",
      winter: "",
    },
  },
};

const HIGH_POP_SLUGS = new Set([
  "california",
  "texas",
  "florida",
  "new-york",
  "pennsylvania",
  "illinois",
  "ohio",
  "georgia",
  "north-carolina",
  "michigan",
  "new-jersey",
  "virginia",
  "washington",
  "arizona",
  "massachusetts",
  "tennessee",
  "indiana",
  "missouri",
  "maryland",
  "wisconsin",
]);

const MID_POP_SLUGS = new Set([
  "colorado",
  "minnesota",
  "south-carolina",
  "alabama",
  "louisiana",
  "kentucky",
  "oregon",
  "oklahoma",
  "connecticut",
  "utah",
  "iowa",
  "nevada",
  "arkansas",
  "mississippi",
  "kansas",
  "new-mexico",
  "nebraska",
  "west-virginia",
  "idaho",
  "hawaii",
]);

const POPULATION_ESTIMATE_BY_SLUG: Record<string, string> = {
  california: "~39.0 million",
  texas: "~30.5 million",
  florida: "~22.6 million",
  "new-york": "~19.6 million",
  pennsylvania: "~13.0 million",
  illinois: "~12.5 million",
  ohio: "~11.8 million",
  georgia: "~11.0 million",
  "north-carolina": "~10.8 million",
  michigan: "~10.0 million",
  "new-jersey": "~9.3 million",
  virginia: "~8.8 million",
  washington: "~7.9 million",
  arizona: "~7.6 million",
  massachusetts: "~7.0 million",
  tennessee: "~7.2 million",
  indiana: "~6.9 million",
  missouri: "~6.2 million",
  maryland: "~6.2 million",
  wisconsin: "~5.9 million",
};

const MAJOR_AIRPORT_BY_ABBR: Record<string, string> = {
  AL: "BHM - Birmingham-Shuttlesworth International",
  AK: "ANC - Ted Stevens Anchorage International",
  AZ: "PHX - Phoenix Sky Harbor International",
  AR: "LIT - Clinton National Airport",
  CA: "LAX - Los Angeles International",
  CO: "DEN - Denver International",
  CT: "BDL - Bradley International",
  DE: "PHL - Philadelphia International (regional gateway)",
  FL: "MCO - Orlando International",
  GA: "ATL - Hartsfield-Jackson Atlanta International",
  HI: "HNL - Daniel K. Inouye International",
  ID: "BOI - Boise Airport",
  IL: "ORD - Chicago O'Hare International",
  IN: "IND - Indianapolis International",
  IA: "DSM - Des Moines International",
  KS: "ICT - Wichita Dwight D. Eisenhower National",
  KY: "SDF - Louisville Muhammad Ali International",
  LA: "MSY - Louis Armstrong New Orleans International",
  ME: "PWM - Portland International Jetport",
  MD: "BWI - Baltimore/Washington International",
  MA: "BOS - Boston Logan International",
  MI: "DTW - Detroit Metropolitan Wayne County",
  MN: "MSP - Minneapolis-Saint Paul International",
  MS: "JAN - Jackson-Medgar Wiley Evers International",
  MO: "STL - St. Louis Lambert International",
  MT: "BZN - Bozeman Yellowstone International",
  NE: "OMA - Eppley Airfield",
  NV: "LAS - Harry Reid International",
  NH: "MHT - Manchester-Boston Regional",
  NJ: "EWR - Newark Liberty International",
  NM: "ABQ - Albuquerque International Sunport",
  NY: "JFK - John F. Kennedy International",
  NC: "CLT - Charlotte Douglas International",
  ND: "FAR - Hector International",
  OH: "CMH - John Glenn Columbus International",
  OK: "OKC - Will Rogers World Airport",
  OR: "PDX - Portland International",
  PA: "PHL - Philadelphia International",
  RI: "PVD - T.F. Green International",
  SC: "CHS - Charleston International",
  SD: "FSD - Sioux Falls Regional",
  TN: "BNA - Nashville International",
  TX: "DFW - Dallas/Fort Worth International",
  UT: "SLC - Salt Lake City International",
  VT: "BTV - Burlington International",
  VA: "IAD - Washington Dulles International",
  WA: "SEA - Seattle-Tacoma International",
  WV: "CRW - Yeager Airport",
  WI: "MKE - Milwaukee Mitchell International",
  WY: "JAC - Jackson Hole Airport",
};

const CITY_OVERRIDES: Record<string, string[]> = {
  alabama: ["Gulf Shores", "Orange Beach", "Birmingham", "Montgomery", "Mobile", "Huntsville", "Tuscaloosa", "Auburn", "Florence", "Fairhope", "Gadsden", "Mentone"],
  alaska: ["Anchorage", "Juneau", "Fairbanks", "Seward", "Sitka", "Ketchikan", "Talkeetna", "Homer", "Skagway", "Kodiak", "Valdez", "Nome"],
  arizona: ["Phoenix", "Scottsdale", "Sedona", "Tucson", "Flagstaff", "Prescott", "Page", "Lake Havasu City", "Williams", "Bisbee", "Jerome", "Glendale"],
  arkansas: ["Eureka Springs", "Hot Springs", "Little Rock", "Bentonville", "Fayetteville", "Rogers", "Fort Smith", "Jonesboro", "Mountain View", "Harrison", "El Dorado", "Texarkana"],
  california: ["Los Angeles", "San Francisco", "San Diego", "Santa Barbara", "Palm Springs", "Napa", "Sonoma", "Monterey", "Santa Cruz", "Lake Tahoe", "Sacramento", "Big Sur"],
  colorado: ["Denver", "Aspen", "Vail", "Boulder", "Colorado Springs", "Breckenridge", "Telluride", "Steamboat Springs", "Durango", "Fort Collins", "Glenwood Springs", "Estes Park"],
  connecticut: ["Mystic", "New Haven", "Hartford", "Stamford", "Greenwich", "Norwalk", "Danbury", "Waterbury", "New London", "Bridgeport", "West Hartford", "Fairfield"],
  delaware: ["Rehoboth Beach", "Bethany Beach", "Dewey Beach", "Wilmington", "Newark", "Dover", "Lewes", "Middletown", "Milford", "Seaford", "Georgetown", "Smyrna"],
  florida: ["Miami", "Orlando", "Tampa", "St. Petersburg", "Key West", "Naples", "Fort Lauderdale", "West Palm Beach", "Jacksonville", "Sarasota", "Destin", "Pensacola"],
  georgia: ["Atlanta", "Savannah", "Athens", "Augusta", "Blue Ridge", "Helen", "Macon", "Columbus", "Dahlonega", "Tybee Island", "Rome", "Alpharetta"],
  hawaii: ["Honolulu", "Hilo", "Kailua", "Lahaina", "Waikiki", "Kaneohe", "Kapaa", "Kailua-Kona", "Princeville", "Hanalei", "Waimea", "Kahului"],
  idaho: ["Boise", "Coeur d'Alene", "Sun Valley", "Idaho Falls", "Twin Falls", "Sandpoint", "McCall", "Pocatello", "Lewiston", "Nampa", "Caldwell", "Ketchum"],
  illinois: ["Chicago", "Springfield", "Naperville", "Evanston", "Rockford", "Galena", "Peoria", "Champaign", "Bloomington", "Oak Park", "Aurora", "St. Charles"],
  indiana: ["Indianapolis", "Bloomington", "Fort Wayne", "South Bend", "Evansville", "Carmel", "Nashville", "Lafayette", "Michigan City", "Gary", "Terre Haute", "French Lick"],
  iowa: ["Des Moines", "Iowa City", "Cedar Rapids", "Dubuque", "Ames", "Sioux City", "Council Bluffs", "Waterloo", "Decorah", "Pella", "Mason City", "Bettendorf"],
  kansas: ["Wichita", "Overland Park", "Kansas City", "Lawrence", "Topeka", "Manhattan", "Dodge City", "Salina", "Hutchinson", "Leavenworth", "Olathe", "Emporia"],
  kentucky: ["Louisville", "Lexington", "Bowling Green", "Frankfort", "Covington", "Paducah", "Ashland", "Richmond", "Elizabethtown", "Danville", "Georgetown", "Bardstown"],
  louisiana: ["New Orleans", "Baton Rouge", "Lafayette", "Shreveport", "Lake Charles", "Monroe", "Alexandria", "Houma", "Thibodaux", "Natchitoches", "Slidell", "Mandeville"],
  maine: ["Portland", "Bar Harbor", "Kennebunkport", "Bangor", "Augusta", "Camden", "Rockland", "Boothbay Harbor", "Freeport", "Ellsworth", "Ogunquit", "York"],
  maryland: ["Baltimore", "Annapolis", "Ocean City", "Frederick", "Rockville", "Bethesda", "Silver Spring", "Cambridge", "Easton", "Hagerstown", "Gaithersburg", "Cumberland"],
  massachusetts: ["Boston", "Salem", "Cambridge", "Provincetown", "Nantucket", "Martha's Vineyard", "Plymouth", "Gloucester", "Springfield", "Worcester", "Lenox", "New Bedford"],
  michigan: ["Detroit", "Grand Rapids", "Traverse City", "Ann Arbor", "Lansing", "Mackinac Island", "Kalamazoo", "Flint", "Holland", "Saugatuck", "Marquette", "Petoskey"],
  minnesota: ["Minneapolis", "Saint Paul", "Duluth", "Rochester", "Bloomington", "Stillwater", "Brainerd", "Mankato", "St. Cloud", "Winona", "Ely", "Bemidji"],
  mississippi: ["Biloxi", "Gulfport", "Jackson", "Oxford", "Tupelo", "Natchez", "Hattiesburg", "Vicksburg", "Starkville", "Bay St. Louis", "Ocean Springs", "Greenville"],
  missouri: ["St. Louis", "Kansas City", "Branson", "Springfield", "Columbia", "Jefferson City", "St. Charles", "Joplin", "Hannibal", "Lake Ozark", "Independence", "Cape Girardeau"],
  montana: ["Bozeman", "Missoula", "Whitefish", "Kalispell", "Billings", "Helena", "Great Falls", "Butte", "Livingston", "Red Lodge", "Big Sky", "West Yellowstone"],
  nebraska: ["Omaha", "Lincoln", "Grand Island", "Kearney", "Scottsbluff", "North Platte", "Fremont", "Hastings", "Columbus", "Norfolk", "Beatrice", "Alliance"],
  nevada: ["Las Vegas", "Reno", "Lake Tahoe", "Henderson", "Carson City", "North Las Vegas", "Mesquite", "Elko", "Boulder City", "Laughlin", "Sparks", "Pahrump"],
  "new-hampshire": ["Portsmouth", "Manchester", "Nashua", "Concord", "Hanover", "Dover", "Keene", "Lincoln", "North Conway", "Littleton", "Exeter", "Wolfeboro"],
  "new-jersey": ["Atlantic City", "Cape May", "Jersey City", "Hoboken", "Newark", "Princeton", "Asbury Park", "Wildwood", "Montclair", "Morristown", "Ocean City", "Long Branch"],
  "new-mexico": ["Santa Fe", "Albuquerque", "Taos", "Las Cruces", "Roswell", "Ruidoso", "Farmington", "Gallup", "Carlsbad", "Silver City", "Truth or Consequences", "Los Alamos"],
  "new-york": ["New York City", "Buffalo", "Rochester", "Syracuse", "Albany", "Ithaca", "Hudson", "Niagara Falls", "Saratoga Springs", "Lake Placid", "Montauk", "Poughkeepsie"],
  "north-carolina": ["Charlotte", "Asheville", "Raleigh", "Durham", "Wilmington", "Greensboro", "Boone", "Chapel Hill", "Fayetteville", "Outer Banks", "High Point", "Winston-Salem"],
  "north-dakota": ["Fargo", "Bismarck", "Grand Forks", "Minot", "West Fargo", "Williston", "Dickinson", "Jamestown", "Mandan", "Devils Lake", "Valley City", "Wahpeton"],
  ohio: ["Columbus", "Cleveland", "Cincinnati", "Toledo", "Dayton", "Akron", "Canton", "Athens", "Sandusky", "Marietta", "Newark", "Youngstown"],
  oklahoma: ["Oklahoma City", "Tulsa", "Norman", "Broken Arrow", "Stillwater", "Lawton", "Edmond", "Enid", "Muskogee", "Bartlesville", "Shawnee", "Ardmore"],
  oregon: ["Portland", "Bend", "Eugene", "Salem", "Ashland", "Medford", "Cannon Beach", "Newport", "Hood River", "Astoria", "Corvallis", "Lincoln City"],
  pennsylvania: ["Philadelphia", "Pittsburgh", "Harrisburg", "Lancaster", "Bethlehem", "Allentown", "Erie", "Scranton", "Gettysburg", "State College", "York", "Reading"],
  "rhode-island": ["Providence", "Newport", "Warwick", "Narragansett", "Westerly", "Bristol", "Middletown", "East Greenwich", "North Kingstown", "South Kingstown", "Pawtucket", "Central Falls"],
  "south-carolina": ["Charleston", "Myrtle Beach", "Columbia", "Greenville", "Hilton Head Island", "Spartanburg", "Beaufort", "Rock Hill", "Aiken", "Florence", "Summerville", "Georgetown"],
  "south-dakota": ["Sioux Falls", "Rapid City", "Deadwood", "Sturgis", "Spearfish", "Mitchell", "Aberdeen", "Watertown", "Brookings", "Pierre", "Custer", "Yankton"],
  tennessee: ["Nashville", "Memphis", "Knoxville", "Chattanooga", "Gatlinburg", "Pigeon Forge", "Franklin", "Clarksville", "Murfreesboro", "Johnson City", "Bristol", "Sevierville"],
  texas: ["Austin", "Dallas", "Houston", "San Antonio", "Fort Worth", "Galveston", "El Paso", "Waco", "Fredericksburg", "Corpus Christi", "Plano", "Lubbock"],
  utah: ["Salt Lake City", "Park City", "Moab", "St. George", "Ogden", "Provo", "Cedar City", "Logan", "Kanab", "Heber City", "Vernal", "Midway"],
  vermont: ["Burlington", "Stowe", "Montpelier", "Woodstock", "Brattleboro", "Rutland", "Middlebury", "Manchester", "Bennington", "Shelburne", "Waterbury", "Killington"],
  virginia: ["Virginia Beach", "Richmond", "Arlington", "Alexandria", "Charlottesville", "Norfolk", "Williamsburg", "Roanoke", "Fredericksburg", "Harrisonburg", "Newport News", "Lynchburg"],
  washington: ["Seattle", "Spokane", "Tacoma", "Olympia", "Bellingham", "Leavenworth", "Walla Walla", "Everett", "Yakima", "Port Angeles", "Bremerton", "Redmond"],
  "west-virginia": ["Charleston", "Harpers Ferry", "Morgantown", "Parkersburg", "Wheeling", "Beckley", "Lewisburg", "Fayetteville", "Martinsburg", "Clarksburg", "Elkins", "Bluefield"],
  wisconsin: ["Milwaukee", "Madison", "Green Bay", "Wisconsin Dells", "Door County", "Eau Claire", "La Crosse", "Kenosha", "Appleton", "Sheboygan", "Wausau", "Sturgeon Bay"],
  wyoming: ["Jackson", "Cheyenne", "Cody", "Laramie", "Casper", "Sheridan", "Gillette", "Rock Springs", "Green River", "Evanston", "Dubois", "Thermopolis"],
};

const COUNTY_PREFIXES = [
  "Coastal",
  "Central",
  "Northern",
  "Southern",
  "River",
  "Highland",
  "Heritage",
  "Lake",
  "Valley",
  "Foothill",
  "Capital",
  "Wine",
];

const EXPERIENCES = [
  {
    icon: "◆",
    title: "Signature road route",
    description: "A curated drive linking the best viewpoints, table stops, and overnight pacing.",
  },
  {
    icon: "◇",
    title: "Food and culture circuit",
    description: "Chef tables, markets, and historic districts stitched into one seamless day.",
  },
  {
    icon: "○",
    title: "Nature and wellness escape",
    description: "Sunrise trails, restorative stays, and relaxed afternoons by the water.",
  },
  {
    icon: "△",
    title: "Design and architecture pass",
    description: "Neighborhoods, landmark buildings, and museums with private-guide options.",
  },
];

const YOUTUBE_BY_SLUG: Record<string, string> = {
  california: "https://www.youtube.com/watch?v=q_F4PmMizRo",
  texas: "https://www.youtube.com/watch?v=XMx7f5Vq3mE",
  florida: "https://www.youtube.com/watch?v=BiP-yf9Tz3c",
  "new-york": "https://www.youtube.com/watch?v=HiZXABM3WnA",
  arizona: "https://www.youtube.com/watch?v=i4fYisQ6S6Q",
};

function placeholderHero(seed: string) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/1920/1080`;
}

/** 250x250 state silhouette in `public/states/[slug].png` (see `npm run states:thumbnails`). */
export function defaultStateThumbnailUrl(slug: string): string {
  return `/states/${slug}.png`;
}

function toSlug(input: string) {
  return input.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function titleToken(row: USStateRow) {
  return row.name.split(" ")[0];
}

function tierFor(slug: string): "high" | "mid" | "low" {
  if (HIGH_POP_SLUGS.has(slug)) return "high";
  if (MID_POP_SLUGS.has(slug)) return "mid";
  return "low";
}

function countsFor(tier: "high" | "mid" | "low") {
  if (tier === "high") return { attractions: 9, landmarks: 9, experiences: 4, cities: 12, counties: 9 };
  if (tier === "mid") return { attractions: 6, landmarks: 6, experiences: 3, cities: 6, counties: 6 };
  return { attractions: 4, landmarks: 3, experiences: 2, cities: 3, counties: 3 };
}

function buildCityNames(row: USStateRow): string[] {
  const fromOverride = CITY_OVERRIDES[row.slug];
  if (fromOverride && fromOverride.length > 0) return fromOverride.slice(0, 12);
  const fallback = [
    `${titleToken(row)} City`,
    `${titleToken(row)} Harbor`,
    `${titleToken(row)} Heights`,
    `${titleToken(row)} Springs`,
    `${titleToken(row)} Point`,
    `${titleToken(row)} Valley`,
    `${titleToken(row)} Junction`,
    `${titleToken(row)} Bay`,
    `${titleToken(row)} Grove`,
    `${titleToken(row)} Ridge`,
    `${titleToken(row)} Village`,
    `${titleToken(row)} Landing`,
  ];
  return fallback.slice(0, 12);
}

function buildTopCities(row: USStateRow) {
  const names = buildCityNames(row);
  return names.map((name, idx) => ({
    name,
    slug: toSlug(name),
    shortDescription:
      idx % 3 === 0
        ? `Urban energy, signature dining, and easy access to ${row.name} highlights.`
        : idx % 3 === 1
          ? "A polished base for day trips, design neighborhoods, and local food culture."
          : "Scenic pacing with strong hotel options and quick links to regional experiences.",
    imageUrl: `https://picsum.photos/seed/${encodeURIComponent(`${row.slug}-city-${idx + 1}`)}/1200/750`,
  }));
}

function buildTopCounties(row: USStateRow, countyCount: number) {
  return Array.from({ length: countyCount }).map((_, idx) => {
    const prefix = COUNTY_PREFIXES[idx % COUNTY_PREFIXES.length];
    const name = `${prefix} ${titleToken(row)} County`;
    return {
      name,
      slug: toSlug(name),
      shortDescription:
        idx % 2 === 0
          ? "Balanced mix of natural scenery, small towns, and route-friendly dining stops."
          : "A strong planning zone for scenic drives, local producers, and overnight escapes.",
    };
  });
}

function buildMapPlaces(row: USStateRow, count: number, kind: "attraction" | "landmark") {
  const attractionLabels = [
    "Riverwalk District",
    "Historic Market Hall",
    "Science and Discovery Center",
    "Botanical Conservatory",
    "Harbor Promenade",
    "Old Town Square",
    "Waterfront Boardwalk",
    "Cultural Arts Pavilion",
    "Scenic Rail Depot",
    "Aquarium and Marine Center",
    "Mountain Vista Tram",
    "Public Garden Estate",
  ];
  const landmarkLabels = [
    "Capitol Grounds",
    "Historic Courthouse",
    "Grand Suspension Bridge",
    "Founders Monument",
    "Lighthouse Point",
    "Veterans Memorial Plaza",
    "Cathedral District",
    "Civil Rights Landmark",
    "State Heritage Fort",
    "Clocktower Square",
    "Trailhead Arch",
    "Observation Tower",
  ];

  const source = kind === "attraction" ? attractionLabels : landmarkLabels;
  return Array.from({ length: count }).map((_, idx) => {
    const label = source[idx % source.length];
    return {
      name: `${row.name} ${label}`,
      address: `${row.name}, ${row.abbr}`,
    };
  });
}

function heroTagline(row: USStateRow, tier: "high" | "mid" | "low") {
  if (tier === "high") return `${row.name} at full scale - signature cities, landmark routes, and curated escapes.`;
  if (tier === "mid") return `${row.name} framed through taste, landscape, and efficient regional pacing.`;
  return `${row.name} for slower luxury - scenic roads, local culture, and destination detail.`;
}

export function buildPlaceholderDestination(row: USStateRow): StateDestination {
  const slug = row.slug;
  const tier = tierFor(slug);
  const counts = countsFor(tier);
  const airports = MAJOR_AIRPORT_BY_ABBR[row.abbr] ?? `${row.abbr} primary airport`;
  const topCities = buildTopCities(row);
  const topCounties = buildTopCounties(row, counts.counties);

  return {
    name: row.name,
    slug,
    heroImage: placeholderHero(slug),
    thumbnailShape: defaultStateThumbnailUrl(slug),
    tagline: heroTagline(row, tier),
    description: `<p>${row.name} combines distinctive geography with city and regional experiences that reward intentional trip design. This dossier follows the California page format so planning feels consistent across all 50 states.</p>`,
    bestSeason: "Year-Round",
    idealFor: tier === "high" ? ["Couples", "Luxury", "Foodies", "Families", "Adventure"] : ["Couples", "Foodies", "Adventure"],
    population: `${POPULATION_ESTIMATE_BY_SLUG[slug] ?? "~1-5 million"} (2020s estimate)`,
    knownFor: [
      `${row.name} regional identity`,
      "Scenic drives and destination corridors",
      "Local dining and cultural institutions",
      "Seasonal outdoor experiences",
    ],
    climate: `Conditions vary by region in ${row.name}; build itineraries with local microclimates in mind.`,
    avgCostPerDay: tier === "high" ? "$260-520+" : tier === "mid" ? "$220-430+" : "$180-360+",
    majorAirports: [airports],
    driveability: "Moderate",
    walkability: tier === "high" ? "Medium" : "Low",
    whyVisit: `<p>${row.name} works best when traveled in focused zones. The state can be shaped into coastal, mountain, urban, and heritage chapters so each day has clear rhythm and minimal transfer friction.</p><p>Use this guide to sequence city stays, attraction clusters, and county-level detours without compromising pace or quality.</p>`,
    thingsToExplore: {
      counties: topCounties.length,
      cities: topCities.length,
      touristAttractions: counts.attractions,
      nationalParks: tier === "high" ? 3 : tier === "mid" ? 2 : 1,
      monumentsLandmarks: counts.landmarks,
      publicBeaches: tier === "high" ? 30 : tier === "mid" ? 12 : 4,
    },
    touristAttractionSpots: buildMapPlaces(row, counts.attractions, "attraction"),
    landmarkMonumentSpots: buildMapPlaces(row, counts.landmarks, "landmark"),
    topCities,
    topCounties,
    showCounties: true,
    featuredExperiences: EXPERIENCES.slice(0, counts.experiences),
    gallery: Array.from({ length: 6 }).map(
      (_, idx) => `https://picsum.photos/seed/${encodeURIComponent(`${slug}-gallery-${idx + 1}`)}/1400/900`,
    ),
    videoUrl: YOUTUBE_BY_SLUG[slug] ?? "https://www.youtube.com/watch?v=35npVaFGHMY",
    quickTips: [
      "Plan by region, not by state border - this keeps driving windows realistic.",
      "Book headline attractions and dining rooms before flights during high season.",
      "Start scenic routes early to avoid traffic and capture better light.",
      "Use one anchor city per 2-3 nights to reduce check-in fatigue.",
      "Carry layers and water; weather swings can be sharp within one day.",
    ],
    seasonalBreakdown: {
      spring: "",
      summer: "",
      fall: "",
      winter: "",
    },
    metaTitle: `${row.name} Travel Guide | FTMAG Destinations`,
    metaDescription: `Explore ${row.name} with the same FTMAG destination format used across all state pages: cities, counties, attractions, landmarks, and planning tools.`,
    contentComplete: true,
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
    /* DB unavailable - fall back */
  }

  return getDefaultStateDestination(slug);
}

export function getAllStateSlugs(): string[] {
  return US_STATES_ALPHABETICAL.map((s) => s.slug);
}
