import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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

  if (!pdfUrlRaw && !hasPdfFile) {
    return NextResponse.json(
      {
        error:
          "Provide a PDF file, or paste a hosted PDF URL (https). Repo PDFs are not deployed to Vercel unless uploaded to Blob or linked.",
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
      purchaseUrl,
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
