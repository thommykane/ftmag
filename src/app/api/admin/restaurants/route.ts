import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sessionUserIsAdmin } from "@/lib/requireAdmin";
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

  const created = await prisma.restaurant.create({
    data: {
      name: body.name.trim(),
      address: typeof body.address === "string" ? body.address : "",
      email: typeof body.email === "string" ? body.email : "",
      phone: typeof body.phone === "string" ? body.phone : "",
      website: typeof body.website === "string" ? body.website : "",
      openTableUrl: typeof body.openTableUrl === "string" ? body.openTableUrl : "",
      cuisine: typeof body.cuisine === "string" ? body.cuisine : "",
      ownerChef: typeof body.ownerChef === "string" ? body.ownerChef : "",
      awards: typeof body.awards === "string" ? body.awards : "—",
      thumbnailUrl: typeof body.thumbnailUrl === "string" ? body.thumbnailUrl : "",
      stateSlug: typeof body.stateSlug === "string" ? body.stateSlug : "",
      country: typeof body.country === "string" ? body.country : "United States",
      nationalRank:
        typeof body.nationalRank === "number" && body.nationalRank > 0 ? body.nationalRank : null,
    },
  });

  return NextResponse.json({ restaurant: toRestaurantDTO(created) });
}
