import path from "path";

export const BANNERS_PUBLIC_DIR = path.join(process.cwd(), "public", "banners");

export function bannerPublicUrl(storedFilename: string): string {
  return `/banners/${encodeURIComponent(storedFilename)}`;
}
