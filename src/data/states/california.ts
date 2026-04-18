import type { StateDestination } from "@/types/stateDestination";

/** Editorial + facts synthesized from public sources; copy is original for FTMAG. */
export const CALIFORNIA_DESTINATION: StateDestination = {
  name: "California",
  slug: "california",
  heroImage:
    "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=2400&q=80",
  thumbnailShape: "/states/california.png",
  tagline: "Pacific light, desert silence, and cities that set the tempo for the world.",
  description: `
    <p>California is less a single destination than a continent compressed into one long coastline—vineyards that behave like Europe, Sierra granite that behaves like the Alps, and a Central Valley that feeds imagination as much as it feeds tables.</p>
    <p>The state rewards slow planning and fast pivots: mornings can begin in cool fog and end in dry heat three hundred miles away. What unifies the experience is scale—geographic, culinary, and cultural—presented with the confidence of a place that has been mythologized and still manages to feel immediate.</p>
    <p>For the luxury traveler, value is found in contrast: a cliffside inn above the Pacific, a private tasting in Napa or Sonoma, a desert retreat where night skies erase every screen, and a city evening where the room is tuned like a concert hall.</p>
  `,
  bestSeason: "Year-Round",
  idealFor: ["Couples", "Luxury", "Foodies", "Adventure", "Families"],
  population: "~39.0 million (2020s estimate)",
  knownFor: [
    "Pacific coastline & Big Sur",
    "Wine country (Napa & Sonoma)",
    "National parks (Yosemite, Joshua Tree, Redwood)",
    "Entertainment & design capitals",
    "Farm-to-table cuisine",
  ],
  climate: "Mediterranean along the coast; high desert inland; alpine in the Sierra; extremes by microclimate.",
  avgCostPerDay: "$280–550+ (varies sharply by region and season)",
  majorAirports: [
    "LAX — Los Angeles International",
    "SFO — San Francisco International",
    "SAN — San Diego International",
    "SJC — San Jose Mineta",
    "SMF — Sacramento International",
    "OAK — Oakland International",
  ],
  driveability: "Moderate",
  walkability: "Medium",
  whyVisit: `
    <p>Come for the signature routes—Highway 1’s ribbon above the sea, the sequoia groves that make daylight feel curated, the desert basins where silence becomes a luxury amenity. Stay for the smaller beats: a harbor town at golden hour, a chef’s counter with a wine list that reads like a atlas, a hike that starts in mist and ends above treeline.</p>
    <p>California’s hospitality layer is thick with specialists—drivers who know cliff weather, sommeliers who can pivot from Pinot to pét-nat, guides who translate geologic time into an afternoon. The state asks for curiosity; it returns detail.</p>
  `,
  thingsToExplore: {
    counties: 58,
    cities: 482,
    touristAttractions: 85,
    nationalParks: 9,
    monumentsLandmarks: 42,
    publicBeaches: 420,
  },
  touristAttractionSpots: [
    { name: "Hollywood Walk of Fame", address: "Hollywood Boulevard, Hollywood, Los Angeles, CA" },
    { name: "Santa Monica Pier", address: "200 Santa Monica Pier, Santa Monica, CA" },
    { name: "Universal Studios Hollywood", address: "100 Universal City Plaza, Universal City, CA" },
    { name: "Fisherman's Wharf", address: "Jefferson Street, San Francisco, CA" },
    { name: "La Brea Tar Pits & Museum", address: "5801 Wilshire Boulevard, Los Angeles, CA" },
    { name: "San Diego Zoo", address: "2920 Zoo Drive, San Diego, CA" },
    { name: "Monterey Bay Aquarium", address: "886 Cannery Row, Monterey, CA" },
    { name: "Old Sacramento Waterfront", address: "1002 2nd Street, Sacramento, CA" },
  ],
  landmarkMonumentSpots: [
    { name: "Golden Gate Bridge", address: "Golden Gate Bridge, San Francisco, CA" },
    { name: "Hollywood Sign", address: "Mount Lee Road, Los Angeles, CA" },
    { name: "Hearst Castle", address: "750 Hearst Castle Road, San Simeon, CA" },
    { name: "Alcatraz Island", address: "Alcatraz Island, San Francisco, CA" },
    { name: "Griffith Observatory", address: "2800 East Observatory Road, Los Angeles, CA" },
    { name: "Watts Towers", address: "1765 East 107th Street, Los Angeles, CA" },
  ],
  topCities: [
    {
      name: "San Francisco",
      slug: "san-francisco",
      shortDescription:
        "Hills, fog, and a dining scene where innovation is the default setting.",
      imageUrl:
        "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Los Angeles",
      slug: "los-angeles",
      shortDescription:
        "Ocean, studios, and neighborhoods that each speak their own design language.",
      imageUrl:
        "https://images.unsplash.com/photo-1580655653885-65763b2597d0?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "San Diego",
      slug: "san-diego",
      shortDescription:
        "Maritime light, refined resorts, and Baja-influenced flavors.",
      imageUrl:
        "https://images.unsplash.com/photo-1603725117928-6f09697f34aa?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Sacramento",
      slug: "sacramento",
      shortDescription:
        "Riverfront calm with access to wine country and the Sierra foothills.",
      imageUrl:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "San Jose",
      slug: "san-jose",
      shortDescription:
        "South Bay capital of tech, multicultural dining, and gateway to the Santa Cruz coast.",
      imageUrl:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Oakland",
      slug: "oakland",
      shortDescription:
        "Waterfront energy, arts districts, and East Bay access to wine country and the hills.",
      imageUrl:
        "https://images.unsplash.com/photo-1514939775307-d44e7f10cabd?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Long Beach",
      slug: "long-beach",
      shortDescription:
        "Harbor city with Queen Mary gravitas, surf culture, and quick hops into greater L.A.",
      imageUrl:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Anaheim",
      slug: "anaheim",
      shortDescription:
        "Resort corridors and entertainment districts with Orange County polish.",
      imageUrl:
        "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Santa Barbara",
      slug: "santa-barbara",
      shortDescription:
        "American Riviera light—red-tile roofs, wine-country day trips, and Channel views.",
      imageUrl:
        "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Napa",
      slug: "napa",
      shortDescription:
        "Cabernet country—cellar doors, Michelin-caliber tables, and balloon mornings over vines.",
      imageUrl:
        "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Monterey",
      slug: "monterey",
      shortDescription:
        "Harbor history meets aquarium calm; Big Sur and Carmel are a short coastal drive away.",
      imageUrl:
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Palm Springs",
      slug: "palm-springs",
      shortDescription:
        "Desert modernism, pool culture, and mountain silhouettes at golden hour.",
      imageUrl:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
    },
  ],
  topCounties: [
    {
      name: "Orange County",
      slug: "orange-county",
      shortDescription: "Coastal enclaves, surf culture, and polished resort towns.",
    },
    {
      name: "Sonoma County",
      slug: "sonoma-county",
      shortDescription: "Rolling vineyards, farm stands, and low-key luxury.",
    },
    {
      name: "Monterey County",
      slug: "monterey-county",
      shortDescription: "Big Sur drama meets aquarium calm and wine-country hills.",
    },
  ],
  showCounties: true,
  featuredExperiences: [
    {
      icon: "◆",
      title: "Pacific Coast by road",
      description: "Curated stops along Highway 1—viewpoints timed for light, not crowds.",
    },
    {
      icon: "◇",
      title: "Wine country deep dive",
      description: "Napa and Sonoma with private tastings and vineyard walks.",
    },
    {
      icon: "○",
      title: "Sierra ascent",
      description: "Yosemite icons or high-country trails with expert guiding.",
    },
    {
      icon: "△",
      title: "Desert modernism",
      description: "Joshua Tree and Palm Springs—architecture under open sky.",
    },
  ],
  gallery: [
    "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  ],
  videoUrl: "https://www.youtube.com/watch?v=LXb3EKWsInQ",
  quickTips: [
    "Layer clothing: coastal fog and inland heat can diverge by 30°F in a single day.",
    "Book national park entries and timed reservations where required—especially peak season.",
    "Rent a car for flexibility; coastal highways reward early starts.",
    "Tasting rooms fill fast on weekends—reserve before you fly.",
    "Carry water in desert regions; dehydration arrives quietly.",
  ],
  seasonalBreakdown: {
    spring:
      "Wildflowers along central coast ranges; Napa and Sonoma awake with bud break; waterfalls peak in the Sierra.",
    summer:
      "Fog cools San Francisco while inland valleys heat; desert mornings are best; coast crowds peak—book ahead.",
    fall:
      "Crush season in wine country; crisp Sierra nights; lighter crowds at popular overlooks after Labor Day.",
    winter:
      "Desert clarity and comfortable days; snow sports in the Sierra; storm surf on select coasts.",
  },
  metaTitle: "California Travel Guide | FTMAG Destinations",
  metaDescription:
    "A luxury-forward dossier for California: coast, wine country, Sierra peaks, and desert skies—with seasons, airports, and signature experiences.",
  contentComplete: true,
};
