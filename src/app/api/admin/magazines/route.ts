import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { prisma } from "@/lib/prisma";
import { magazineCoverUrl, magazinePdfUrl, MAGAZINES_COVER_DIR, MAGAZINES_PUBLIC_DIR } from "@/lib/magazines/paths";
import { sessionUserIsAdmin } from "@/lib/requireAdmin";
import { uniqueMagazineSlug } from "@/lib/magazines/slug";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_PDF_BYTES = 600 * 1024 * 1024;
const MAX_COVER_BYTES = 25 * 1024 * 1024;

const useBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

function extForImage(file: File): string {
  const t = file.type.toLowerCase();
  if (t === "image/jpeg" || t === "image/jpg") return ".jpg";
  if (t === "image/png") return ".png";
  if (t === "image/webp") return ".webp";
  if (t === "image/gif") return ".gif";
  const n = file.name.toLowerCase();
  if (n.endsWith(".png")) return ".png";
  if (n.endsWith(".webp")) return ".webp";
  if (n.endsWith(".gif")) return ".gif";
  return ".jpg";
}

function parseHttpsUrl(raw: string, label: string): string {
  const u = new URL(raw.trim());
  if (u.protocol !== "https:" && u.protocol !== "http:") {
    throw new Error(`${label} must be http(s)`);
  }
  return u.href;
}

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

  const onVercel = Boolean(process.env.VERCEL);
  if (onVercel && !useBlob && (hasPdfFile || hasCoverFile)) {
    return NextResponse.json(
      {
        error:
          "On Vercel, file uploads need Vercel Blob: add BLOB_READ_WRITE_TOKEN from Storage → Blob, or paste hosted https URLs only (no local file picks).",
      },
      { status: 400 },
    );
  }

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

  if (hasPdfFile && pdf instanceof File) {
    if (pdf.type !== "application/pdf" && !pdf.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json({ error: "Upload must be a PDF" }, { status: 400 });
    }
    if (pdf.size > MAX_PDF_BYTES) {
      return NextResponse.json({ error: "PDF is too large (max 600 MB)" }, { status: 400 });
    }
  }

  if (hasCoverFile && cover instanceof File) {
    if (!cover.type.startsWith("image/")) {
      return NextResponse.json({ error: "Cover must be an image" }, { status: 400 });
    }
    if (cover.size > MAX_COVER_BYTES) {
      return NextResponse.json({ error: "Cover image is too large (max 25 MB)" }, { status: 400 });
    }
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

  const id = randomUUID();
  let pdfSrc: string;
  let coverSrc: string;

  try {
    if (pdfUrlRaw) {
      pdfSrc = parseHttpsUrl(pdfUrlRaw, "PDF URL");
    } else if (hasPdfFile && pdf instanceof File) {
      if (useBlob) {
        const blob = await put(`magazines/mag-${id}.pdf`, pdf, {
          access: "public",
          addRandomSuffix: true,
        });
        pdfSrc = blob.url;
      } else {
        await mkdir(MAGAZINES_PUBLIC_DIR, { recursive: true });
        const pdfName = `mag-${id}.pdf`;
        const pdfPath = path.join(MAGAZINES_PUBLIC_DIR, pdfName);
        const buf = Buffer.from(await pdf.arrayBuffer());
        await writeFile(pdfPath, buf);
        pdfSrc = magazinePdfUrl(pdfName);
      }
    } else {
      return NextResponse.json({ error: "PDF is required" }, { status: 400 });
    }

    if (coverUrlRaw) {
      coverSrc = parseHttpsUrl(coverUrlRaw, "Cover URL");
    } else if (hasCoverFile && cover instanceof File) {
      const coverName = `mag-${id}${extForImage(cover)}`;
      if (useBlob) {
        const blob = await put(`magazines/covers/${coverName}`, cover, {
          access: "public",
          addRandomSuffix: true,
        });
        coverSrc = blob.url;
      } else {
        await mkdir(MAGAZINES_COVER_DIR, { recursive: true });
        const coverPath = path.join(MAGAZINES_COVER_DIR, coverName);
        const buf = Buffer.from(await cover.arrayBuffer());
        await writeFile(coverPath, buf);
        coverSrc = magazineCoverUrl(coverName);
      }
    } else {
      return NextResponse.json({ error: "Cover is required" }, { status: 400 });
    }
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
