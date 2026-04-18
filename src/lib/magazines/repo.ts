import type { Magazine } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { MagazineIssue } from "@/lib/magazines/types";

function toIssue(m: Magazine): MagazineIssue {
  return {
    slug: m.slug,
    displayTitle: m.displayTitle,
    releaseDate: m.releaseDate.toISOString().slice(0, 10),
    releaseLabel: m.releaseLabel,
    blurb: m.blurb,
    coverSrc: m.coverSrc,
    pdfSrc: m.pdfSrc,
    purchaseUrl: m.purchaseUrl,
  };
}

export async function getMagazineIssuesSorted(): Promise<MagazineIssue[]> {
  const rows = await prisma.magazine.findMany({
    orderBy: { releaseDate: "desc" },
  });
  return rows.map(toIssue);
}

export async function getIssueBySlug(slug: string): Promise<MagazineIssue | undefined> {
  const row = await prisma.magazine.findUnique({ where: { slug } });
  return row ? toIssue(row) : undefined;
}
