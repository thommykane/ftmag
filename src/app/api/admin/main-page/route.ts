import { NextRequest, NextResponse } from "next/server";
import { getAllChefsOrdered } from "@/lib/chefs/queries";
import { ensureHomePageConfig, getHomePageConfig, type HomePageConfigDTO } from "@/lib/homepage/getHomePageContent";
import { prisma } from "@/lib/prisma";
import { sessionUserIsAdmin } from "@/lib/requireAdmin";
import { US_STATES_ALPHABETICAL } from "@/data/states/usStates";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await sessionUserIsAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [config, chefs, restaurants, states] = await Promise.all([
    ensureHomePageConfig(),
    getAllChefsOrdered(),
    prisma.restaurant
      .findMany({
        where: { nationalRank: { not: null } },
        orderBy: { nationalRank: "asc" },
        take: 200,
        select: { id: true, name: true, nationalRank: true, city: true, stateSlug: true },
      })
      .catch(() => []),
    Promise.resolve(US_STATES_ALPHABETICAL.map((s) => ({ slug: s.slug, name: s.name }))),
  ]);

  return NextResponse.json({ config, chefs, restaurants, states });
}

export async function PATCH(req: NextRequest) {
  if (!(await sessionUserIsAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const data: Partial<HomePageConfigDTO> = {};
  const bool = (k: keyof HomePageConfigDTO) =>
    typeof body[k] === "boolean" ? (body[k] as boolean) : undefined;
  const str = (k: keyof HomePageConfigDTO) =>
    typeof body[k] === "string" ? (body[k] as string) : undefined;

  const rb = bool("restaurantEnabled");
  if (rb !== undefined) data.restaurantEnabled = rb;
  const rt = str("restaurantTitle");
  if (rt !== undefined) data.restaurantTitle = rt.trim();
  const rs = str("restaurantSubtitle");
  if (rs !== undefined) data.restaurantSubtitle = rs.trim();
  const rm = str("restaurantMode");
  if (rm !== undefined) data.restaurantMode = rm;
  if (body.restaurantId === null) data.restaurantId = null;
  else if (typeof body.restaurantId === "string") data.restaurantId = body.restaurantId || null;

  const cb = bool("chefEnabled");
  if (cb !== undefined) data.chefEnabled = cb;
  const ct = str("chefTitle");
  if (ct !== undefined) data.chefTitle = ct.trim();
  const cm = str("chefMode");
  if (cm !== undefined) data.chefMode = cm;
  if (body.chefId === null) data.chefId = null;
  else if (typeof body.chefId === "string") data.chefId = body.chefId || null;

  const db = bool("destinationEnabled");
  if (db !== undefined) data.destinationEnabled = db;
  const dt = str("destinationTitle");
  if (dt !== undefined) data.destinationTitle = dt.trim();
  const dm = str("destinationMode");
  if (dm !== undefined) data.destinationMode = dm;
  const ds = str("destinationStateSlug");
  if (ds !== undefined) data.destinationStateSlug = ds.trim();

  const ab = bool("articleEnabled");
  if (ab !== undefined) data.articleEnabled = ab;
  const at = str("articleTitle");
  if (at !== undefined) data.articleTitle = at.trim();
  const am = str("articleMode");
  if (am !== undefined) data.articleMode = am;
  if (body.articleSlug === null) data.articleSlug = null;
  else if (typeof body.articleSlug === "string") data.articleSlug = body.articleSlug.trim() || null;

  const reb = bool("recipeEnabled");
  if (reb !== undefined) data.recipeEnabled = reb;
  const ret = str("recipeTitle");
  if (ret !== undefined) data.recipeTitle = ret.trim();
  const reb2 = str("recipeBlurb");
  if (reb2 !== undefined) data.recipeBlurb = reb2;
  const reh = str("recipeHref");
  if (reh !== undefined) data.recipeHref = reh.trim();
  const rei = str("recipeImageUrl");
  if (rei !== undefined) data.recipeImageUrl = rei.trim();

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No fields" }, { status: 400 });
  }

  const updated = await prisma.homePageConfig.upsert({
    where: { id: "default" },
    create: { id: "default", ...(await getHomePageConfig()), ...data },
    update: data,
  });

  return NextResponse.json({ config: updated });
}
