import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { resolveStateDestination } from "@/data/states/getStateDestination";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ stateSlug: string; citySlug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { stateSlug, citySlug } = await params;
  const state = await resolveStateDestination(stateSlug);
  const city = state?.topCities.find((c) => c.slug === citySlug);
  if (!state || !city) return { title: "City guide" };
  return {
    title: `${city.name}, ${state.name} | FTMAG`,
    description: city.shortDescription,
  };
}

export default async function CityStubPage({ params }: Props) {
  const { stateSlug, citySlug } = await params;
  const state = await resolveStateDestination(stateSlug);
  if (!state) notFound();
  const city = state.topCities.find((c) => c.slug === citySlug);
  if (!city) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-1 pb-16 animate-panel-in">
      <Link
        href={`/visit/${stateSlug}/cities/`}
        className="inline-flex rounded border border-white/15 bg-black/30 px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] text-white/80 transition hover:border-[#c9a227]/45"
      >
        ← Cities in {state.name}
      </Link>

      <header className="ftmag-panel rounded-xl p-8">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#e8d48b]/75">City dossier</p>
        <h1 className="mt-2 text-2xl font-semibold text-white md:text-3xl">{city.name}</h1>
        <p className="mt-4 text-sm leading-relaxed text-white/75">{city.shortDescription}</p>
        <p className="mt-6 text-xs uppercase tracking-[0.2em] text-white/45">
          Full neighborhood routing, stays, and dining matrices are shipping next.
        </p>
      </header>
    </div>
  );
}
