import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { sessionUserIsAdmin } from "@/lib/requireAdmin";

export const dynamic = "force-dynamic";

/** Body: { ids: string[] } — full new order for rotator slides. */
export async function PATCH(req: NextRequest) {
  if (!(await sessionUserIsAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const ids = Array.isArray(body?.ids) ? body.ids.filter((x: unknown) => typeof x === "string") : [];
  if (ids.length === 0) {
    return NextResponse.json({ error: "ids[] required" }, { status: 400 });
  }

  const serverRows = await prisma.adBanner.findMany({
    select: { id: true },
    orderBy: { sortOrder: "asc" },
  });
  const serverIds = serverRows.map((r) => r.id);
  if (serverIds.length !== ids.length) {
    return NextResponse.json({ error: "Banner list is out of sync. Refresh and try again." }, { status: 409 });
  }

  const a = [...ids].sort();
  const b = [...serverIds].sort();
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return NextResponse.json({ error: "Banner list is out of sync. Refresh and try again." }, { status: 409 });
    }
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.adBanner.updateMany({ data: { sortOrder: 10000 } });
      const idSql = Prisma.join(ids.map((id: string) => Prisma.sql`${id}`));
      await tx.$executeRaw`
        UPDATE "AdBanner" AS b
        SET "sortOrder" = u.ord::int - 1
        FROM (
          SELECT x.id, x.ord
          FROM unnest(ARRAY[${idSql}]::text[]) WITH ORDINALITY AS x(id, ord)
        ) AS u
        WHERE b.id = u.id
      `;
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Reorder failed" }, { status: 400 });
  }
}
