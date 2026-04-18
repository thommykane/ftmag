import { prisma } from "@/lib/prisma";

export function slugifyTitle(title: string): string {
  const s = title
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
  return s || "issue";
}

export async function uniqueMagazineSlug(baseTitle: string): Promise<string> {
  let base = slugifyTitle(baseTitle);
  let candidate = base;
  let n = 2;
  for (;;) {
    const existing = await prisma.magazine.findUnique({ where: { slug: candidate } });
    if (!existing) return candidate;
    candidate = `${base}-${n}`;
    n += 1;
  }
}
