import type { HomePageConfig } from "@prisma/client";
import { resolveStateDestination } from "@/data/states/getStateDestination";
import { US_STATES_ALPHABETICAL } from "@/data/states/usStates";
import { getAllChefsOrdered, type ChefDTO } from "@/lib/chefs/queries";
import { pickBySeed } from "@/lib/homepage/seededPick";
import { prisma } from "@/lib/prisma";
import { restaurantDetailHref, toRestaurantDTO, type RestaurantDTO } from "@/lib/restaurantPublic";
import { getNationalRestaurants } from "@/lib/restaurants-queries";
import { excerptWords, stripHtml } from "@/lib/wordpress/parse";
import { getMagazineIssuesSorted } from "@/lib/magazines/repo";
import { fetchLatestPost, fetchPostBySlugFromCms } from "@/lib/wordpress/fetchLatestPost";
import type { SeasonalFeedPost } from "@/lib/wordpress/mapPost";

export type HomePageConfigDTO = {
  restaurantEnabled: boolean;
  restaurantTitle: string;
  restaurantSubtitle: string;
  restaurantMode: string;
  restaurantId: string | null;
  chefEnabled: boolean;
  chefTitle: string;
  chefMode: string;
  chefId: string | null;
  destinationEnabled: boolean;
  destinationTitle: string;
  destinationMode: string;
  destinationStateSlug: string;
  articleEnabled: boolean;
  articleTitle: string;
  articleMode: string;
  articleSlug: string | null;
  recipeEnabled: boolean;
  recipeTitle: string;
  recipeBlurb: string;
  recipeHref: string;
  recipeImageUrl: string;
};

export type HomeRestaurantSpotlight = {
  name: string;
  city: string;
  stateSlug: string;
  cuisine: string;
  awards: string;
  headChef: string;
  imageUrl: string;
  href: string;
  rank: number | null;
};

export type HomeChefSpotlight = {
  name: string;
  description: string;
  cuisines: string[];
  imageUrl: string;
  href: string;
};

export type HomeDestinationSpotlight = {
  name: string;
  tagline: string;
  synopsis: string;
  imageUrl: string;
  href: string;
};

export type HomeArticleSpotlight = {
  title: string;
  excerpt: string;
  imageUrl: string | null;
  href: string;
  categoryLabel: string;
};

export type HomeRecipeSpotlight = {
  title: string;
  blurb: string;
  imageUrl: string | null;
  href: string;
  isPlaceholder: boolean;
};

export type HomePageContent = {
  restaurant: HomeRestaurantSpotlight | null;
  chef: HomeChefSpotlight | null;
  destination: HomeDestinationSpotlight | null;
  article: HomeArticleSpotlight | null;
  recipe: HomeRecipeSpotlight | null;
  config: HomePageConfigDTO;
};

const RESTAURANT_IMAGE_FALLBACK =
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80";

const DEFAULT_CONFIG: HomePageConfigDTO = {
  restaurantEnabled: true,
  restaurantTitle: "Top Restaurant of the Summer",
  restaurantSubtitle: "2026",
  restaurantMode: "auto",
  restaurantId: null,
  chefEnabled: true,
  chefTitle: "Chef of the Month",
  chefMode: "auto",
  chefId: null,
  destinationEnabled: true,
  destinationTitle: "Top Summer Vacation Spot",
  destinationMode: "state",
  destinationStateSlug: "california",
  articleEnabled: true,
  articleTitle: "Most Recent Article",
  articleMode: "latest",
  articleSlug: null,
  recipeEnabled: true,
  recipeTitle: "Recipe of the Week",
  recipeBlurb: "",
  recipeHref: "",
  recipeImageUrl: "",
};

function toConfigDto(row: HomePageConfig | null): HomePageConfigDTO {
  if (!row) return DEFAULT_CONFIG;
  return {
    restaurantEnabled: row.restaurantEnabled,
    restaurantTitle: row.restaurantTitle,
    restaurantSubtitle: row.restaurantSubtitle,
    restaurantMode: row.restaurantMode,
    restaurantId: row.restaurantId,
    chefEnabled: row.chefEnabled,
    chefTitle: row.chefTitle,
    chefMode: row.chefMode,
    chefId: row.chefId,
    destinationEnabled: row.destinationEnabled,
    destinationTitle: row.destinationTitle,
    destinationMode: row.destinationMode,
    destinationStateSlug: row.destinationStateSlug,
    articleEnabled: row.articleEnabled,
    articleTitle: row.articleTitle,
    articleMode: row.articleMode,
    articleSlug: row.articleSlug,
    recipeEnabled: row.recipeEnabled,
    recipeTitle: row.recipeTitle,
    recipeBlurb: row.recipeBlurb,
    recipeHref: row.recipeHref,
    recipeImageUrl: row.recipeImageUrl,
  };
}

export async function getHomePageConfig(): Promise<HomePageConfigDTO> {
  try {
    const row = await prisma.homePageConfig.findUnique({ where: { id: "default" } });
    return toConfigDto(row);
  } catch {
    return DEFAULT_CONFIG;
  }
}

export async function ensureHomePageConfig(): Promise<HomePageConfigDTO> {
  try {
    const row = await prisma.homePageConfig.upsert({
      where: { id: "default" },
      create: { id: "default", ...DEFAULT_CONFIG },
      update: {},
    });
    return toConfigDto(row);
  } catch {
    return DEFAULT_CONFIG;
  }
}

function restaurantImage(r: RestaurantDTO): string {
  const t = r.thumbnailUrl?.trim();
  return t || RESTAURANT_IMAGE_FALLBACK;
}

