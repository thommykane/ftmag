import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sessionUserIsAdmin } from "@/lib/requireAdmin";

export const dynamic = "force-dynamic";

/** Body: { ids: string[] } — full new order for nationally ranked entries (ranks 1..n). */
export async function PATCH(req: NextRequest) {
  if (!(await sessionUserIsAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const ids = Array.isArray(body?.ids) ? body.ids.filter((x: unknown) => typeof x === "string") : [];
  if (ids.length === 0) {
    return NextResponse.json({ error: "ids[] required" }, { status: 400 });
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.restaurant.updateMany({
        where: { id: { in: ids } },
        data: { nationalRank: null },
      });
      for (let i = 0; i < ids.length; i++) {
        await tx.restaurant.update({
          where: { id: ids[i] },
          data: { nationalRank: i + 1 },
        });
      }
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Reorder failed" }, { status: 400 });
  }
}
