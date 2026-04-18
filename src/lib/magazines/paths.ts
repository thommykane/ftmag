import path from "path";

/** Relative to project root (public/). */
export const MAGAZINES_PUBLIC_DIR = path.join(process.cwd(), "public", "magazines");
export const MAGAZINES_COVER_DIR = path.join(MAGAZINES_PUBLIC_DIR, "cover-thumbnails");

/** URL paths served from public/ */
export function magazinePdfUrl(storedFilename: string): string {
  return `/magazines/${encodeURIComponent(storedFilename)}`;
}

export function magazineCoverUrl(storedFilename: string): string {
  return `/magazines/cover-thumbnails/${encodeURIComponent(storedFilename)}`;
}
