import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CityCard } from "@/components/destinations/CityCard";
import { resolveStateDestination } from "@/data/states/getStateDestination";

type Props = { params: Promise<{ stateSlug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { stateSlug } = await params;
  const state = await resolveStateDestination(stateSlug);
  if (!state) return { title: "Cities | FTMAG" };
  return {
    title: `Cities in ${state.name} | FTMAG`,
    description: `Explore city dossiers for ${state.name}.`,
  };
}

export default async function StateCitiesPage({ params }: Props) {
  const { stateSlug } = await params;
  const state = await resolveStateDestination(stateSlug);
  if (!state) notFound();

  return (
    <div className="space-y-6 animate-panel-in">
      <Link
        href={`/visit/${stateSlug}`}
        className="inline-flex rounded border border-white/15 bg-black/30 px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] text-white/80 transition hover:border-[#c9a227]/45"
      >
        ← {state.name}
      </Link>

      <header className="ftmag-panel rounded-xl p-6 md:p-8">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#e8d48b]/80">State cities</p>
        <h1 className="mt-2 text-2xl font-semibold text-white md:text-3xl">Explore cities in {state.name}</h1>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {state.topCities.map((city) => (
          <CityCard key={city.slug} city={city} stateSlug={state.slug} />
        ))}
      </section>
    </div>
  );
}
