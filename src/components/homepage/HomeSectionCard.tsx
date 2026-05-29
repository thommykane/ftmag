import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  href?: string;
  ctaLabel?: string;
  imageUrl: string | null;
  imageAlt: string;
  imagePosition?: "left" | "right" | "top";
  children: ReactNode;
  placeholder?: boolean;
};

export function HomeSectionCard({
  eyebrow,
  title,
  subtitle,
  href,
  ctaLabel = "Explore",
  imageUrl,
  imageAlt,
  imagePosition = "left",
  children,
  placeholder = false,
}: Props) {
  const imageBlock = (
    <div
      className={`relative overflow-hidden bg-black/50 ${
        imagePosition === "top"
          ? "aspect-[21/9] w-full min-h-[180px] sm:min-h-[220px]"
          : "aspect-[4/3] w-full min-h-[200px] sm:min-h-[240px] md:aspect-auto md:min-h-[280px] md:w-[42%] md:shrink-0"
      }`}
    >
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- mixed WP / blob / local sources
        <img src={imageUrl} alt={imageAlt} className="h-full w-full object-cover" loading="lazy" />
      ) : (
        <div className="flex h-full min-h-[inherit] items-center justify-center bg-gradient-to-br from-[#1a1014] via-[#2a1520] to-[#1a1014] px-6 text-center">
          <p className="text-xs uppercase tracking-[0.28em] text-white/40">Image coming soon</p>
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      {placeholder ? (
        <span className="absolute left-3 top-3 rounded border border-white/20 bg-black/50 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-white/70">
          Coming soon
        </span>
      ) : null}
    </div>
  );

  const bodyBlock = (
    <div className={`flex min-w-0 flex-1 flex-col justify-center p-5 md:p-6 ${imagePosition === "top" ? "" : ""}`}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#e8d48b]/85">{eyebrow}</p>
      <h2 className="mt-2 font-display text-2xl font-semibold leading-tight tracking-[0.04em] text-white md:text-[1.75rem]">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-[#c9a227]/80">{subtitle}</p>
      ) : null}
      <div className="mt-4 space-y-3 text-sm leading-relaxed text-white/72">{children}</div>
      {href && !placeholder ? (
        <Link
          href={href}
          className="mt-5 inline-flex w-fit items-center gap-2 rounded border border-[#c9a227]/45 bg-[#6E0F1F]/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f5e6a8] transition hover:border-[#c9a227] hover:bg-[#6E0F1F]"
        >
          {ctaLabel}
          <span aria-hidden>→</span>
        </Link>
      ) : null}
    </div>
  );

  return (
    <section className="ftmag-panel overflow-hidden rounded-xl border border-[#c9a227]/20 shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
      {imagePosition === "top" ? (
        <div className="flex flex-col">
          {imageBlock}
          {bodyBlock}
        </div>
      ) : (
        <div className={`flex flex-col ${imagePosition === "right" ? "md:flex-row-reverse" : "md:flex-row"}`}>
          {imageBlock}
          {bodyBlock}
        </div>
      )}
    </section>
  );
}
