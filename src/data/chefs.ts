/**
 * Chef listings inspired by public directory-style pages (e.g. Celebrity Chef Network).
 * Portrait images: Wikimedia Commons via Wikipedia page summary thumbnails (CC / attributed at source).
 */

export type Chef = {
  slug: string;
  name: string;
  excerpt: string;
  cuisines: string[];
  imageUrl: string;
};

/** Cuisine filter list aligned with common talent-directory categories (no fee tiers). */
export const CUISINE_FILTERS: string[] = [
  "American",
  "Asian",
  "BBQ",
  "Cajun",
  "Caribbean",
  "Celebrities in Food",
  "Classical French",
  "Comfort",
  "Desserts and Pastry",
  "French",
  "Fusion",
  "Garden to Table",
  "Healthy",
  "Indian",
  "Italian",
  "Kosher",
  "Mexican",
  "Molecular Gastronomy",
  "Organic",
  "Southern",
  "TexMex",
  "Vegan",
  "Vietnamese",
  "Wine Expert",
  "Writer/Blogger",
].sort((a, b) => a.localeCompare(b));

export const CHEFS: Chef[] = [
  {
    slug: "alice-waters",
    name: "Alice Waters",
    excerpt:
      "Alice Waters is an iconic American chef, restaurateur, and activist, best known for her pioneering work with seasonal, organic ingredients and the founding of Chez Panisse in Berkeley.",
    cuisines: ["Healthy", "Organic"],
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Alice_Waters_2014.jpg/330px-Alice_Waters_2014.jpg",
  },
  {
    slug: "ayesha-curry",
    name: "Ayesha Curry",
    excerpt:
      "Ayesha Curry moved to Charlotte, North Carolina, at a young age, where she developed a passion for cooking and entertaining that grew into cookbooks, television, and a lifestyle brand.",
    cuisines: ["American", "Celebrities in Food", "Fusion", "Healthy", "Writer/Blogger"],
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Ayesha_Curry_at_GOAT_Premiere.png/330px-Ayesha_Curry_at_GOAT_Premiere.png",
  },
  {
    slug: "bethenny-frankel",
    name: "Bethenny Frankel",
    excerpt:
      "Born in New York City, Bethenny Frankel studied psychology at Boston University and initially pursued a career in media before building a profile as an entrepreneur and author in food and lifestyle.",
    cuisines: ["Celebrities in Food", "Healthy"],
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/BethennyFrankelVAOCApr09.jpg/330px-BethennyFrankelVAOCApr09.jpg",
  },
  {
    slug: "bobby-flay",
    name: "Bobby Flay",
    excerpt:
      "Bobby Flay is one of America’s most recognizable celebrity chefs, with a career spanning television, cookbooks, and restaurants known for bold Southwestern and grill-forward flavors.",
    cuisines: ["American", "BBQ", "Celebrities in Food", "Mexican"],
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Secretary_Kerry_Poses_for_a_Photo_With_Celebrity_Chef_Bobby_Flay_%2829237504634%29_%28cropped%29.jpg/330px-Secretary_Kerry_Poses_for_a_Photo_With_Celebrity_Chef_Bobby_Flay_%2829237504634%29_%28cropped%29.jpg",
  },
  {
    slug: "chrissy-teigen",
    name: "Chrissy Teigen",
    excerpt:
      "Chrissy Teigen is an American model, television personality, author, and culinary entrepreneur who has turned her love of home cooking into bestselling cookbooks and a wide media following.",
    cuisines: ["American", "Celebrities in Food", "Fusion"],
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Chrissy_Teigen_2019.png/330px-Chrissy_Teigen_2019.png",
  },
  {
    slug: "curtis-stone",
    name: "Curtis Stone",
    excerpt:
      "Curtis Stone is a world-renowned Australian chef, television personality, restaurateur, and author, known for approachable fine dining and a long-running presence on culinary television.",
    cuisines: ["American", "Fusion", "Healthy"],
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Curtis_Stone_2012.jpg/330px-Curtis_Stone_2012.jpg",
  },
  {
    slug: "david-chang",
    name: "David Chang",
    excerpt:
      "David Chang is a prominent American chef, restaurateur, and media personality renowned for his innovative take on Asian flavors and for founding the Momofuku restaurant group.",
    cuisines: ["Asian"],
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/David_Chang_David_Shankbone_2010_%283x4_cropped%29.jpg/330px-David_Chang_David_Shankbone_2010_%283x4_cropped%29.jpg",
  },
  {
    slug: "giada-de-laurentiis",
    name: "Giada De Laurentiis",
    excerpt:
      "Giada De Laurentiis is a celebrated celebrity chef, television personality, and bestselling author known for bright California-Italian cooking and a long association with Food Network.",
    cuisines: ["American", "Celebrities in Food", "Italian"],
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Giada_De_Laurentiis_2010.jpg/330px-Giada_De_Laurentiis_2010.jpg",
  },
  {
    slug: "gordon-ramsay",
    name: "Gordon Ramsay",
    excerpt:
      "Gordon Ramsay is a world-renowned chef, television personality, and entrepreneur known for culinary excellence, Michelin-starred restaurants, and an unmistakable presence on competitive cooking shows.",
    cuisines: ["Celebrities in Food", "Classical French", "Fusion", "Italian"],
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Gordon_Ramsay_%28cropped_2%29.jpg/330px-Gordon_Ramsay_%28cropped_2%29.jpg",
  },
  {
    slug: "guy-fieri",
    name: "Guy Fieri",
    excerpt:
      "Guy Fieri is a renowned American chef, television personality, and restaurateur, celebrated for his larger-than-life style and deep enthusiasm for diners, barbecue, and bold American flavors.",
    cuisines: ["American", "BBQ", "Celebrities in Food"],
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Guy_Fieri_June_2023.png/330px-Guy_Fieri_June_2023.png",
  },
  {
    slug: "gwyneth-paltrow",
    name: "Gwyneth Paltrow",
    excerpt:
      "Gwyneth Paltrow is a multifaceted American actress, author, and entrepreneur known for building a lifestyle and wellness brand that often intersects with food, home cooking, and entertaining.",
    cuisines: ["American", "Celebrities in Food", "Italian"],
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Gwyneth_Paltrow_-_Marty_Supreme.jpg/330px-Gwyneth_Paltrow_-_Marty_Supreme.jpg",
  },
  {
    slug: "ina-garten",
    name: "Ina Garten",
    excerpt:
      "Ina Garten is a celebrated American chef, author, and television personality, renowned for her elegant yet unfussy approach to entertaining and her long-running Barefoot Contessa series.",
    cuisines: ["American", "Healthy"],
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/MFF24_Ina_Garten_Grabowsky_TTL_3492_%2854135420705%29_%28cropped%29.jpg/330px-MFF24_Ina_Garten_Grabowsky_TTL_3492_%2854135420705%29_%28cropped%29.jpg",
  },
  {
    slug: "jamie-oliver",
    name: "Jamie Oliver",
    excerpt:
      "Jamie Oliver is an acclaimed British chef, restaurateur, author, and television personality renowned for campaigns for healthier school food and accessible Italian-inspired home cooking.",
    cuisines: ["Garden to Table", "Healthy", "Italian"],
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Jamie_Oliver_%28cropped%29.jpg/330px-Jamie_Oliver_%28cropped%29.jpg",
  },
  {
    slug: "jose-andres",
    name: "José Andrés",
    excerpt:
      "José Andrés is a highly regarded Spanish-American chef, restaurateur, and humanitarian known for his innovative Spanish and Latin cooking and global disaster-relief work through World Central Kitchen.",
    cuisines: ["Mexican"],
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Jose_Andres_Puerta_2012_Shankbone.JPG/330px-Jose_Andres_Puerta_2012_Shankbone.JPG",
  },
  {
    slug: "katie-lee",
    name: "Katie Lee",
    excerpt:
      "Katie Lee is a versatile chef, television personality, and author known for her focus on seasonal cooking, coastal flavors, and co-hosting Food Network’s The Kitchen.",
    cuisines: ["American", "Garden to Table", "Healthy"],
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Katie_Lee_Joel_May_17%2C_2008.jpg/330px-Katie_Lee_Joel_May_17%2C_2008.jpg",
  },
  {
    slug: "marcus-samuelsson",
    name: "Marcus Samuelsson",
    excerpt:
      "Growing up in Sweden, Marcus Samuelsson was exposed to a variety of culinary influences, which shaped his globally inspired approach and acclaimed restaurants in Harlem and beyond.",
    cuisines: ["American", "Asian", "Classical French"],
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Marcus_Samuelsson_2012_%28cropped%29.jpg/330px-Marcus_Samuelsson_2012_%28cropped%29.jpg",
  },
  {
    slug: "martha-stewart",
    name: "Martha Stewart",
    excerpt:
      "Martha Stewart is a globally recognized lifestyle expert, businesswoman, and television personality who has built an empire spanning publishing, entertaining, and refined home cooking.",
    cuisines: ["American", "Celebrities in Food", "Fusion", "Healthy"],
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Martha_Stewart_%2848926315347%29_%28cropped%29.jpg/330px-Martha_Stewart_%2848926315347%29_%28cropped%29.jpg",
  },
  {
    slug: "michael-voltaggio",
    name: "Michael Voltaggio",
    excerpt:
      "Michael Voltaggio is an acclaimed culinary innovator and television personality known for his creative modern American cooking and his win on Top Chef.",
    cuisines: ["American"],
    imageUrl:
      "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=440&h=560&fit=crop&q=80",
  },
  {
    slug: "nigella-lawson",
    name: "Nigella Lawson",
    excerpt:
      "Nigella Lawson is a celebrated British food writer, television personality, and chef, known for sensual, comforting recipes and an inviting approach to home cooking.",
    cuisines: ["Fusion", "Italian", "Writer/Blogger"],
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Nigella_Lawson_4_in_2020.jpg/330px-Nigella_Lawson_4_in_2020.jpg",
  },
  {
    slug: "nobuyuki-matsuhisa",
    name: "Nobuyuki Matsuhisa",
    excerpt:
      "Chef Nobuyuki Matsuhisa, widely known as Nobu, is a celebrated Japanese chef, restaurateur, and culinary innovator behind the global Nobu restaurant brand and a signature fusion of Japanese and Peruvian flavors.",
    cuisines: ["Asian", "Fusion"],
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Nobu_Matsuhisa_with_sushi.png/330px-Nobu_Matsuhisa_with_sushi.png",
  },
];

const bySlug = new Map(CHEFS.map((c) => [c.slug, c]));

export function getChefBySlug(slug: string): Chef | undefined {
  return bySlug.get(slug);
}

export function getAllChefSlugs(): string[] {
  return CHEFS.map((c) => c.slug);
}
