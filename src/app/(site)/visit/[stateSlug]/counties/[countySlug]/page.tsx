import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FallPlaceView } from "@/components/destinations/FallPlaceView";
import { getFallPlace } from "@/data/destinations/fall2026Places";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ stateSlug: string; countySlug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { stateSlug, countySlug } = await params;
  const place = getFallPlace(stateSlug, "county", countySlug);
  if (!place) return { title: "County guide" };
  return {
    title: `${place.title} | FTMAG`,
    description: place.dek,
  };
}

export default async function CountyPage({ params }: Props) {
  const { stateSlug, countySlug } = await params;
  const place = getFallPlace(stateSlug, "county", countySlug);
  if (!place) notFound();
  return <FallPlaceView place={place} />;
}
