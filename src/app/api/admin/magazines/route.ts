import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
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

  if (!(pdf instanceof File) || pdf.size === 0) {
    return NextResponse.json({ error: "PDF file is required" }, { status: 400 });
  }
  if (pdf.type !== "application/pdf" && !pdf.name.toLowerCase().endsWith(".pdf")) {
    return NextResponse.json({ error: "Upload must be a PDF" }, { status: 400 });
  }
  if (pdf.size > MAX_PDF_BYTES) {
    return NextResponse.json({ error: "PDF is too large (max 600 MB)" }, { status: 400 });
  }

  if (!(cover instanceof File) || cover.size === 0) {
    return NextResponse.json({ error: "Cover image is required" }, { status: 400 });
  }
  if (!cover.type.startsWith("image/")) {
    return NextResponse.json({ error: "Cover must be an image" }, { status: 400 });
  }
  if (cover.size > MAX_COVER_BYTES) {
    return NextResponse.json({ error: "Cover image is too large (max 25 MB)" }, { status: 400 });
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

  await mkdir(MAGAZINES_PUBLIC_DIR, { recursive: true });
  await mkdir(MAGAZINES_COVER_DIR, { recursive: true });

  const id = randomUUID();
  const pdfName = `mag-${id}.pdf`;
  const coverName = `mag-${id}${extForImage(cover)}`;

  const pdfPath = path.join(MAGAZINES_PUBLIC_DIR, pdfName);
  const coverPath = path.join(MAGAZINES_COVER_DIR, coverName);

  const [pdfBuf, coverBuf] = await Promise.all([pdf.arrayBuffer(), cover.arrayBuffer()]);
  await Promise.all([writeFile(pdfPath, Buffer.from(pdfBuf)), writeFile(coverPath, Buffer.from(coverBuf))]);

  const slug = await uniqueMagazineSlug(displayTitle);
  const pdfSrc = magazinePdfUrl(pdfName);
  const coverSrc = magazineCoverUrl(coverName);

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
