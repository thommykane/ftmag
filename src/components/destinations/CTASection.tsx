import Link from "next/link";

export function CTASection({
  stateName,
  stateSlug,
  hasCities,
  hasCounties,
}: {
  stateName: string;
  stateSlug: string;
  hasCities: boolean;
  hasCounties: boolean;
}) {
  return (
    <section className="ftmag-panel relative overflow-hidden rounded-xl p-8 md:p-10">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_80%_20%,rgba(201,162,39,0.12),transparent)]"
        aria-hidden
      />
      <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold uppercase tracking-[0.2em] text-[#e8d48b] md:text-xl">
            Next moves
          </h2>
          <p className="mt-2 max-w-xl text-sm text-white/75">
            Explore city dossiers as they publish, or begin shaping an itinerary with our travel desk.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={hasCounties ? `/visit/${stateSlug}/counties/` : "/top-destinations"}
            className="inline-flex items-center justify-center rounded-md border border-[#c9a227]/55 bg-black/50 px-6 py-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#e8d48b] transition hover:border-[#e8d48b] hover:bg-[#6E0F1F]/60"
          >
            {hasCounties ? `Explore counties in ${stateName}` : "All destinations"}
          </Link>
          <Link
            href={hasCities ? `/visit/${stateSlug}/cities/` : "/top-destinations"}
            className="inline-flex items-center justify-center rounded-md border border-[#c9a227]/55 bg-black/50 px-6 py-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#e8d48b] transition hover:border-[#e8d48b] hover:bg-[#6E0F1F]/60"
          >
            {hasCities ? `Explore cities in ${stateName}` : "All destinations"}
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md border-2 border-[#c9a227] bg-[#6E0F1F] px-6 py-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-[0_8px_28px_rgba(0,0,0,0.4)] transition hover:bg-[#5a0c19]"
          >
            Plan your trip
          </Link>
        </div>
      </div>
    </section>
  );
}
