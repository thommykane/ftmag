import { mkdir, writeFile } from "fs/promises";
import { put } from "@vercel/blob";
import path from "path";
import { randomUUID } from "crypto";
import { BANNERS_PUBLIC_DIR, bannerPublicUrl } from "@/lib/banners/paths";

const useBlob = Boolean(process.env["BLOB_READ_WRITE_TOKEN"]);
export const MAX_BANNER_BYTES = 8 * 1024 * 1024;

const ALLOWED_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/gif"]);

export function extForBanner(file: File): string {
  const t = file.type.toLowerCase();
  if (t === "image/jpeg" || t === "image/jpg") return ".jpg";
  if (t === "image/png") return ".png";
  if (t === "image/gif") return ".gif";
  const n = file.name.toLowerCase();
  if (n.endsWith(".png")) return ".png";
  if (n.endsWith(".gif")) return ".gif";
  if (n.endsWith(".jpg") || n.endsWith(".jpeg")) return ".jpg";
  return ".jpg";
}

function sanitizeFilename(name: string): string {
  const base = path.basename(name).replace(/[^a-zA-Z0-9._-]/g, "-");
  return base.slice(0, 120) || `banner-${randomUUID()}.jpg`;
}

export async function resolveBannerImage(opts: {
  file: File;
}): Promise<string> {
  const onVercel = Boolean(process.env.VERCEL);
  if (onVercel && !useBlob) {
    throw new Error("On Vercel, banner uploads need BLOB_READ_WRITE_TOKEN configured.");
  }

  const { file } = opts;
  if (!ALLOWED_TYPES.has(file.type.toLowerCase()) && !/\.(jpe?g|png|gif)$/i.test(file.name)) {
    throw new Error("Banner must be JPG, PNG, or GIF.");
  }
  if (file.size > MAX_BANNER_BYTES) {
    throw new Error("Banner image is too large (max 8 MB).");
  }

  const ext = extForBanner(file);
  let fileName = sanitizeFilename(file.name);
  if (!fileName.toLowerCase().endsWith(ext)) {
    fileName = `${fileName.replace(/\.[^.]+$/, "")}${ext}`;
  }

  if (useBlob) {
    const blob = await put(`banners/${fileName}`, file, { access: "public", addRandomSuffix: true });
    return blob.url;
  }

  await mkdir(BANNERS_PUBLIC_DIR, { recursive: true });
  const diskPath = path.join(BANNERS_PUBLIC_DIR, fileName);
  await writeFile(diskPath, Buffer.from(await file.arrayBuffer()));
  return bannerPublicUrl(fileName);
}