function restaurantSpotlight(r: RestaurantDTO): HomeRestaurantSpotlight {
  return {
    name: r.name,
    city: r.city,
    stateSlug: r.stateSlug,
    cuisine: r.cuisine,
    awards: r.awards,
    headChef: r.headChef,
    imageUrl: restaurantImage(r),
    href: restaurantDetailHref(r),
    rank: r.nationalRank,
  };
}

function chefSpotlight(c: ChefDTO): HomeChefSpotlight {
  return {
    name: c.name,
    description: excerptWords(stripHtml(c.description), 42),
    cuisines: c.cuisines,
    imageUrl: c.imageUrl?.trim() || RESTAURANT_IMAGE_FALLBACK,
    href: `/top-chefs/${c.slug}`,
  };
}

function articleSpotlight(p: SeasonalFeedPost): HomeArticleSpotlight {
  return {
    title: p.title,
    excerpt: p.excerpt,
    imageUrl: p.featuredImageUrl || p.thumbUrl,
    href: p.href,
    categoryLabel: p.categoryLabel,
  };
}

function monthSeed(): string {
  const now = new Date();
  return `chef-${now.getUTCFullYear()}-${now.getUTCMonth() + 1}`;
}

async function resolveRestaurant(
  config: HomePageConfigDTO,
  national: RestaurantDTO[],
): Promise<HomeRestaurantSpotlight | null> {
  if (!config.restaurantEnabled || config.restaurantMode === "off") return null;
  if (config.restaurantMode === "manual" && config.restaurantId) {
    const fromList = national.find((r) => r.id === config.restaurantId);
    if (fromList) return restaurantSpotlight(fromList);
    try {
      const row = await prisma.restaurant.findUnique({ where: { id: config.restaurantId } });
      if (row) return restaurantSpotlight(toRestaurantDTO(row));
    } catch {
      /* ignore */
    }
    return null;
  }
  const pool = national.filter((r) => r.nationalRank != null);
  const picked = pickBySeed(pool, `restaurant-summer-${config.restaurantSubtitle || "2026"}`);
  return picked ? restaurantSpotlight(picked) : null;
}

async function resolveChef(config: HomePageConfigDTO, chefs: ChefDTO[]): Promise<HomeChefSpotlight | null> {
  if (!config.chefEnabled || config.chefMode === "off") return null;
  if (config.chefMode === "manual" && config.chefId) {
    const c = chefs.find((x) => x.id === config.chefId);
    if (c) return chefSpotlight(c);
    const row = await prisma.chef.findUnique({ where: { id: config.chefId } });
    if (row) {
      return chefSpotlight({
        id: row.id,
        slug: row.slug,
        name: row.name,
        description: row.description,
        cuisines: Array.isArray(row.cuisines) ? (row.cuisines as string[]) : [],
        imageUrl: row.imageUrl,
      });
    }
  }
  const picked = pickBySeed(chefs, monthSeed());
  return picked ? chefSpotlight(picked) : null;
}

async function resolveDestination(config: HomePageConfigDTO): Promise<HomeDestinationSpotlight | null> {
  if (!config.destinationEnabled || config.destinationMode === "off") return null;

  let slug = config.destinationStateSlug || "california";
  if (config.destinationMode === "random") {
    const slugs = US_STATES_ALPHABETICAL.map((s) => s.slug);
    slug = pickBySeed(slugs, monthSeed()) ?? "california";
  }

  const d = await resolveStateDestination(slug);
  if (!d) return null;

  const synopsis = excerptWords(stripHtml(d.description || d.tagline || d.whyVisit), 48);
  const imageUrl = d.heroImage || d.gallery[0] || RESTAURANT_IMAGE_FALLBACK;

  return {
    name: d.name,
    tagline: d.tagline,
    synopsis,
    imageUrl,
    href: `/visit/${d.slug}`,
  };
}

async function resolveArticle(config: HomePageConfigDTO): Promise<HomeArticleSpotlight | null> {
  if (!config.articleEnabled || config.articleMode === "off") return null;
  let post: SeasonalFeedPost | null = null;
  if (config.articleMode === "manual" && config.articleSlug?.trim()) {
    post = await fetchPostBySlugFromCms(config.articleSlug.trim());
  } else {
    post = await fetchLatestPost();
  }
  return post ? articleSpotlight(post) : null;
}

async function resolveRecipe(config: HomePageConfigDTO): Promise<HomeRecipeSpotlight | null> {
  if (!config.recipeEnabled) return null;
  const hasContent =
    config.recipeBlurb.trim() || config.recipeHref.trim() || config.recipeImageUrl.trim();
  if (!hasContent) {
    let imageUrl: string | null = null;
    try {
      const issues = await getMagazineIssuesSorted();
      imageUrl = issues[0]?.coverSrc?.trim() || null;
    } catch {
      /* ignore */
    }
    return {
      title: config.recipeTitle,
      blurb: "",
      imageUrl,
      href: "/magazines",
      isPlaceholder: true,
    };
  }
  return {
    title: config.recipeTitle,
    blurb: config.recipeBlurb,
    imageUrl: config.recipeImageUrl.trim() || null,
    href: config.recipeHref.trim(),
    isPlaceholder: false,
  };
}

export async function getHomePageContent(): Promise<HomePageContent> {
  const config = await ensureHomePageConfig();

  const [national, chefs] = await Promise.all([getNationalRestaurants(), getAllChefsOrdered()]);

  const [restaurant, chef, destination, article] = await Promise.all([
    resolveRestaurant(config, national),
    resolveChef(config, chefs),
    resolveDestination(config),
    resolveArticle(config),
  ]);

  const recipe = await resolveRecipe(config);

  return { restaurant, chef, destination, article, recipe, config };
}
