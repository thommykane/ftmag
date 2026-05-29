import Link from "next/link";
import type {
  HomeArticleSpotlight,
  HomeChefSpotlight,
  HomeDestinationSpotlight,
  HomeMagazineSpotlight,
  HomeRecipeSpotlight,
  HomeRestaurantSpotlight,
} from "@/lib/homepage/getHomePageContent";

const panel =
  "ftmag-panel overflow-hidden rounded-xl border border-[#c9a227]/20 shadow-[0_8px_28px_rgba(0,0,0,0.32)]";

const ctaClass =
  "inline-flex w-fit items-center gap-1.5 rounded border border-[#c9a227]/45 bg-[#6E0F1F]/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#f5e6a8] transition hover:border-[#c9a227]";

export function HomeMagazineHero({ magazine }: { magazine: HomeMagazineSpotlight }) {
  return (
    <section className={`${panel} grid gap-0 lg:grid-cols-[minmax(220px,340px)_1fr]`}>
      <Link href={magazine.href} className="group relative block bg-black/40 p-4 lg:p-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={magazine.coverSrc}
          alt={magazine.displayTitle}
          className="mx-auto aspect-[3/4] w-full max-w-[280px] object-cover object-top shadow-[0_12px_40px_rgba(0,0,0,0.55)] transition duration-500 group-hover:scale-[1.02]"
        />
      </Link>
      <div className="flex flex-col justify-center border-t border-white/10 p-5 lg:border-l lg:border-t-0 lg:p-7">
        <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[#e8d48b]/85">Our Magazine</p>
        <h2 className="mt-2 font-display text-2xl font-semibold leading-tight text-white md:text-3xl">
          {magazine.displayTitle}
        </h2>
        {magazine.releaseLabel ? (
          <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-[#c9a227]/80">{magazine.releaseLabel}</p>
        ) : null}
        {magazine.blurb ? (
          <p className="mt-4 line-clamp-5 text-sm leading-relaxed text-white/72">{magazine.blurb}</p>
        ) : null}
        <Link href={magazine.href} className={`${ctaClass} mt-5`}>
          Read issue <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}

export function HomeChefTile({ chef, eyebrow }: { chef: HomeChefSpotlight; eyebrow: string }) {
  return (
    <section className={`${panel} flex h-full flex-col`}>
      <div className="relative aspect-[5/4] w-full overflow-hidden sm:aspect-[16/10]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={chef.imageUrl} alt={chef.name} className="h-full w-full object-cover object-top" loading="lazy" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </div>
      <div className="flex flex-1 flex-col p-4 md:p-5">
        <p className="text-[10px] uppercase tracking-[0.28em] text-[#e8d48b]/80">{eyebrow}</p>
        <h3 className="mt-1.5 font-display text-xl font-semibold text-white">{chef.name}</h3>
        {chef.cuisines.length > 0 ? (
          <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-[#c9a227]/75">
            {chef.cuisines.slice(0, 3).join(" · ")}
          </p>
        ) : null}
        {chef.description ? <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-white/68">{chef.description}</p> : null}
        <Link href={chef.href} className={`${ctaClass} mt-auto pt-4`}>
          Profile <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}

export function HomeDestinationTile({
  destination,
  eyebrow,
}: {
  destination: HomeDestinationSpotlight;
  eyebrow: string;
}) {
  return (
    <section className={`${panel} flex h-full flex-col`}>
      <div className="relative aspect-[5/4] w-full overflow-hidden sm:aspect-[16/10]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={destination.imageUrl}
          alt={destination.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
      </div>
      <div className="flex flex-1 flex-col p-4 md:p-5">
        <p className="text-[10px] uppercase tracking-[0.28em] text-[#e8d48b]/80">{eyebrow}</p>
        <h3 className="mt-1.5 font-display text-xl font-semibold text-white">{destination.name}</h3>
        {destination.tagline ? (
          <p className="mt-2 line-clamp-2 font-display text-sm italic text-white/82">{destination.tagline}</p>
        ) : null}
        {destination.synopsis ? (
          <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-white/68">{destination.synopsis}</p>
        ) : null}
        <Link href={destination.href} className={`${ctaClass} mt-auto pt-4`}>
          Explore <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}

export function HomeArticleTile({ article, eyebrow }: { article: HomeArticleSpotlight; eyebrow: string }) {
  return (
    <section className={`${panel} flex flex-col sm:flex-row`}>
      {article.imageUrl ? (
        <Link href={article.href} className="relative block w-full shrink-0 sm:w-[42%] lg:w-[38%]">
          <div className="aspect-[16/10] h-full min-h-[180px] w-full overflow-hidden sm:min-h-[220px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={article.imageUrl} alt={article.title} className="h-full w-full object-cover" loading="lazy" />
          </div>
        </Link>
      ) : null}
      <div className="flex min-w-0 flex-1 flex-col justify-center p-4 md:p-5">
        <p className="text-[10px] uppercase tracking-[0.28em] text-[#e8d48b]/80">{eyebrow}</p>
        {article.categoryLabel ? (
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#c9a227]/75">
            {article.categoryLabel}
          </p>
        ) : null}
        <h3 className="mt-2 font-display text-xl font-semibold leading-snug text-white md:text-2xl">{article.title}</h3>
        {article.excerpt ? (
          <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-white/70">{article.excerpt}</p>
        ) : null}
        <Link href={article.href} className={`${ctaClass} mt-4`}>
          Read more <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}

/** Compact square tile — thumbnail stays fixed, never stretched full-width. */
export function HomeRestaurantCompact({
  restaurant,
  eyebrow,
  subtitle,
}: {
  restaurant: HomeRestaurantSpotlight;
  eyebrow: string;
  subtitle?: string;
}) {
  return (
    <section className={`${panel} flex flex-col`}>
      <Link href={restaurant.href} className="group block p-4 pb-0">
        <div className="mx-auto aspect-square w-full max-w-[168px] overflow-hidden rounded-lg border border-[#c9a227]/30 bg-black/40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={restaurant.imageUrl}
            alt={restaurant.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-4 pt-3 text-center">
        <p className="text-[9px] uppercase tracking-[0.24em] text-[#e8d48b]/75">{eyebrow}</p>
        {subtitle ? (
          <p className="mt-0.5 text-[9px] uppercase tracking-[0.16em] text-[#c9a227]/70">{subtitle}</p>
        ) : null}
        <h3 className="mt-2 font-display text-base font-semibold leading-snug text-white">{restaurant.name}</h3>
        <p className="mt-1 text-[11px] text-white/55">
          {restaurant.city}
          {restaurant.rank != null ? ` · #${restaurant.rank}` : ""}
        </p>
        <Link href={restaurant.href} className={`${ctaClass} mx-auto mt-3`}>
          View <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}

export function HomeRecipePlaceholder({ recipe }: { recipe: HomeRecipeSpotlight }) {
  return (
    <section className={`${panel} border-dashed border-white/15 bg-black/20`}>
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
        <div className="mx-auto aspect-square w-[100px] shrink-0 overflow-hidden rounded-md border border-white/10 bg-[#1a1014] sm:mx-0">
          {recipe.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={recipe.imageUrl} alt="" className="h-full w-full object-cover opacity-80" />
          ) : (
            <div className="flex h-full items-center justify-center text-[8px] uppercase tracking-wider text-white/30">
              Soon
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1 text-center sm:text-left">
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#e8d48b]/70">{recipe.title}</p>
          <p className="mt-2 text-xs leading-relaxed text-white/45">
            Recipe spotlight coming soon.{" "}
            <Link href="/magazines" className="text-[#e8d48b]/85 underline">
              Browse magazines
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
