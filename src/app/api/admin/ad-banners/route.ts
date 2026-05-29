import { NextRequest, NextResponse } from "next/server";
import { getNextBannerSortOrder, toAdBannerDTO } from "@/lib/banners/queries";
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

export async function GET() {
  if (!(await sessionUserIsAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const banners = await prisma.adBanner.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ banners: banners.map(toAdBannerDTO) });
}

export async function POST(req: NextRequest) {
  if (!(await sessionUserIsAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const formData = await req.formData();
  const hrefRaw = String(formData.get("href") ?? "");
  const label = String(formData.get("label") ?? "").trim();
  const file = formData.get("image");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Banner image file is required." }, { status: 400 });
  }

  let href: string;
  try {
    href = parseHref(hrefRaw);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Invalid URL" }, { status: 400 });
  }

  let imageSrc: string;
  try {
    imageSrc = await resolveBannerImage({ file });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Upload failed" }, { status: 400 });
  }

  const sortOrder = await getNextBannerSortOrder();
  const banner = await prisma.adBanner.create({
    data: { imageSrc, href, label, sortOrder },
  });

  return NextResponse.json({ banner: toAdBannerDTO(banner) });
}
