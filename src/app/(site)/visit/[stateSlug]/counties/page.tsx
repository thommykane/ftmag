import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { resolveStateDestination } from "@/data/states/getStateDestination";

type Props = { params: Promise<{ stateSlug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { stateSlug } = await params;
  const state = await resolveStateDestination(stateSlug);
  if (!state) return { title: "Counties | FTMAG" };
  return {
    title: `Counties in ${state.name} | FTMAG`,
    description: `Explore counties and regions in ${state.name}.`,
  };
}

export default async function StateCountiesPage({ params }: Props) {
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
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#e8d48b]/80">Regions and counties</p>
        <h1 className="mt-2 text-2xl font-semibold text-white md:text-3xl">Explore counties in {state.name}</h1>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {state.topCounties.map((county) => (
          <article key={county.slug} className="ftmag-panel rounded-xl p-4">
            <h2 className="text-sm font-semibold text-white">{county.name}</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/70">{county.shortDescription}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
