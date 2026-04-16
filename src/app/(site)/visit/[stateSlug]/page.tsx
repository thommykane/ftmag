import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StateDestinationView } from "@/components/destinations/StateDestinationView";
import { getAllStateSlugs, getStateDestination } from "@/data/states/getStateDestination";

type Props = { params: Promise<{ stateSlug: string }> };

export function generateStaticParams() {
  return getAllStateSlugs().map((stateSlug) => ({ stateSlug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { stateSlug } = await params;
  const d = getStateDestination(stateSlug);
  if (!d) return { title: "Destination" };
  return {
    title: d.metaTitle,
    description: d.metaDescription,
    openGraph: {
      title: d.metaTitle,
      description: d.metaDescription,
      images: [{ url: d.heroImage }],
    },
  };
}

export default async function VisitStatePage({ params }: Props) {
  const { stateSlug } = await params;
  const d = getStateDestination(stateSlug);
  if (!d) notFound();

  return <StateDestinationView d={d} />;
}
