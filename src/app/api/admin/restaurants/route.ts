import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sessionUserIsAdmin } from "@/lib/requireAdmin";
import { slugifySegment } from "@/lib/restaurantSlug";
import { toRestaurantDTO } from "@/lib/restaurantPublic";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await sessionUserIsAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [ranked, unranked, highlights] = await Promise.all([
    prisma.restaurant.findMany({
      where: { nationalRank: { not: null } },
      orderBy: { nationalRank: "asc" },
    }),
    prisma.restaurant.findMany({
      where: { nationalRank: null },
      orderBy: { name: "asc" },
    }),
    prisma.stateRestaurantHighlight.findMany({
      include: { restaurant: true },
      orderBy: [{ stateSlug: "asc" }, { position: "asc" }],
    }),
  ]);

  const restaurants = [...ranked, ...unranked];

  return NextResponse.json({
    restaurants: restaurants.map(toRestaurantDTO),
    highlights: highlights.map((h) => ({
      id: h.id,
      stateSlug: h.stateSlug,
      position: h.position,
      restaurantId: h.restaurantId,
      restaurant: toRestaurantDTO(h.restaurant),
    })),
  });
}

export async function POST(req: NextRequest) {
  if (!(await sessionUserIsAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body.name !== "string" || !body.name.trim()) {
    return NextResponse.json({ error: "Name required" }, { status: 400 });
  }

  const name = body.name.trim();
  const city = typeof body.city === "string" ? body.city.trim() : "";
  const county = typeof body.county === "string" ? body.county.trim() : "";
  const citySlugRaw = typeof body.citySlug === "string" ? body.citySlug.trim() : "";
  const countySlugRaw = typeof body.countySlug === "string" ? body.countySlug.trim() : "";
  const nameSlugRaw = typeof body.nameSlug === "string" ? body.nameSlug.trim() : "";

  const citySlug = citySlugRaw ? slugifySegment(citySlugRaw) : city ? slugifySegment(city) || "unknown" : "unknown";
  const countySlug = countySlugRaw ? slugifySegment(countySlugRaw) : county ? slugifySegment(county) || "unknown" : "unknown";
  const rankNum =
    typeof body.nationalRank === "number" && body.nationalRank > 0 ? body.nationalRank : null;
  const nameSlug =
    nameSlugRaw ? slugifySegment(nameSlugRaw) || "restaurant" : `${slugifySegment(name) || "restaurant"}${rankNum != null ? `-${rankNum}` : "-new"}`;

  const stateSlug = typeof body.stateSlug === "string" ? body.stateSlug.trim() : "";

  try {
    const created = await prisma.restaurant.create({
      data: {
        name,
        address: typeof body.address === "string" ? body.address : "",
        phone: typeof body.phone === "string" ? body.phone : "",
        website: typeof body.website === "string" ? body.website : "",
        openTableUrl: typeof body.openTableUrl === "string" ? body.openTableUrl : "",
        cuisine: typeof body.cuisine === "string" ? body.cuisine : "",
        city,
        county,
        citySlug,
        countySlug,
        nameSlug,
        owner: typeof body.owner === "string" ? body.owner : "",
        headChef: typeof body.headChef === "string" ? body.headChef : "",
        awards: typeof body.awards === "string" ? body.awards : "—",
        thumbnailUrl: typeof body.thumbnailUrl === "string" ? body.thumbnailUrl : "",
        stateSlug,
        country: typeof body.country === "string" ? body.country : "United States",
        nationalRank: rankNum,
      },
    });
    return NextResponse.json({ restaurant: toRestaurantDTO(created) });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Could not create — check slug uniqueness for this state / county / city." },
      { status: 400 },
    );
  }
}
