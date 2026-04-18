import type { PrismaClient } from "@prisma/client";

function pdf(name: string) {
  return `/magazines/${encodeURIComponent(name)}`;
}

function cov(file: string) {
  return `/magazines/cover-thumbnails/${file}`;
}

/** One-time seed when Magazine table is empty — paths assume PDFs in public/magazines/ and covers in public/magazines/cover-thumbnails/ */
export async function seedMagazinesIfEmpty(prisma: PrismaClient) {
  const n = await prisma.magazine.count();
  if (n > 0) {
    console.log("Seed: magazines already present:", n);
    return;
  }

  await prisma.magazine.createMany({
    data: [
      {
        slug: "spring-2026",
        displayTitle: "Spring 2026",
        releaseDate: new Date("2026-04-09"),
        releaseLabel: "April 9, 2026",
        blurb:
          "From championship barbecue with Myron Mixon to a coast-to-coast journey through America’s most compelling destinations, the Spring 2026 issue of Food & Travel Magazine is built around the road and what fuels it. This edition moves through Texas, Mississippi, California, Oregon, the Carolinas, and beyond—highlighting the flavors, landscapes, and experiences that define each place. It’s a mix of pitmasters, wine regions, small towns, and outdoor escapes, where every stop offers something worth tasting. The common thread isn’t just where you go, it’s how each destination reveals itself through its food, its people, and the moments in between.",
        coverSrc: cov("foodandtravel-spring-2026.jpg"),
        pdfSrc: pdf("Food & Travel Magazine Spring 2026.pdf"),
        purchaseUrl: null,
      },
      {
        slug: "winter-2025",
        displayTitle: "Winter 2025",
        releaseDate: new Date("2025-12-07"),
        releaseLabel: "December 7, 2025",
        blurb:
          "The Winter 2025 issue of Food & Travel Magazine delivers a season of bold flavors, inspiring personalities, and destination-driven storytelling. This edition blends culinary excellence with immersive travel, highlighting vibrant communities and winter escapes across the United States. Readers are introduced to celebrated chefs and innovators shaping the modern food landscape, alongside features that explore luxury resorts, cultural hubs, and scenic retreats perfect for the colder months.",
        coverSrc: cov("foodandtravel-winter-2025.png"),
        pdfSrc: pdf("Food & Travel Magazine Winter 2025.pdf"),
        purchaseUrl: null,
      },
      {
        slug: "holiday-2025",
        displayTitle: "Holiday 2025",
        releaseDate: new Date("2025-11-09"),
        releaseLabel: "November 9, 2025",
        blurb:
          "The Holiday 2025 Special Issue of Food & Travel Magazine blends culinary star power with immersive seasonal destinations across America. The cover story features Gordon Ramsay, who discusses his new Apple TV+ docuseries Knife Edge: Chasing Michelin Stars, offering insight into the intensity, vulnerability, and pursuit of excellence behind Michelin recognition. Beyond the exclusive feature, the issue highlights festive escapes from Boerne, Texas and Sandia Resort, New Mexico to Fresno, California, Martha’s Vineyard, Massachusetts, and the historic culinary corridor of Lexington, Concord, and Lowell.",
        coverSrc: cov("foodandtravel-fall-holiday-2025.png"),
        pdfSrc: pdf("Food & Travel Magazine Holiday 2025 Rough Draft 1.pdf"),
        purchaseUrl: null,
      },
      {
        slug: "summer-2025",
        displayTitle: "Summer 2025",
        releaseDate: new Date("2025-07-06"),
        releaseLabel: "July 6, 2025",
        blurb:
          "This Summer 2025 issue of Food & Travel Magazine is a bold celebration of American identity, flavor, and place. On the cover, Defending California explores Los Angeles through a deeply personal lens, highlighting the diversity and community that define the Golden State. From rooftop fine dining at Bien Shur at Sandia Resort & Casino in New Mexico to the excitement of Gun Lake Casino in Michigan, this issue blends luxury with local culture.",
        coverSrc: cov("foodandtravel-summer-2025.png"),
        pdfSrc: pdf("Food & Travel Magazine SUMMER 2025.pdf"),
        purchaseUrl: null,
      },
      {
        slug: "spring-2025",
        displayTitle: "Spring 2025",
        releaseDate: new Date("2025-04-08"),
        releaseLabel: "April 8, 2025",
        blurb:
          "The Spring 2025 issue of Food & Travel Magazine is a celebration of connection, culture, and culinary artistry. This edition features an exclusive cover story on Chef Antonia Lofaso, exploring her journey from classical French training to becoming one of Los Angeles’ most dynamic restaurateurs. Readers will discover vibrant spring destinations including The Palm Beaches, New Bedford, Lynchburg, Chincoteague Island, Ridgeland, Tishomingo County, Mobile, and more.",
        coverSrc: cov("foodandtravel-spring-2025.png"),
        pdfSrc: pdf("Food & Travel Magazine SPRING 2025.pdf"),
        purchaseUrl: null,
      },
      {
        slug: "fall-winter-2024",
        displayTitle: "Fall / Winter 2024",
        releaseDate: new Date("2024-10-07"),
        releaseLabel: "October 7, 2024",
        blurb:
          "The Fall & Winter 2024 issue of Food & Travel Magazine is a sweeping celebration of culinary innovation and seasonal destination travel across America. The cover story features world-renowned Chef René Redzepi, who reflects on rethinking the global food system, sustainability, and his Apple TV+ series Omnivore. An exclusive interview with Chef Craig Wilmer of Farmhouse Restaurant in Northern California explores ingredient-driven cuisine and modern fine dining philosophy.",
        coverSrc: cov("foodandtravel-fall-winter-2024.png"),
        pdfSrc: pdf("Food & Travel Magazine FALL-Winter 2024.pdf"),
        purchaseUrl: null,
      },
      {
        slug: "summer-2024",
        displayTitle: "Summer 2024",
        releaseDate: new Date("2024-07-09"),
        releaseLabel: "July 9, 2024",
        blurb:
          "This Summer 2024 issue of Food & Travel Magazine captures the spirit of America’s most dynamic warm-weather destinations, blending outdoor adventure, rich history, and unforgettable culinary experiences. From the lakeside serenity of North Lake Tahoe to the Gold Rush charm and mountain cuisine of Tuolumne County, readers are invited to explore landscapes where nature and flavor meet. This issue also features an exclusive cover story on Harry Hamlin, named “The Sexiest Chef Alive.”",
        coverSrc: cov("foodandtravel-summer-2024.png"),
        pdfSrc: pdf("Food & Travel Magazine Summer 2024.pdf"),
        purchaseUrl: null,
      },
      {
        slug: "spring-2024",
        displayTitle: "Spring 2024",
        releaseDate: new Date("2024-04-10"),
        releaseLabel: "April 10, 2024",
        blurb:
          "Food & Travel Magazine is a luxury lifestyle publication dedicated to immersive destinations, exceptional dining, and the people who bring places to life. Each quarterly issue blends in-depth travel features with chef profiles, cultural stories, and curated itineraries across the United States and beyond. From Silver City, New Mexico to Henderson, Nevada and Bear Lake, Utah–Idaho, we explore cities through their landscapes, flavors, artisans, and communities.",
        coverSrc: cov("foodandtravel-spring-2024.png"),
        pdfSrc: pdf("Food & Travel Magazine Spring 2024.pdf"),
        purchaseUrl: null,
      },
      {
        slug: "winter-2023",
        displayTitle: "Winter 2023",
        releaseDate: new Date("2023-12-06"),
        releaseLabel: "December 6, 2023",
        blurb:
          "The Winter 2023 issue of Food & Travel Magazine embraces the season with a blend of warm-weather escapes, cultural discovery, and destination-driven dining. The cover story spotlights Winter in Miami, exploring the city’s Michelin-recognized restaurants, vibrant arts scene, luxury hotels, and sun-soaked waterfront experiences. This edition also highlights sustainable culinary travel with a feature on eco-conscious resorts, alongside indulgent all-inclusive experiences in the Caribbean.",
        coverSrc: cov("foodandtravel-winter-2022.png"),
        pdfSrc: pdf("Food & Travel Magazine Winter 2023.pdf"),
        purchaseUrl: null,
      },
      {
        slug: "fall-2023",
        displayTitle: "Fall 2023",
        releaseDate: new Date("2023-09-07"),
        releaseLabel: "September 7, 2023",
        blurb:
          "The Fall 2023 issue of Food & Travel Magazine is a sweeping celebration of America’s most compelling autumn destinations, anchored by an exclusive interview with legendary chef Jean-Georges Vongerichten, who reflects on his early struggles, culinary awakening, and rise to global acclaim. This edition also features a standout luxury stay at the Canopy Hotel Waterfront in Portland, Maine, capturing refined coastal hospitality at its finest.",
        coverSrc: cov("foodandtravel-fall-2023.png"),
        pdfSrc: pdf("Food & Travel Magazine Fall 2023.pdf"),
        purchaseUrl: null,
      },
      {
        slug: "summer-2023",
        displayTitle: "Summer 2023",
        releaseDate: new Date("2023-07-07"),
        releaseLabel: "July 7, 2023",
        blurb:
          "This Summer 2023 issue of Food & Travel Magazine celebrates America’s most inspiring warm-weather destinations, where natural beauty meets unforgettable flavor. From the towering redwoods and rugged coastline of Humboldt County, California to the vibrant culinary culture of Baton Rouge and the farm-fresh bounty of Fresno County, this edition is a journey through landscapes, lakes, mountains, and charming small towns.",
        coverSrc: cov("foodandtravel-summer-2023.png"),
        pdfSrc: pdf("Food & Travel Magazine Summer 2023.pdf"),
        purchaseUrl: null,
      },
      {
        slug: "spring-2023",
        displayTitle: "Spring 2023",
        releaseDate: new Date("2023-04-07"),
        releaseLabel: "April 7, 2023",
        blurb:
          "Food & Travel Magazine is a luxury lifestyle publication dedicated to exceptional destinations, fine dining, and authentic cultural experiences across the globe. We go beyond surface-level travel recommendations, exploring cities and regions through the people who define them — chefs, farmers, vintners, artisans, hoteliers, and cultural stewards. Each issue blends refined storytelling with immersive photography to capture not only where to go, but what it feels like to be there.",
        coverSrc: cov("foodandtravel-spring-2023.png"),
        pdfSrc: pdf("Food & Travel Magazine Spring 2023.pdf"),
        purchaseUrl: null,
      },
      {
        slug: "winter-2022",
        displayTitle: "Winter 2022",
        releaseDate: new Date("2022-12-07"),
        releaseLabel: "December 7, 2022",
        blurb:
          "The Winter 2022 issue of Food & Travel Magazine invites readers to trade snowstorms for sunshine, spotlighting vibrant seasonal escapes across the United States. The cover story, “Winter in Miami,” explores the city’s Michelin-recognized dining scene, rooftop and waterfront restaurants, thriving arts districts, luxury hotels, and world-class spas. Exclusive features include eco-conscious culinary destinations and all-inclusive experiences.",
        coverSrc: cov("foodandtravel-winter-2022.png"),
        pdfSrc: pdf("Food & Travel Magazine Winter 2022.pdf"),
        purchaseUrl: null,
      },
    ],
  });

  console.log("Seed: inserted legacy magazine rows (if table was empty)");
}
