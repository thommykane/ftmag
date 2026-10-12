import { VisitGuideView } from "@/components/destinations/VisitGuideView";
import type { FallPlace } from "@/data/destinations/fall2026Places";
import type { VisitGuide } from "@/data/destinations/visitGuides";

function asGuide(place: FallPlace): VisitGuide {
  return {
    stateSlug: place.stateSlug,
    visitSlug: place.placeSlug,
    linkLabel: place.linkLabel,
    placeName: place.placeName,
    stateName: place.stateName,
    title: place.title,
    dek: place.dek,
    heroImage: place.heroImage,
    gallery: place.gallery,
    paragraphs: place.paragraphs,
    ctaUrl: place.ctaUrl,
    ctaLabel: place.ctaLabel,
  };
}

export function FallPlaceView({ place }: { place: FallPlace }) {
  return (
    <VisitGuideView
      guide={asGuide(place)}
      eyebrow={place.kind === "county" ? "County" : "City"}
    />
  );
}
