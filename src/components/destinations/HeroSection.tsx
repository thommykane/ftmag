import Image from "next/image";
import type { ReactNode } from "react";
import { RichText } from "./RichText";

export function HeroSection({
  stateName,
  tagline,
  heroImage,
  thumbnailShape,
  thumbnailAlt,
  whyVisitHtml,
  dossierSlot,
  ribbon,
}: {
  stateName: string;
  tagline: string;
  heroImage: string;
  thumbnailShape: string;
  thumbnailAlt: string;
  whyVisitHtml: string;
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

        <div className="grid gap-8 md:grid-cols-[minmax(0,280px)_minmax(0,1fr)] md:items-start md:gap-10">
          <div className="flex min-w-0 flex-col gap-6 md:max-w-[280px]">
            <div className="relative h-[250px] w-[250px] shrink-0 overflow-hidden rounded-xl border border-[#c9a227]/35 bg-black/50 shadow-[0_0_40px_rgba(201,162,39,0.12)] backdrop-blur-sm">
              <Image
                src={thumbnailShape}
                alt={thumbnailAlt}
                fill
                className="object-contain p-3"
                sizes="250px"
              />
            </div>
            <div className="ftmag-panel rounded-xl border border-[#c9a227]/20 p-4 md:p-5">
              <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#e8d48b]">
                Why visit
              </h2>
              <div className="text-sm leading-relaxed text-white/85 [&_p]:mb-3 [&_p:last-child]:mb-0">
                <RichText html={whyVisitHtml} />
              </div>
            </div>
          </div>

          <div className="min-w-0 md:flex md:justify-end">
            <div className="w-full max-w-md md:sticky md:top-8">{dossierSlot}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
