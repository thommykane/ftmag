import { mkdir, writeFile } from "fs/promises";
import { put } from "@vercel/blob";
import path from "path";
import { magazineCoverUrl, magazinePdfUrl, MAGAZINES_COVER_DIR, MAGAZINES_PUBLIC_DIR } from "@/lib/magazines/paths";

const useBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

export const MAX_PDF_BYTES = 600 * 1024 * 1024;
export const MAX_COVER_BYTES = 25 * 1024 * 1024;

export function extForImage(file: File): string {
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

export function parseHttpsUrl(raw: string, label: string): string {
  const u = new URL(raw.trim());
  if (u.protocol !== "https:" && u.protocol !== "http:") {
    throw new Error(`${label} must be http(s)`);
  }
  return u.href;
}

/** Resolve PDF + cover sources for create (must end with both set) or update (can keep existing). */
export async function resolvePdfAndCover(opts: {
  assetId: string;
  pdfUrlRaw: string;
  coverUrlRaw: string;
  hasPdfFile: boolean;
  pdf: File | null;
  hasCoverFile: boolean;
  cover: File | null;
  /** For edit: keep when no replacement */
  existingPdfSrc?: string;
  existingCoverSrc?: string;
  /** true = require both assets (create); false = allow keeping existing */
  requireBoth: boolean;
}): Promise<{ pdfSrc: string; coverSrc: string }> {
  const onVercel = Boolean(process.env.VERCEL);
  if (onVercel && !useBlob && (opts.hasPdfFile || opts.hasCoverFile)) {
    throw new Error(
      "On Vercel, file uploads need BLOB_READ_WRITE_TOKEN, or use hosted https URLs instead of files.",
    );
  }

  let pdfSrc = opts.existingPdfSrc ?? "";
  let coverSrc = opts.existingCoverSrc ?? "";

  if (opts.pdfUrlRaw) {
    pdfSrc = parseHttpsUrl(opts.pdfUrlRaw, "PDF URL");
  } else if (opts.hasPdfFile && opts.pdf) {
    if (opts.pdf.type !== "application/pdf" && !opts.pdf.name.toLowerCase().endsWith(".pdf")) {
      throw new Error("PDF upload must be a PDF");
    }
    if (opts.pdf.size > MAX_PDF_BYTES) {
      throw new Error("PDF is too large (max 600 MB)");
    }
    if (useBlob) {
      const blob = await put(`magazines/mag-${opts.assetId}.pdf`, opts.pdf, {
        access: "public",
        addRandomSuffix: true,
      });
      pdfSrc = blob.url;
    } else {
      await mkdir(MAGAZINES_PUBLIC_DIR, { recursive: true });
      const pdfName = `mag-${opts.assetId}.pdf`;
      const pdfPath = path.join(MAGAZINES_PUBLIC_DIR, pdfName);
      await writeFile(pdfPath, Buffer.from(await opts.pdf.arrayBuffer()));
      pdfSrc = magazinePdfUrl(pdfName);
    }
  }

  if (opts.coverUrlRaw) {
    coverSrc = parseHttpsUrl(opts.coverUrlRaw, "Cover URL");
  } else if (opts.hasCoverFile && opts.cover) {
    if (!opts.cover.type.startsWith("image/")) {
      throw new Error("Cover must be an image");
    }
    if (opts.cover.size > MAX_COVER_BYTES) {
      throw new Error("Cover image is too large (max 25 MB)");
    }
    const coverName = `mag-${opts.assetId}${extForImage(opts.cover)}`;
    if (useBlob) {
      const blob = await put(`magazines/covers/${coverName}`, opts.cover, {
        access: "public",
        addRandomSuffix: true,
      });
      coverSrc = blob.url;
    } else {
      await mkdir(MAGAZINES_COVER_DIR, { recursive: true });
      const coverPath = path.join(MAGAZINES_COVER_DIR, coverName);
      await writeFile(coverPath, Buffer.from(await opts.cover.arrayBuffer()));
      coverSrc = magazineCoverUrl(coverName);
    }
  }

  if (!pdfSrc) {
    throw new Error(opts.requireBoth ? "PDF is required" : "PDF is missing — upload a file, paste a URL, or leave unchanged.");
  }
  if (!coverSrc) {
    throw new Error(opts.requireBoth ? "Cover is required" : "Cover is missing — upload, paste URL, or leave unchanged.");
  }

  return { pdfSrc, coverSrc };
}
