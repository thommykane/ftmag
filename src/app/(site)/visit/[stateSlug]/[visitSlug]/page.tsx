import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VisitGuideView } from "@/components/destinations/VisitGuideView";
import {
  getAllVisitGuideParams,
  getVisitGuide,
} from "@/data/destinations/visitGuides";

type Props = { params: Promise<{ stateSlug: string; visitSlug: string }> };

export function generateStaticParams() {
  return getAllVisitGuideParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { stateSlug, visitSlug } = await params;
  if (!visitSlug.startsWith("visit-")) {
    return { title: "Visit guide" };
  }
  const guide = getVisitGuide(stateSlug, visitSlug);
  if (!guide) return { title: "Visit guide" };
  return {
    title: `${guide.title} | FTMAG`,
    description: guide.dek,
    openGraph: {
      title: guide.title,
      description: guide.dek,
      images: guide.heroImage ? [{ url: guide.heroImage }] : undefined,
    },
  };
}

export default async function VisitGuidePage({ params }: Props) {
  const { stateSlug, visitSlug } = await params;

  if (!visitSlug.startsWith("visit-")) notFound();

  const guide = getVisitGuide(stateSlug, visitSlug);
  if (!guide) notFound();

  return <VisitGuideView guide={guide} />;
}
