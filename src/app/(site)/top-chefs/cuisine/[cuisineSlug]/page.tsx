import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopChefsClient } from "@/components/top-chefs/TopChefsClient";
import { cuisineSlugToLabel } from "@/lib/chefs/cuisineSlug";
import { getAllChefsOrdered } from "@/lib/chefs/queries";

export const dynamic = "force-dynamic";

type Props = { params: { cuisineSlug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const label = cuisineSlugToLabel(params.cuisineSlug);
  if (!label) return { title: "Cuisine | Top Chefs" };
  return {
    title: `${label} Chefs | Food & Travel Magazine`,
    description: `Celebrated chefs known for ${label} — profiles and specialties.`,
  };
}

export default async function TopChefsCuisinePage({ params }: Props) {
  const label = cuisineSlugToLabel(params.cuisineSlug);
  if (!label) notFound();

  const all = await getAllChefsOrdered();
  const chefs = all.filter((c) => c.cuisines.includes(label));

  return <TopChefsClient chefs={chefs} activeCuisine={label} />;
}
