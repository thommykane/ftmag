import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllChefSlugs, getChefBySlug } from "@/data/chefs";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return getAllChefSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const chef = getChefBySlug(params.slug);
  if (!chef) return { title: "Chef" };
  return { title: `${chef.name} | Food & Travel Magazine` };
}

export default function ChefProfilePage({ params }: Props) {
  const chef = getChefBySlug(params.slug);
  if (!chef) notFound();

  return (
    <div className="animate-panel-in space-y-4">
      <Link
        href="/top-chefs"
        className="inline-block rounded border border-white/20 px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] text-white/80 transition hover:border-[#c9a227]/50 hover:text-white"
      >
        ← Top Chefs
      </Link>
      <section className="ftmag-panel rounded-lg p-8 md:p-12">
        <h1 className="font-display text-center text-3xl font-semibold tracking-[0.08em] text-white md:text-4xl">
          {chef.name}
        </h1>
      </section>
    </div>
  );
}
