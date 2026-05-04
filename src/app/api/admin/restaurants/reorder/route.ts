import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
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

  const serverRanked = await prisma.restaurant.findMany({
    where: { nationalRank: { not: null } },
    select: { id: true },
    orderBy: { nationalRank: "asc" },
  });
  const serverIds = serverRanked.map((r) => r.id);
  if (serverIds.length !== ids.length) {
    return NextResponse.json(
      {
        error: "Ranked list is out of sync with the server. Refresh the page and try again.",
      },
      { status: 409 },
    );
  }
  const a = [...ids].sort();
  const b = [...serverIds].sort();
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return NextResponse.json(
        {
          error: "Ranked list is out of sync with the server. Refresh the page and try again.",
        },
        { status: 409 },
      );
    }
  }

  try {
    /**
     * One row per rank update used to run N sequential UPDATEs (~1000 round-trips),
     * which could take many seconds and hit serverless timeouts → client showed
     * “Reorder failed” and reverted. Clear all ranks, then assign new ranks in
     * a single SQL UPDATE joined to unnest(ids WITH ORDINALITY).
     */
    await prisma.$transaction(async (tx) => {
      await tx.restaurant.updateMany({
        where: { nationalRank: { not: null } },
        data: { nationalRank: null },
      });

      const idSql = Prisma.join(ids.map((id: string) => Prisma.sql`${id}`));
      await tx.$executeRaw`
        UPDATE "Restaurant" AS r
        SET "nationalRank" = u.ord::int
        FROM (
          SELECT x.id, x.ord
          FROM unnest(ARRAY[${idSql}]::text[]) WITH ORDINALITY AS x(id, ord)
        ) AS u
        WHERE r.id = u.id
      `;
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Reorder failed" }, { status: 400 });
  }
}
