import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sessionUserIsAdmin } from "@/lib/requireAdmin";

export const dynamic = "force-dynamic";

/**
 * Body: { stateSlug: string, slots: { position: number, restaurantId: string | null }[] }
 * Positions 1–8. Null restaurantId clears that slot.
 */
export async function PUT(req: NextRequest) {
  if (!(await sessionUserIsAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const stateSlug = typeof body?.stateSlug === "string" ? body.stateSlug.trim().toLowerCase() : "";
  const slots = Array.isArray(body?.slots) ? body.slots : [];
  if (!stateSlug) {
    return NextResponse.json({ error: "stateSlug required" }, { status: 400 });
  }

  const normalized: { position: number; restaurantId: string | null }[] = [];
  for (const s of slots) {
    if (typeof s?.position !== "number" || s.position < 1 || s.position > 8) continue;
    const rid = typeof s.restaurantId === "string" && s.restaurantId ? s.restaurantId : null;
    normalized.push({ position: s.position, restaurantId: rid });
  }
  normalized.sort((a, b) => a.position - b.position);
  const seenRestaurant = new Set<string>();
  const toCreate: { position: number; restaurantId: string }[] = [];
  for (const row of normalized) {
    if (!row.restaurantId) continue;
    if (seenRestaurant.has(row.restaurantId)) continue;
    seenRestaurant.add(row.restaurantId);
    toCreate.push({ position: row.position, restaurantId: row.restaurantId });
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.stateRestaurantHighlight.deleteMany({ where: { stateSlug } });
      for (const row of toCreate) {
        await tx.stateRestaurantHighlight.create({
          data: { stateSlug, position: row.position, restaurantId: row.restaurantId },
        });
      }
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Save failed" }, { status: 400 });
  }
}
