import Image from "next/image";
import type { ReactNode } from "react";

export function HeroSection({
  stateName,
  tagline,
  heroImage,
  thumbnailShape,
  thumbnailAlt,
  dossierSlot,
  ribbon,
}: {
  stateName: string;
  tagline: string;
  heroImage: string;
  thumbnailShape: string;
  thumbnailAlt: string;
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

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-8 px-5 pb-12 pt-16 md:flex-row md:items-end md:justify-between md:px-8 md:pb-14 md:pt-20">
        <div className="flex max-w-xl flex-col gap-6 md:flex-row md:items-end md:gap-8">
          <div className="relative h-[250px] w-[250px] shrink-0 overflow-hidden rounded-xl border border-[#c9a227]/35 bg-black/50 shadow-[0_0_40px_rgba(201,162,39,0.12)] backdrop-blur-sm">
            <Image
              src={thumbnailShape}
              alt={thumbnailAlt}
              fill
              className="object-contain p-3"
              sizes="250px"
            />
          </div>
          <div className="space-y-3 pb-1">
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#e8d48b]/80">Destination dossier</p>
            <h1 className="text-3xl font-semibold tracking-[0.04em] text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.65)] md:text-4xl lg:text-5xl">
              {stateName}
            </h1>
            <p className="max-w-md text-sm leading-relaxed text-white/80 md:text-base">{tagline}</p>
            {ribbon}
          </div>
        </div>

        <div className="w-full max-w-md shrink-0 md:max-w-[380px]">{dossierSlot}</div>
      </div>
    </section>
  );
}
