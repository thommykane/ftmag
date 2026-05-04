import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRestaurantByPath } from "@/lib/restaurants-queries";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ state: string; county: string; city: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state, county, city, slug } = await params;
  const r = await getRestaurantByPath(state, county, city, decodeURIComponent(slug));
  if (!r) return { title: "Restaurant | Food & Travel Magazine" };
  return {
    title: `${r.name} | Top Restaurants | Food & Travel Magazine`,
    description: `${r.name} — ranked nationally among America’s top restaurants.`,
  };
}

export default async function TopRestaurantDetailPage({ params }: Props) {
  const { state, county, city, slug } = await params;
  const r = await getRestaurantByPath(state, county, city, decodeURIComponent(slug));
  if (!r) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-12 animate-panel-in">
      <p className="text-[10px] uppercase tracking-[0.35em] text-[#e8d48b]/80">
        <a href="/top-restaurants" className="text-[#e8d48b]/80 hover:text-white">
          Top restaurants
        </a>
      </p>
      <h1 className="text-2xl font-semibold tracking-[0.04em] text-white md:text-3xl">{r.name}</h1>
      <div className="min-h-[240px] rounded-xl border border-white/10 bg-black/25 p-6" aria-hidden />
    </div>
  );
}
