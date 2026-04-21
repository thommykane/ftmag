import { mkdir, writeFile } from "fs/promises";
import { put } from "@vercel/blob";
import path from "path";
import { randomUUID } from "crypto";
import { CHEFS_PUBLIC_DIR, chefPortraitUrl } from "@/lib/chefs/paths";

const useBlob = Boolean(process.env["BLOB_READ_WRITE_TOKEN"]);
export const MAX_PORTRAIT_BYTES = 12 * 1024 * 1024;

export function extForPortrait(file: File): string {
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

function parseHttpsUrl(raw: string): string {
  const u = new URL(raw.trim());
  if (u.protocol !== "https:" && u.protocol !== "http:") throw new Error("Image URL must be http(s)");
  return u.href;
}

/**
 * Resolve portrait from pasted URL or file upload. `storageKey` is used in filenames (e.g. slug).
 */
export async function resolveChefPortrait(opts: {
  storageKey: string;
  imageUrlRaw: string;
  hasFile: boolean;
  file: File | null;
  existingImageUrl?: string;
  /** If true, require a URL or file (create). If false, can keep existing when both omitted. */
  requireImage: boolean;
}): Promise<string> {
  const onVercel = Boolean(process.env.VERCEL);
  if (onVercel && !useBlob && opts.hasFile && opts.file) {
    throw new Error("On Vercel, image uploads need BLOB_READ_WRITE_TOKEN or paste an https image URL.");
  }

  if (opts.imageUrlRaw) {
    return parseHttpsUrl(opts.imageUrlRaw);
  }
  if (opts.hasFile && opts.file) {
    if (!opts.file.type.startsWith("image/")) throw new Error("Portrait must be an image");
    if (opts.file.size > MAX_PORTRAIT_BYTES) throw new Error("Image is too large (max 12 MB)");
    const safeKey = opts.storageKey.replace(/[^a-z0-9-]/gi, "-").slice(0, 60);
    const ext = extForPortrait(opts.file);
    const fileName = `chef-${safeKey}-${randomUUID()}${ext}`;
    if (useBlob) {
      const blob = await put(`chefs/${fileName}`, opts.file, { access: "public", addRandomSuffix: false });
      return blob.url;
    }
    await mkdir(CHEFS_PUBLIC_DIR, { recursive: true });
    const diskPath = path.join(CHEFS_PUBLIC_DIR, fileName);
    await writeFile(diskPath, Buffer.from(await opts.file.arrayBuffer()));
    return chefPortraitUrl(fileName);
  }
  if (opts.requireImage) {
    throw new Error("Add a portrait image or paste an https URL.");
  }
  const existing = opts.existingImageUrl?.trim();
  if (!existing) throw new Error("Image is missing — upload, paste URL, or leave unchanged.");
  return existing;
}
