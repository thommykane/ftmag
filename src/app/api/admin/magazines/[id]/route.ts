import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sessionUserIsAdmin } from "@/lib/requireAdmin";

export const dynamic = "force-dynamic";

function parseHttpsUrl(raw: string): string {
  const u = new URL(raw.trim());
  if (u.protocol !== "http:" && u.protocol !== "https:") {
    throw new Error("Must be http(s)");
  }
  return u.href;
}

/** PATCH body: { pdfSrc?: string, coverSrc?: string } — fix Vercel when DB still points at missing /public files */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await sessionUserIsAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await req.json().catch(() => null)) as { pdfSrc?: string; coverSrc?: string } | null;
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const data: { pdfSrc?: string; coverSrc?: string } = {};
  try {
    if (typeof body.pdfSrc === "string" && body.pdfSrc.trim()) {
      data.pdfSrc = parseHttpsUrl(body.pdfSrc);
    }
    if (typeof body.coverSrc === "string" && body.coverSrc.trim()) {
      data.coverSrc = parseHttpsUrl(body.coverSrc);
    }
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Invalid URL" },
      { status: 400 },
    );
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Provide pdfSrc and/or coverSrc (https URLs)" }, { status: 400 });
  }

  try {
    const updated = await prisma.magazine.update({
      where: { id: params.id },
      data,
    });
    return NextResponse.json({ magazine: updated });
  } catch {
    return NextResponse.json({ error: "Magazine not found" }, { status: 404 });
  }
}
