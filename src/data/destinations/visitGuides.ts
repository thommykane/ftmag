import { SUMMER_2026_GUIDES } from "./summer2026Guides";

export type VisitGuide = {
  stateSlug: string;
  visitSlug: string; // e.g. "visit-dodge-city"
  linkLabel: string; // e.g. "Visit Dodge City"
  placeName: string; // city/region name
  stateName: string;
  title: string; // article headline
  dek: string; // short subhead
  heroImage: string; // public path
  gallery: string[]; // public paths
  paragraphs: string[]; // article body paragraphs (plain text)
  ctaUrl?: string;
  ctaLabel?: string;
};

// Content filled by summer2026Guides — imported below
export const VISIT_GUIDES: VisitGuide[] = [...SUMMER_2026_GUIDES];

export function getVisitGuide(
  stateSlug: string,
  visitSlug: string,
): VisitGuide | undefined {
  return VISIT_GUIDES.find(
    (g) => g.stateSlug === stateSlug && g.visitSlug === visitSlug,
  );
}

export function getVisitGuidesForState(stateSlug: string): VisitGuide[] {
  return VISIT_GUIDES.filter((g) => g.stateSlug === stateSlug);
}

export function getAllVisitGuideParams(): {
  stateSlug: string;
  visitSlug: string;
}[] {
  return VISIT_GUIDES.map(({ stateSlug, visitSlug }) => ({
    stateSlug,
    visitSlug,
  }));
}
