import type { Metadata } from "next";
import Link from "next/link";
import { US_STATES_ALPHABETICAL } from "@/data/states/usStates";

export const metadata: Metadata = {
  title: "Top Destinations | Food & Travel Magazine",
  description: "All fifty United States — luxury-forward travel dossiers, alphabetically indexed.",
};

export default function TopDestinationsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-1 pb-12 animate-panel-in">
      <header className="space-y-2">
        <p className="text-[10px] uppercase tracking-[0.35em] text-[#e8d48b]/80">Atlas</p>
        <h1 className="text-2xl font-semibold tracking-[0.06em] text-white md:text-3xl">Top destinations</h1>
        <p className="max-w-prose text-sm leading-relaxed text-white/70">
          Fifty states, one editorial standard — select a destination to open its dossier. Routes, seasons, and city
          cards will deepen over time.
        </p>
      </header>

      <nav aria-label="United States destinations" className="ftmag-panel rounded-xl p-5 md:p-6">
        <ol className="columns-1 gap-x-10 gap-y-2 sm:columns-2">
          {US_STATES_ALPHABETICAL.map((s) => (
            <li key={s.slug} className="break-inside-avoid py-1.5">
              <Link
                href={`/visit/${s.slug}`}
                className="text-sm text-[#e8d48b]/90 underline decoration-[#c9a227]/35 underline-offset-4 transition hover:decoration-[#e8d48b]/70"
              >
                {s.name}
              </Link>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
