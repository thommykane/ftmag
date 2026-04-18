import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sessionUserIsAdmin } from "@/lib/requireAdmin";
import { toRestaurantDTO } from "@/lib/restaurantPublic";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await sessionUserIsAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const data: Record<string, unknown> = {};
  const str = (k: string) => (typeof body[k] === "string" ? body[k] : undefined);
  const num = (k: string) => (typeof body[k] === "number" ? body[k] : undefined);

  if (str("name") !== undefined) data.name = str("name")!.trim();
  if (str("address") !== undefined) data.address = str("address");
  if (str("email") !== undefined) data.email = str("email");
  if (str("phone") !== undefined) data.phone = str("phone");
  if (str("website") !== undefined) data.website = str("website");
  if (str("openTableUrl") !== undefined) data.openTableUrl = str("openTableUrl");
  if (str("cuisine") !== undefined) data.cuisine = str("cuisine");
  if (str("ownerChef") !== undefined) data.ownerChef = str("ownerChef");
  if (str("awards") !== undefined) data.awards = str("awards");
  if (str("thumbnailUrl") !== undefined) data.thumbnailUrl = str("thumbnailUrl");
  if (str("stateSlug") !== undefined) data.stateSlug = str("stateSlug");
  if (str("country") !== undefined) data.country = str("country");
  if (body.nationalRank === null) data.nationalRank = null;
  else if (num("nationalRank") !== undefined && (num("nationalRank") as number) > 0) {
    data.nationalRank = num("nationalRank");
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No fields" }, { status: 400 });
  }

  try {
    const updated = await prisma.restaurant.update({
      where: { id },
      data: data as object,
    });
    return NextResponse.json({ restaurant: toRestaurantDTO(updated) });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await sessionUserIsAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  await prisma.restaurant.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
