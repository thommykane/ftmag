import type { Metadata } from "next";
import Link from "next/link";
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

function menuForState(stateSlug: string, stateName: string): { counties: MenuLink[]; cities: MenuLink[] } {
  const counties: MenuLink[] = [];
  const cities: MenuLink[] = [];
  const seen = new Set<string>();

  function add(kind: "county" | "city", name: string, href: string) {
    const key = name.toLowerCase().replace(/[^a-z0-9]+/g, "");
    if (!key || seen.has(key)) return;
    if (name.toLowerCase() === stateName.toLowerCase()) return;
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

const linkClass =
  "text-sm text-white/80 underline decoration-white/25 underline-offset-4 transition hover:text-[#e8d48b] hover:decoration-[#c9a227]/60";

function PlaceGroup({ heading, links }: { heading: string; links: MenuLink[] }) {
  if (links.length === 0) return null;
  return (
    <div className="mt-3">
      <h3 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#e8d48b]/70">{heading}</h3>
      <ul className="mt-1.5 space-y-1 border-l border-[#c9a227]/25 pl-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={linkClass}>
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function TopDestinationsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-1 pb-12 animate-panel-in">
      <header className="space-y-2">
        <p className="text-[10px] uppercase tracking-[0.35em] text-[#e8d48b]/80">Atlas</p>
        <h1 className="text-2xl font-semibold tracking-[0.06em] text-white md:text-3xl">Top destinations</h1>
        <p className="max-w-prose text-sm leading-relaxed text-white/70">
          Fifty states, one editorial standard. Open a state dossier, or choose a county or city beneath it.
        </p>
      </header>

      <nav aria-label="United States destinations" className="ftmag-panel rounded-xl p-5 md:p-6">
        <ol className="columns-1 gap-x-12 sm:columns-2">
          {US_STATES_ALPHABETICAL.map((s) => {
            const { counties, cities } = menuForState(s.slug, s.name);
            return (
              <li key={s.slug} className="mb-6 break-inside-avoid">
                <Link
                  href={`/visit/${s.slug}`}
                  className="text-sm font-semibold text-[#e8d48b]/90 underline decoration-[#c9a227]/35 underline-offset-4 transition hover:decoration-[#e8d48b]/70"
                >
                  {s.name}
                </Link>
                <PlaceGroup heading="Counties" links={counties} />
                <PlaceGroup heading="Cities / Towns" links={cities} />
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
