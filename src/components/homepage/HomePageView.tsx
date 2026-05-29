import Link from "next/link";
import type { HomePageContent } from "@/lib/homepage/getHomePageContent";
import { HomeSectionCard } from "./HomeSectionCard";

type Props = {
  content: HomePageContent;
};

export function HomePageView({ content }: Props) {
  const { config, restaurant, chef, destination, article, recipe } = content;

  return (
    <div className="space-y-6 pb-8 animate-panel-in md:space-y-8">
      <header className="ftmag-panel rounded-xl border border-[#c9a227]/15 p-5 md:p-7">
        <p className="text-[10px] uppercase tracking-[0.38em] text-[#e8d48b]/80">Food &amp; Travel Magazine</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-[0.06em] text-white md:text-4xl">
          Eat. Stay. Explore.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/75 md:text-[15px]">
          Curated journeys in taste, place, and craft — summer picks from our national restaurant list, chef profiles,
          destination dossiers, and the latest from our editorial desk.
        </p>
      </header>

      {restaurant ? (
        <HomeSectionCard
          eyebrow={config.restaurantTitle}
          title={restaurant.name}
          subtitle={config.restaurantSubtitle}
          href={restaurant.href}
          ctaLabel="View restaurant"
          imageUrl={restaurant.imageUrl}
          imageAlt={restaurant.name}
          imagePosition="left"
        >
          <p>
            {restaurant.city}
            {restaurant.stateSlug ? ` · ${restaurant.stateSlug.replace(/-/g, " ")}` : ""}
            {restaurant.rank != null ? ` · National #${restaurant.rank}` : ""}
          </p>
          {restaurant.cuisine ? <p className="text-white/60">{restaurant.cuisine}</p> : null}
          {restaurant.headChef ? <p>Chef {restaurant.headChef}</p> : null}
          {restaurant.awards && restaurant.awards !== "—" ? (
            <p className="text-[#e8d48b]/90">{restaurant.awards}</p>
          ) : null}
        </HomeSectionCard>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        {chef ? (
          <HomeSectionCard
            eyebrow={config.chefTitle}
            title={chef.name}
            href={chef.href}
            ctaLabel="Chef profile"
            imageUrl={chef.imageUrl}
            imageAlt={chef.name}
            imagePosition="top"
          >
            {chef.cuisines.length > 0 ? (
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#c9a227]/75">
                {chef.cuisines.join(" · ")}
              </p>
            ) : null}
            {chef.description ? <p>{chef.description}</p> : null}
          </HomeSectionCard>
        ) : null}

        {destination ? (
          <HomeSectionCard
            eyebrow={config.destinationTitle}
            title={destination.name}
            href={destination.href}
            ctaLabel="Open destination"
            imageUrl={destination.imageUrl}
            imageAlt={destination.name}
            imagePosition="top"
          >
            {destination.tagline ? (
              <p className="font-display text-base italic text-white/85">{destination.tagline}</p>
            ) : null}
            {destination.synopsis ? <p>{destination.synopsis}</p> : null}
          </HomeSectionCard>
        ) : null}
      </div>

      {article ? (
        <HomeSectionCard
          eyebrow={config.articleTitle}
          title={article.title}
          href={article.href}
          ctaLabel="Read more"
          imageUrl={article.imageUrl}
          imageAlt={article.title}
          imagePosition="right"
        >
          {article.categoryLabel ? (
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#c9a227]/80">
              {article.categoryLabel}
            </p>
          ) : null}
          {article.excerpt ? <p>{article.excerpt}</p> : null}
        </HomeSectionCard>
      ) : (
        <section className="ftmag-panel rounded-xl border border-white/10 p-5 md:p-6">
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#e8d48b]/75">{config.articleTitle}</p>
          <p className="mt-2 text-sm text-white/55">
            Latest story will appear here when the CMS feed is reachable. Browse{" "}
            <Link href="/featured-articles" className="text-[#e8d48b] underline">
              featured articles
            </Link>
            .
          </p>
        </section>
      )}

      {recipe ? (
        recipe.isPlaceholder ? (
          <section className="ftmag-panel overflow-hidden rounded-xl border border-dashed border-white/15 bg-black/20">
            <div className="grid gap-0 md:grid-cols-[280px_1fr]">
              <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-gradient-to-br from-[#1a1014] to-[#2a1520] md:aspect-auto md:min-h-[220px]">
                {recipe.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={recipe.imageUrl}
                    alt="Latest magazine cover"
                    className="h-full w-full object-cover opacity-90"
                  />
                ) : (
                  <p className="px-6 text-center text-[10px] uppercase tracking-[0.28em] text-white/35">
                    Recipe image coming soon
                  </p>
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute left-3 top-3 rounded border border-white/20 bg-black/50 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-white/70">
                  Coming soon
                </span>
              </div>
              <div className="flex flex-col justify-center p-5 md:p-7">
                <p className="text-[10px] uppercase tracking-[0.32em] text-[#e8d48b]/75">{recipe.title}</p>
                <p className="mt-3 text-sm leading-relaxed text-white/50">
                  We&apos;re preparing our weekly recipe spotlight. Browse{" "}
                  <Link href="/magazines" className="text-[#e8d48b]/90 underline">
                    the latest magazine
                  </Link>{" "}
                  for kitchen inspiration in the meantime.
                </p>
              </div>
            </div>
          </section>
        ) : (
          <HomeSectionCard
            eyebrow="Kitchen"
            title={recipe.title}
            href={recipe.href || undefined}
            ctaLabel="Get the recipe"
            imageUrl={recipe.imageUrl}
            imageAlt={recipe.title}
            imagePosition="left"
          >
            {recipe.blurb ? <p>{recipe.blurb}</p> : null}
          </HomeSectionCard>
        )
      ) : null}

      <footer className="grid gap-4 sm:grid-cols-3">
        <QuickLink href="/top-restaurants" label="Top restaurants" />
        <QuickLink href="/top-chefs" label="Top chefs" />
        <QuickLink href="/top-destinations" label="Top destinations" />
      </footer>
    </div>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="ftmag-panel rounded-lg border border-white/10 px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-[#e8d48b]/90 transition hover:border-[#c9a227]/40 hover:text-white"
    >
      {label}
    </Link>
  );
}
