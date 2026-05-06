import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseOptionalHttpUrl } from "@/lib/magazines/httpUrl";
import { resolvePdfAndCover } from "@/lib/magazines/resolveUploads";
import { sessionUserIsAdmin } from "@/lib/requireAdmin";
import { uniqueMagazineSlug } from "@/lib/magazines/slug";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  if (!(await sessionUserIsAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const rows = await prisma.magazine.findMany({
    orderBy: { releaseDate: "desc" },
    select: {
      id: true,
      slug: true,
      displayTitle: true,
      releaseDate: true,
      releaseLabel: true,
      coverSrc: true,
      pdfSrc: true,
      purchaseUrl: true,
      subscribeUrl: true,
      flipbookUrl: true,
    },
  });

  return NextResponse.json({ magazines: rows });
}

export async function POST(req: NextRequest) {
  if (!(await sessionUserIsAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const formData = await req.formData();

  const displayTitle = String(formData.get("displayTitle") ?? "").trim();
  const releaseLabel = String(formData.get("releaseLabel") ?? "").trim();
  const blurb = String(formData.get("blurb") ?? "").trim();
  const releaseDateRaw = String(formData.get("releaseDate") ?? "").trim();
  const purchaseUrlRaw = String(formData.get("purchaseUrl") ?? "").trim();
  const pdfUrlRaw = String(formData.get("pdfUrl") ?? "").trim();
  const coverUrlRaw = String(formData.get("coverUrl") ?? "").trim();

  let flipbookUrl = "";
  try {
    const f = parseOptionalHttpUrl(String(formData.get("flipbookUrl") ?? ""));
    if (f) flipbookUrl = f;
  } catch {
    return NextResponse.json({ error: "Invalid digital edition URL" }, { status: 400 });
  }

  let subscribeUrl: string | null = null;
  const subscribeRaw = String(formData.get("subscribeUrl") ?? "").trim();
  if (subscribeRaw) {
    try {
      subscribeUrl = parseOptionalHttpUrl(subscribeRaw);
    } catch {
      return NextResponse.json({ error: "Invalid subscribe URL" }, { status: 400 });
    }
  }

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

  const hasPdfFile = pdf instanceof File && pdf.size > 0;
  const hasCoverFile = cover instanceof File && cover.size > 0;

  const hasPdf = Boolean(pdfUrlRaw || hasPdfFile);
  const hasFlip = flipbookUrl.length > 0;
  if (!hasPdf && !hasFlip) {
    return NextResponse.json(
      {
        error:
          "Provide a PDF file or hosted PDF URL, or paste a digital edition / FlipHTML5 URL. Cover image is still required.",
      },
      { status: 400 },
    );
  }
  if (!coverUrlRaw && !hasCoverFile) {
    return NextResponse.json(
      { error: "Provide a cover image file, or paste a hosted image URL (https)." },
      { status: 400 },
    );
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

  const assetId = randomUUID();
  let pdfSrc: string;
  let coverSrc: string;
  try {
    const resolved = await resolvePdfAndCover({
      assetId,
      pdfUrlRaw,
      coverUrlRaw,
      hasPdfFile,
      pdf: hasPdfFile && pdf instanceof File ? pdf : null,
      hasCoverFile,
      cover: hasCoverFile && cover instanceof File ? cover : null,
      requireBoth: true,
      allowEmptyPdf: hasFlip,
    });
    pdfSrc = resolved.pdfSrc;
    coverSrc = resolved.coverSrc;
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const slug = await uniqueMagazineSlug(displayTitle);

  const created = await prisma.magazine.create({
    data: {
      slug,
      displayTitle,
      releaseDate,
      releaseLabel,
      blurb,
      coverSrc,
      pdfSrc,
      flipbookUrl,
      purchaseUrl,
      subscribeUrl,
    },
  });

  return NextResponse.json({
    magazine: {
      id: created.id,
      slug: created.slug,
      displayTitle: created.displayTitle,
      releaseLabel: created.releaseLabel,
      coverSrc: created.coverSrc,
      pdfSrc: created.pdfSrc,
      purchaseUrl: created.purchaseUrl,
    },
  });
}
