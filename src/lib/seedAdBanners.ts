import type { PrismaClient } from "@prisma/client";

/** Initial rotator slides — files live in public/banners/. */
export const AD_BANNER_SEED: { imageSrc: string; href: string; label: string }[] = [
  { imageSrc: "/banners/ColumbusGA.jpg", href: "https://visitcolumbusga.com/", label: "Visit Columbus GA" },
  {
    imageSrc: "/banners/LakeMurrayCountry.jpg",
    href: "https://www.lakemurraycountry.com/",
    label: "Lake Murray Country",
  },
  { imageSrc: "/banners/Lynchburg.png", href: "https://www.lynchburgtenn.com/", label: "Lynchburg Tennessee" },
  {
    imageSrc: "/banners/MerrimackMA.png",
    href: "https://revolutionaryvalley.org/",
    label: "Merrimack Valley MA",
  },
  { imageSrc: "/banners/missoula.jpg", href: "https://adventuremissoula.com/", label: "Adventure Missoula" },
  { imageSrc: "/banners/tbcvb1.gif", href: "https://www.visittampabay.com/", label: "Visit Tampa Bay" },
  {
    imageSrc: "/banners/York-County.png",
    href: "https://www.visityorkcounty.com/",
    label: "Visit York County",
  },
];

/** Seed default banners when the table is empty (safe to run on deploy). */
export async function applyAdBannerSeed(prisma: PrismaClient): Promise<number> {
  const count = await prisma.adBanner.count();
  if (count > 0) return 0;

  for (let i = 0; i < AD_BANNER_SEED.length; i++) {
    const row = AD_BANNER_SEED[i]!;
    await prisma.adBanner.create({
      data: {
        imageSrc: row.imageSrc,
        href: row.href,
        label: row.label,
        sortOrder: i,
      },
    });
  }
  return AD_BANNER_SEED.length;
}
