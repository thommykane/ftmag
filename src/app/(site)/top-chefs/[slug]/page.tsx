import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChefProfileLayout } from "@/components/chefs/ChefProfileLayout";
import { getChefBySlug } from "@/lib/chefs/queries";
import { getNationalRankedRestaurantsForChef } from "@/lib/chefs/rankedRestaurantsForChef";

export const dynamic = "force-dynamic";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const chef = await getChefBySlug(params.slug);
  if (!chef) return { title: "Chef | Food & Travel Magazine" };
  const desc = chef.description.trim();
  return {
    title: `${chef.name} | Food & Travel Magazine`,
    description: desc ? desc.slice(0, 160) : `Profile of ${chef.name} — Food & Travel Magazine.`,
  };
}

export default async function ChefProfilePage({ params }: Props) {
  const chef = await getChefBySlug(params.slug);
  if (!chef) notFound();

  const rankedRestaurants = await getNationalRankedRestaurantsForChef(chef.name);

  return (
    <div className="animate-panel-in space-y-6">
      <Link
        href="/top-chefs"
        className="inline-block rounded border border-white/20 px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] text-white/80 transition hover:border-[#c9a227]/50 hover:text-white"
      >
        ← Top Chefs
      </Link>

      <ChefProfileLayout chef={chef} rankedRestaurants={rankedRestaurants} />
    </div>
  );
}
