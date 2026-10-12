import Link from "next/link";
import type { StateDestination } from "@/types/stateDestination";
import type { RestaurantDTO } from "@/lib/restaurantPublic";
import { getFallPlacesForState } from "@/data/destinations/fall2026Places";
import { getVisitGuidesForState } from "@/data/destinations/visitGuides";
import { CTASection } from "./CTASection";
import { DossierCard } from "./DossierCard";
import { ExperienceCard } from "./ExperienceCard";
import { CityCard } from "./CityCard";
import { GalleryGrid } from "./GalleryGrid";
import { HeroSection } from "./HeroSection";
import { SeasonalTabs } from "./SeasonalTabs";
import { VideoEmbed } from "./VideoEmbed";
import { StateEatSection } from "./StateEatSection";
import { DestinationMapPlacesSection } from "./DestinationMapPlacesSection";

export function StateDestinationView({
  d,
  eatRestaurants,
}: {
  d: StateDestination;
  eatRestaurants: RestaurantDTO[];
}) {
  const fallCities = getFallPlacesForState(d.slug, "city");
  const fallCounties = getFallPlacesForState(d.slug, "county");
  const citySlugs = new Set(d.topCities.map((c) => c.slug));
  const cities = [
    ...d.topCities,
    ...fallCities
      .filter((p) => !citySlugs.has(p.placeSlug))
      .map((p) => ({
        name: p.placeName,
        slug: p.placeSlug,
        shortDescription: p.dek,
        imageUrl: p.heroImage || undefined,
      })),
  ];
  const countySlugs = new Set(d.topCounties.map((c) => c.slug));
  const counties = [
    ...d.topCounties,
    ...fallCounties
      .filter((p) => !countySlugs.has(p.placeSlug))
      .map((p) => ({
        name: p.placeName,
        slug: p.placeSlug,
        shortDescription: p.dek,
      })),
  ];
  const fallCountySlugs = new Set(fallCounties.map((p) => p.placeSlug));
  const hasCities = cities.length > 0;
  const hasCounties = counties.length > 0 && (d.showCounties || fallCounties.length > 0);
  const rankedRestaurantCount = eatRestaurants.filter((r) => r.nationalRank != null).length;
  const visitGuides = getVisitGuidesForState(d.slug);

  return (
    <div className="space-y-10 animate-panel-in text-white">
      <Link
        href="/top-destinations"
        className="inline-flex rounded border border-white/15 bg-black/30 px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] text-white/80 transition hover:border-[#c9a227]/45 hover:text-[#e8d48b]"
      >
        ← Top destinations
      </Link>

      <HeroSection
        stateName={d.name}
        tagline={d.tagline}
        heroImage={d.heroImage}
        thumbnailShape={d.thumbnailShape}
        thumbnailAlt={`${d.name} outline`}
        whyVisitHtml={d.whyVisit}
        thingsToExplore={d.thingsToExplore}
        rankedRestaurantCount={rankedRestaurantCount}
        dossierSlot={<DossierCard d={d} />}
        ribbon={
          d.contentComplete === false ? (
            <p className="rounded-md border border-[#c9a227]/30 bg-black/45 px-3 py-2 text-[11px] uppercase tracking-[0.16em] text-[#e8d48b]/90">
              Guide expansion in progress — dossier fields active; narrative deepening soon.
            </p>
          ) : null
        }
      />

      <StateEatSection stateName={d.name} restaurants={eatRestaurants} />

      {visitGuides.length > 0 && (
        <section id="visit-guides" className="scroll-mt-28">
          <header className="mb-5 px-1">
            <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-[#e8d48b]">
              Visit
            </h2>
          </header>
          <ul className="ftmag-panel divide-y divide-white/10 rounded-xl border border-[#c9a227]/20 px-5 py-1">
            {visitGuides.map((g) => (
              <li key={g.visitSlug}>
                <Link
                  href={`/visit/${g.stateSlug}/${g.visitSlug}/`}
                  className="block py-4 text-lg font-medium text-white underline decoration-[#c9a227]/60 decoration-2 underline-offset-[4px] transition hover:text-[#e8d48b] md:text-xl"
                >
                  {g.linkLabel}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <DestinationMapPlacesSection
        title="Tourist attractions"
        subtitle="Visitor destinations & draws — not national parks, beaches, or signature monuments"
        places={d.touristAttractionSpots}
      />

      <DestinationMapPlacesSection
        title="Landmarks & monuments"
        subtitle="Bridges, historic sites, and skyline icons"
        places={d.landmarkMonumentSpots}
      />

      {d.featuredExperiences.length > 0 && (
        <section>
          <header className="mb-4 px-1">
            <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-[#e8d48b]">
              Signature experiences
            </h2>
            <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/45">
              Curated routes &amp; rituals
            </p>
          </header>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
            {d.featuredExperiences.map((ex) => (
              <ExperienceCard key={ex.title} {...ex} />
            ))}
          </div>
        </section>
      )}

      {hasCities && (
        <section id="signature-cities" className="scroll-mt-28">
          <header className="mb-5 px-1">
            <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-[#e8d48b]">Top cities</h2>
            <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/45">
              Click through to city dossiers (rolling out)
            </p>
          </header>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {cities.map((c) => (
              <CityCard key={c.slug} city={c} stateSlug={d.slug} />
            ))}
          </div>
        </section>
      )}

      {hasCounties && (
        <section>
          <header className="mb-5 px-1">
            <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-[#e8d48b]">
              Regions &amp; counties
            </h2>
          </header>
          <div className="grid gap-4 md:grid-cols-3">
            {counties.map((co) => {
              const card = (
                <>
                  <h3 className="text-sm font-semibold text-white">{co.name}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-white/70">{co.shortDescription}</p>
                </>
              );
              if (!fallCountySlugs.has(co.slug)) {
                return (
                  <article key={co.slug} className="ftmag-panel rounded-xl p-4">
                    {card}
                  </article>
                );
              }
              return (
                <Link
                  key={co.slug}
                  href={`/visit/${d.slug}/counties/${co.slug}`}
                  className="ftmag-panel rounded-xl p-4 transition hover:border-[#c9a227]/45"
                >
                  {card}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <SeasonalTabs breakdown={d.seasonalBreakdown} />

      {d.videoUrl && (
        <section>
          <header className="mb-4 px-1">
            <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-[#e8d48b]">Cinematic</h2>
            <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/45">Moving postcard</p>
          </header>
          <VideoEmbed url={d.videoUrl} title={`${d.name} — featured video`} />
        </section>
      )}

      {d.gallery.length > 0 && (
        <section>
          <header className="mb-4 px-1">
            <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-[#e8d48b]">Gallery</h2>
          </header>
          <GalleryGrid images={d.gallery} altBase={d.name} />
        </section>
      )}

      {d.quickTips.length > 0 && (
        <section>
          <header className="mb-4 px-1">
            <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-[#e8d48b]">Quick tips</h2>
          </header>
          <ul className="grid gap-3 md:grid-cols-2">
            {d.quickTips.map((tip) => (
              <li
                key={tip}
                className="ftmag-panel rounded-lg border border-[#c9a227]/20 p-4 text-sm leading-relaxed text-white/85"
              >
                <span className="mr-2 text-[#c9a227]">▸</span>
                {tip}
              </li>
            ))}
          </ul>
        </section>
      )}

      <CTASection stateName={d.name} stateSlug={d.slug} hasCities={hasCities} hasCounties={hasCounties} />
    </div>
  );
}
