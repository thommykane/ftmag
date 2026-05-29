import { NextRequest, NextResponse } from "next/server";
import { toAdBannerDTO } from "@/lib/banners/queries";
import { resolveBannerImage } from "@/lib/banners/resolveBannerImage";
import { prisma } from "@/lib/prisma";
import { sessionUserIsAdmin } from "@/lib/requireAdmin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function parseHref(raw: string): string {
  const t = raw.trim();
  if (!t) throw new Error("Destination URL is required.");
  const u = new URL(t);
  if (u.protocol !== "https:" && u.protocol !== "http:") {
    throw new Error("Destination URL must be http or https.");
  }
  return u.href;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await sessionUserIsAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const formData = await req.formData();
  const hrefRaw = formData.get("href");
  const labelRaw = formData.get("label");
  const file = formData.get("image");

  const data: { href?: string; label?: string; imageSrc?: string } = {};

  if (typeof hrefRaw === "string" && hrefRaw.trim()) {
    try {
      data.href = parseHref(hrefRaw);
    } catch (e) {
      return NextResponse.json({ error: e instanceof Error ? e.message : "Invalid URL" }, { status: 400 });
    }
  }

  if (typeof labelRaw === "string") {
    data.label = labelRaw.trim();
  }

  if (file instanceof File && file.size > 0) {
    try {
      data.imageSrc = await resolveBannerImage({ file });
    } catch (e) {
      return NextResponse.json({ error: e instanceof Error ? e.message : "Upload failed" }, { status: 400 });
    }
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No fields to update." }, { status: 400 });
  }

  try {
    const banner = await prisma.adBanner.update({
      where: { id },
      data,
    });
    return NextResponse.json({ banner: toAdBannerDTO(banner) });
  } catch {
    return NextResponse.json({ error: "Banner not found." }, { status: 404 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await sessionUserIsAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  await prisma.adBanner.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
