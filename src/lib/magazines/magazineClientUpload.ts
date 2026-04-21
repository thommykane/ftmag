"use client";

import { upload } from "@vercel/blob/client";
import { extForImage } from "@/lib/magazines/extForImage";

const HANDLE_UPLOAD_URL = "/api/admin/blob-upload";

/** Above ~4MB, use multipart client upload (avoids single-request limits). */
const MULTIPART_THRESHOLD = 4 * 1024 * 1024;

/**
 * When Blob is configured, uploads PDF/cover files directly to Vercel Blob from the browser
 * so the admin API route never receives a multi‑MB body (avoids HTTP 413 on Vercel).
 * Replaces file fields with `pdfUrl` / `coverUrl` on the FormData.
 */
export async function applyMagazineFilesViaBlobClient(
  fd: FormData,
  opts: { useClientBlobUpload: boolean; assetId: string | null },
): Promise<void> {
  if (!opts.useClientBlobUpload) return;

  const base = opts.assetId ?? globalThis.crypto.randomUUID();

  const pdf = fd.get("pdf");
  if (pdf instanceof File && pdf.size > 0) {
    fd.delete("pdf");
    const pathname = `magazines/mag-${base}.pdf`;
    const result = await upload(pathname, pdf, {
      access: "public",
      handleUploadUrl: HANDLE_UPLOAD_URL,
      multipart: pdf.size > MULTIPART_THRESHOLD,
    });
    fd.set("pdfUrl", result.url);
  }

  const cover = fd.get("cover");
  if (cover instanceof File && cover.size > 0) {
    fd.delete("cover");
    const coverName = `mag-${base}${extForImage(cover)}`;
    const pathname = `magazines/covers/${coverName}`;
    const result = await upload(pathname, cover, {
      access: "public",
      handleUploadUrl: HANDLE_UPLOAD_URL,
      multipart: cover.size > MULTIPART_THRESHOLD,
    });
    fd.set("coverUrl", result.url);
  }
}
