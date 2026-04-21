import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getChefBySlug } from "@/lib/chefs/queries";

export const dynamic = "force-dynamic";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const chef = await getChefBySlug(params.slug);
  if (!chef) return { title: "Chef | Food & Travel Magazine" };
  return {
    title: `${chef.name} | Food & Travel Magazine`,
    description: chef.description.slice(0, 160),
  };
}

function portraitUnoptimized(url: string) {
  return url.includes("blob.vercel-storage.com");
}

export default async function ChefProfilePage({ params }: Props) {
  const chef = await getChefBySlug(params.slug);
  if (!chef) notFound();

  return (
    <div className="animate-panel-in space-y-6">
      <Link
        href="/top-chefs"
        className="inline-block rounded border border-white/20 px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] text-white/80 transition hover:border-[#c9a227]/50 hover:text-white"
      >
        ← Top Chefs
      </Link>

      <section className="ftmag-panel overflow-hidden rounded-lg">
        <div className="grid gap-0 md:grid-cols-[minmax(0,320px)_1fr] md:gap-0">
          <div className="relative aspect-[4/5] w-full min-h-[280px] bg-black/40 md:min-h-[420px]">
            <Image
              src={chef.imageUrl}
              alt={chef.name}
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 320px"
              priority
              unoptimized={portraitUnoptimized(chef.imageUrl)}
            />
          </div>
          <div className="flex flex-col justify-center p-6 md:p-10 lg:p-12">
            <h1 className="text-center font-display text-3xl font-semibold tracking-[0.06em] text-white md:text-left md:text-4xl">
              {chef.name}
            </h1>
            <div className="mt-5 flex flex-wrap justify-center gap-2 md:justify-start">
              {chef.cuisines.map((tag) => (
                <span
                  key={tag}
                  className="rounded border border-[#6e0f1f]/50 bg-black/30 px-2.5 py-1 text-[11px] uppercase tracking-wider text-[#e8d48b]/95"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-8 border-t border-white/10 pt-8">
              <p className="text-[15px] leading-[1.65] text-white/88 whitespace-pre-wrap">{chef.description}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
