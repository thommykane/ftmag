import { prisma } from "@/lib/prisma";

export type AdBannerDTO = {
  id: string;
  imageSrc: string;
  href: string;
  label: string;
  sortOrder: number;
};

export function toAdBannerDTO(b: {
  id: string;
  imageSrc: string;
  href: string;
  label: string;
  sortOrder: number;
}): AdBannerDTO {
  return {
    id: b.id,
    imageSrc: b.imageSrc,
    href: b.href,
    label: b.label,
    sortOrder: b.sortOrder,
  };
}

export async function getAdBanners(): Promise<AdBannerDTO[]> {
  try {
    const rows = await prisma.adBanner.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return rows.map(toAdBannerDTO);
  } catch {
    return [];
  }
}

export async function getNextBannerSortOrder(): Promise<number> {
  const last = await prisma.adBanner.findFirst({
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });
  return (last?.sortOrder ?? -1) + 1;
}
