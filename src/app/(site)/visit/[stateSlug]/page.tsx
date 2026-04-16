import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StateDestinationView } from "@/components/destinations/StateDestinationView";
import { resolveStateDestination } from "@/data/states/getStateDestination";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ stateSlug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { stateSlug } = await params;
  const d = await resolveStateDestination(stateSlug);
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
  const d = await resolveStateDestination(stateSlug);
  if (!d) notFound();

  return <StateDestinationView d={d} />;
}
