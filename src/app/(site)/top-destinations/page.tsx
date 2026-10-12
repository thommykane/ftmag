import type { Metadata } from "next";
import { TopDestinationsMenu, type StateDestinationMenu } from "@/components/destinations/TopDestinationsMenu";
import { FALL_2026_PLACES } from "@/data/destinations/fall2026Places";
import { VISIT_GUIDES } from "@/data/destinations/visitGuides";
import { US_STATES_ALPHABETICAL } from "@/data/states/usStates";

export const metadata: Metadata = {
  title: "Top Destinations | Food & Travel Magazine",
  description: "All fifty United States — states, counties, and cities, alphabetically indexed.",
};

type MenuLink = { name: string; href: string };

function isCountyPlace(name: string, slug: string): boolean {
  return /county/i.test(name) || /county/i.test(slug);
}

function menuForState(stateSlug: string): { counties: MenuLink[]; cities: MenuLink[] } {
  const counties: MenuLink[] = [];
  const cities: MenuLink[] = [];
  const seen = new Set<string>();

  function add(kind: "county" | "city", name: string, href: string) {
    const key = name.toLowerCase().replace(/[^a-z0-9]+/g, "");
    if (!key || seen.has(key)) return;
    seen.add(key);
    (kind === "county" ? counties : cities).push({ name, href });
  }

  for (const place of FALL_2026_PLACES) {
    if (place.stateSlug !== stateSlug) continue;
    const href =
      place.kind === "county"
        ? `/visit/${place.stateSlug}/counties/${place.placeSlug}`
        : `/visit/${place.stateSlug}/cities/${place.placeSlug}`;
    add(place.kind, place.placeName, href);
  }

  for (const guide of VISIT_GUIDES) {
    if (guide.stateSlug !== stateSlug) continue;
    const kind = isCountyPlace(guide.placeName, guide.visitSlug) ? "county" : "city";
    add(kind, guide.placeName, `/visit/${guide.stateSlug}/${guide.visitSlug}`);
  }

  counties.sort((a, b) => a.name.localeCompare(b.name));
  cities.sort((a, b) => a.name.localeCompare(b.name));
  return { counties, cities };
}

function buildMenus(): StateDestinationMenu[] {
  return US_STATES_ALPHABETICAL.map((state) => {
    const { counties, cities } = menuForState(state.slug);
    return { name: state.name, slug: state.slug, counties, cities };
  });
}

export default function TopDestinationsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-1 pb-12 animate-panel-in">
      <header className="space-y-2">
        <p className="text-[10px] uppercase tracking-[0.35em] text-[#e8d48b]/80">Atlas</p>
        <h1 className="text-2xl font-semibold tracking-[0.06em] text-white md:text-3xl">Top destinations</h1>
        <p className="max-w-prose text-sm leading-relaxed text-white/70">
          Fifty states, one editorial standard. Select a destination to open its dossier, or use the arrow to see its
          counties and cities.
        </p>
      </header>

      <nav aria-label="United States destinations" className="ftmag-panel rounded-xl px-5 py-2 md:px-6">
        <TopDestinationsMenu states={buildMenus()} />
      </nav>
    </div>
  );
}
