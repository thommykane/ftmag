import Image from "next/image";
import Link from "next/link";
import type { VisitGuide } from "@/data/destinations/visitGuides";
import { GalleryGrid } from "./GalleryGrid";

export function VisitGuideView({ guide }: { guide: VisitGuide }) {
  const {
    stateSlug,
    stateName,
    placeName,
    title,
    dek,
    heroImage,
    gallery,
    paragraphs,
    ctaUrl,
    ctaLabel,
  } = guide;

  return (
    <div className="space-y-10 animate-panel-in text-white">
      <Link
        href={`/visit/${stateSlug}`}
        className="inline-flex rounded border border-white/15 bg-black/30 px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] text-white/80 transition hover:border-[#c9a227]/45 hover:text-[#e8d48b]"
      >
        ← {stateName}
      </Link>

      <section className="relative -mx-4 min-h-[min(62vh,640px)] overflow-hidden rounded-xl border border-[#c9a227]/25 md:-mx-2">
        <div className="absolute inset-0">
          {heroImage ? (
            <Image
              src={heroImage}
              alt=""
              fill
              priority
              className="object-cover object-center transition duration-700 ease-out hover:scale-[1.02]"
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-black" />
          )}
          <div
            className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/30"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"
            aria-hidden
          />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[min(62vh,640px)] max-w-6xl flex-col justify-end px-5 pb-12 pt-16 md:px-8 md:pb-14">
          <p className="text-[10px] uppercase tracking-[0.38em] text-[#e8d48b]/85">
            Visit guide
          </p>
          <p className="mt-2 text-[10px] uppercase tracking-[0.28em] text-white/50">
            {placeName}
            {stateName ? ` · ${stateName}` : ""}
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-[0.04em] text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.65)] md:text-4xl lg:text-5xl">
            {title}
          </h1>
          {dek ? (
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/80 md:text-base">
              {dek}
            </p>
          ) : null}
        </div>
      </section>

      {paragraphs.length > 0 && (
        <article className="ftmag-panel mx-auto max-w-3xl rounded-xl border border-[#c9a227]/20 p-6 md:p-10">
          <div className="space-y-5 text-sm leading-relaxed text-white/85 md:text-[15px] md:leading-relaxed">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </article>
      )}

      {ctaUrl && ctaLabel ? (
        <section className="flex flex-col items-center gap-2">
          <a
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md border-2 border-[#c9a227] bg-[#6E0F1F] px-8 py-3.5 text-center text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-[0_8px_28px_rgba(0,0,0,0.4)] transition hover:bg-[#5a0c19]"
          >
            {ctaLabel}
          </a>
          <p className="text-[11px] text-white/45">
            Official tourism site ·{" "}
            <a
              href={ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#e8d48b]/85 underline decoration-[#c9a227]/40 underline-offset-2 hover:text-[#e8d48b]"
            >
              {(() => {
                try {
                  return new URL(ctaUrl).hostname.replace(/^www\./, "");
                } catch {
                  return ctaUrl;
                }
              })()}
            </a>
          </p>
        </section>
      ) : null}

      {gallery.length > 0 && (
        <section>
          <header className="mb-4 px-1">
            <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-[#e8d48b]">
              Gallery
            </h2>
          </header>
          <GalleryGrid images={gallery} altBase={placeName || title} />
        </section>
      )}
    </div>
  );
}
