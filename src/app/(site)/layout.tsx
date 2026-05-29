import { SiteChrome } from "@/components/SiteChrome";
import { applyAdBannerSeed } from "@/lib/seedAdBanners";
import { getAdBanners } from "@/lib/banners/queries";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  await applyAdBannerSeed(prisma);
  const banners = await getAdBanners();

  return <SiteChrome banners={banners}>{children}</SiteChrome>;
}
