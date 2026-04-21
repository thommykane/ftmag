import Image from "next/image";
import Link from "next/link";
import { CUISINE_FILTERS } from "@/data/chefs";
import type { ChefDTO } from "@/lib/chefs/queries";
import { cuisineLabelToSlug } from "@/lib/chefs/cuisineSlug";

function linkClass(active: boolean) {
  return `w-full rounded border px-2.5 py-2 text-left text-[11px] uppercase tracking-[0.1em] transition ${
    active
      ? "border-[#c9a227]/70 bg-white/10 text-white"
      : "border-transparent text-white/75 hover:border-white/15 hover:bg-white/5"
  }`;
}

function portraitUnoptimized(url: string) {
  return url.includes("blob.vercel-storage.com");
}

export function TopChefsClient({
  chefs,
  activeCuisine,
}: {
  chefs: ChefDTO[];
  activeCuisine: string | null;
}) {
  return (
    <div className="animate-panel-in space-y-4 pb-8">
      <header className="space-y-2">
        <h1 className="font-display text-3xl font-semibold tracking-[0.06em] text-white md:text-4xl">Top Chefs</h1>
        <p className="max-w-3xl text-[15px] leading-relaxed text-white/85">
          A curated selection of celebrated chefs organized by specialty cuisine. Explore profiles, signature styles, and
          inspiration tailored to the flavors you love — portrait photos via{" "}
          <a
            href="https://commons.wikimedia.org/"
            className="text-[#c9a227] underline decoration-[#c9a227]/40 underline-offset-2 hover:decoration-[#c9a227]"
            target="_blank"
            rel="noreferrer"
          >
            Wikimedia Commons
          </a>{" "}
          where applicable.
        </p>
      </header>

      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,240px)_1fr] lg:items-start">
        <aside className="ftmag-panel rounded-lg p-3 lg:sticky lg:top-4 lg:max-h-[calc(100dvh-5rem)] lg:overflow-y-auto lg:pr-1">
          <h2 className="border-b border-[#6e0f1f]/45 pb-2 font-electrolize text-[11px] font-normal uppercase tracking-[0.28em] text-white/90">
            Select by cuisine
          </h2>
          <ul className="scrollbar-thin mt-3 max-h-52 space-y-0.5 overflow-y-auto lg:max-h-[min(72vh,640px)]">
            <li>
              <Link href="/top-chefs" className={linkClass(activeCuisine === null)}>
                Top Chefs
              </Link>
            </li>
            {CUISINE_FILTERS.map((c) => (
              <li key={c}>
                <Link href={`/top-chefs/cuisine/${cuisineLabelToSlug(c)}`} className={linkClass(activeCuisine === c)}>
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <div>
          {chefs.length === 0 ? (
            <div className="ftmag-panel rounded-lg p-8 text-center text-white/70">
              No chefs in this category yet. Try another cuisine or view all.
            </div>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {chefs.map((chef) => (
                <li key={chef.id}>
                  <article className="ftmag-panel flex h-full flex-col overflow-hidden rounded-lg">
                    <div className="relative aspect-[4/5] w-full bg-black/40">
                      <Image
                        src={chef.imageUrl}
                        alt={chef.name}
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        unoptimized={portraitUnoptimized(chef.imageUrl)}
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-2 p-4">
                      <h2 className="font-display text-xl font-semibold tracking-wide text-white">{chef.name}</h2>
                      <p className="line-clamp-4 flex-1 text-[14px] leading-relaxed text-white/85">{chef.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {chef.cuisines.map((tag) => (
                          <span
                            key={tag}
                            className="rounded border border-[#6e0f1f]/50 bg-black/30 px-2 py-0.5 text-[10px] uppercase tracking-wider text-[#e8d48b]/95"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <Link
                        href={`/top-chefs/${chef.slug}`}
                        className="mt-1 inline-flex w-fit items-center rounded border-2 border-[#c9a227] bg-[#6E0F1F] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#5a0c19]"
                      >
                        Read more
                      </Link>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
