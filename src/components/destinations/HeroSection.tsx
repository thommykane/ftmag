import Image from "next/image";
import type { ReactNode } from "react";
import type { ThingsToExploreCounts } from "@/types/stateDestination";
import { ThingsToExplorePanel } from "./ThingsToExplorePanel";
import { RichText } from "./RichText";

export function HeroSection({
  stateName,
  tagline,
  heroImage,
  thumbnailShape,
  thumbnailAlt,
  whyVisitHtml,
  thingsToExplore,
  rankedRestaurantCount,
  dossierSlot,
  ribbon,
}: {
  stateName: string;
  tagline: string;
  heroImage: string;
  thumbnailShape: string;
  thumbnailAlt: string;
  whyVisitHtml: string;
  thingsToExplore: ThingsToExploreCounts;
  rankedRestaurantCount: number;
  dossierSlot: ReactNode;
  ribbon?: ReactNode;
}) {
  return (
    <section className="relative -mx-4 mb-10 min-h-[min(78vh,820px)] overflow-hidden rounded-xl border border-[#c9a227]/25 md:-mx-2">
      <div className="absolute inset-0">
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          className="object-cover object-center transition duration-700 ease-out hover:scale-[1.02]"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/25"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent"
          aria-hidden
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-5 pb-12 pt-10 md:px-8 md:pb-14 md:pt-12">
        <header className="mb-8 max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.38em] text-[#e8d48b]/85">Eat · Stay · Explore</p>
          <p className="mt-2 text-[10px] uppercase tracking-[0.28em] text-white/50">Destination dossier</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[0.04em] text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.65)] md:text-4xl lg:text-5xl">
            {stateName}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/80 md:text-base">{tagline}</p>
          {ribbon ? <div className="mt-4">{ribbon}</div> : null}
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,380px)] lg:items-start lg:gap-10">
          <div className="flex min-w-0 flex-col gap-6">
            <div className="flex min-w-0 flex-col gap-6 sm:flex-row sm:items-stretch sm:gap-8">
              <div className="relative mx-auto h-[250px] w-[250px] shrink-0 overflow-hidden rounded-xl border border-[#c9a227]/35 bg-black/50 shadow-[0_0_40px_rgba(201,162,39,0.12)] backdrop-blur-sm sm:mx-0">
                <Image
                  src={thumbnailShape}
                  alt={thumbnailAlt}
                  fill
                  className="object-contain p-3"
                  sizes="250px"
                />
              </div>
              <ThingsToExplorePanel
                className="w-full sm:min-h-[250px]"
                counts={thingsToExplore}
                rankedRestaurantCount={rankedRestaurantCount}
              />
            </div>

            <div className="ftmag-panel w-full max-w-none rounded-xl border border-[#c9a227]/20 p-5 md:p-7">
              <h2 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#e8d48b]">
                Why visit
              </h2>
              <div className="max-w-none text-sm leading-relaxed text-white/85 md:text-[15px] md:leading-relaxed [&_p]:mb-3 [&_p:last-child]:mb-0">
                <RichText html={whyVisitHtml} />
              </div>
            </div>
          </div>

          <div className="min-w-0 lg:flex lg:justify-end">
            <div className="w-full max-w-md lg:sticky lg:top-8">{dossierSlot}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
