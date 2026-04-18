import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolvePdfAndCover } from "@/lib/magazines/resolveUploads";
import { sessionUserIsAdmin } from "@/lib/requireAdmin";
import { assertSlugAvailable, slugifyTitle } from "@/lib/magazines/slug";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function parseHttpsUrl(raw: string): string {
  const u = new URL(raw.trim());
  if (u.protocol !== "http:" && u.protocol !== "https:") {
    throw new Error("Must be http(s)");
  }
  return u.href;
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await sessionUserIsAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const magazine = await prisma.magazine.findUnique({ where: { id: params.id } });
  if (!magazine) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ magazine });
}

/** Full update: multipart form — same fields as POST create, plus optional slug */
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await sessionUserIsAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const existing = await prisma.magazine.findUnique({ where: { id: params.id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const formData = await req.formData();

  const displayTitle = String(formData.get("displayTitle") ?? "").trim();
  const releaseLabel = String(formData.get("releaseLabel") ?? "").trim();
  const blurb = String(formData.get("blurb") ?? "").trim();
  const releaseDateRaw = String(formData.get("releaseDate") ?? "").trim();
  const purchaseUrlRaw = String(formData.get("purchaseUrl") ?? "").trim();
  const slugRaw = String(formData.get("slug") ?? "").trim();
  const pdfUrlRaw = String(formData.get("pdfUrl") ?? "").trim();
  const coverUrlRaw = String(formData.get("coverUrl") ?? "").trim();

  const pdf = formData.get("pdf");
  const cover = formData.get("cover");

  if (!displayTitle) {
    return NextResponse.json({ error: "Display title is required" }, { status: 400 });
  }
  if (!releaseLabel) {
    return NextResponse.json({ error: "Release label is required" }, { status: 400 });
  }
  if (!blurb) {
    return NextResponse.json({ error: "Description / blurb is required" }, { status: 400 });
  }
  if (!releaseDateRaw) {
    return NextResponse.json({ error: "Release date is required" }, { status: 400 });
  }

  const releaseDate = new Date(releaseDateRaw);
  if (Number.isNaN(releaseDate.getTime())) {
    return NextResponse.json({ error: "Invalid release date" }, { status: 400 });
  }

  let slug = existing.slug;
  if (slugRaw) {
    const normalized = slugifyTitle(slugRaw);
    if (!normalized) {
      return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
    }
    try {
      await assertSlugAvailable(normalized, existing.id);
    } catch (e) {
      return NextResponse.json({ error: e instanceof Error ? e.message : "Slug conflict" }, { status: 400 });
    }
    slug = normalized;
  }

  let purchaseUrl: string | null = null;
  if (purchaseUrlRaw) {
    try {
      const u = new URL(purchaseUrlRaw);
      if (u.protocol !== "http:" && u.protocol !== "https:") {
        return NextResponse.json({ error: "Purchase link must be http(s)" }, { status: 400 });
      }
      purchaseUrl = u.href;
    } catch {
      return NextResponse.json({ error: "Invalid purchase link URL" }, { status: 400 });
    }
  }

  const hasPdfFile = pdf instanceof File && pdf.size > 0;
  const hasCoverFile = cover instanceof File && cover.size > 0;

  let pdfSrc: string;
  let coverSrc: string;
  try {
    const resolved = await resolvePdfAndCover({
      assetId: existing.id,
      pdfUrlRaw,
      coverUrlRaw,
      hasPdfFile,
      pdf: hasPdfFile && pdf instanceof File ? pdf : null,
      hasCoverFile,
      cover: hasCoverFile && cover instanceof File ? cover : null,
      existingPdfSrc: existing.pdfSrc,
      existingCoverSrc: existing.coverSrc,
      requireBoth: false,
    });
    pdfSrc = resolved.pdfSrc;
    coverSrc = resolved.coverSrc;
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const updated = await prisma.magazine.update({
    where: { id: params.id },
    data: {
      slug,
      displayTitle,
      releaseDate,
      releaseLabel,
      blurb,
      coverSrc,
      pdfSrc,
      purchaseUrl,
    },
  });

  return NextResponse.json({ magazine: updated });
}

/** Quick JSON patch: pdfSrc / coverSrc only */
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
