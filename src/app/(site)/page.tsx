import { HomePageView } from "@/components/homepage/HomePageView";
import { getHomePageContent } from "@/lib/homepage/getHomePageContent";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await getHomePageContent();
  return <HomePageView content={content} />;
}
