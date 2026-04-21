import path from "path";

export const CHEFS_PUBLIC_DIR = path.join(process.cwd(), "public", "chefs");

export function chefPortraitUrl(storedFilename: string): string {
  return `/chefs/${encodeURIComponent(storedFilename)}`;
}
