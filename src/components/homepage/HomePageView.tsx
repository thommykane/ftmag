import Link from "next/link";
import type { HomePageContent } from "@/lib/homepage/getHomePageContent";
import {
  HomeArticleTile,
  HomeChefTile,
  HomeDestinationTile,
  HomeMagazineHero,
  HomeRecipePlaceholder,
  HomeRestaurantCompact,
} from "./HomePageTiles";

type Props = {
  content: HomePageContent;
};

export function HomePageView({ content }: Props) {
  const { config, magazine, restaurant, chef, destination, article, recipe } = content;

  return (
    <div className="space-y-5 pb-8 animate-panel-in md:space-y-6">
      <header className="px-1">
        <p className="text-[10px] uppercase tracking-[0.38em] text-[#e8d48b]/80">Food &amp; Travel Magazine</p>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-[0.06em] text-white md:text-3xl">
          Eat. Stay. Explore.
        </h1>
      </header>

      {magazine ? <HomeMagazineHero magazine={magazine} /> : null}

      {(chef || destination) && (
        <div className="grid gap-4 md:grid-cols-2 md:gap-5">
          {chef ? <HomeChefTile chef={chef} eyebrow={config.chefTitle} /> : null}
          {destination ? <HomeDestinationTile destination={destination} eyebrow={config.destinationTitle} /> : null}
        </div>
      )}

      {(article || restaurant) && (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_200px] lg:gap-5">
          {article ? (
            <HomeArticleTile article={article} eyebrow={config.articleTitle} />
          ) : (
            <section className="ftmag-panel rounded-xl border border-white/10 p-5">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#e8d48b]/75">{config.articleTitle}</p>
              <p className="mt-2 text-sm text-white/55">
                Latest story loads from the CMS when available.{" "}
                <Link href="/featured-articles" className="text-[#e8d48b] underline">
                  Featured articles
                </Link>
              </p>
            </section>
          )}
          {restaurant ? (
            <HomeRestaurantCompact
              restaurant={restaurant}
              eyebrow={config.restaurantTitle}
              subtitle={config.restaurantSubtitle}
            />
          ) : null}
        </div>
      )}

      {recipe?.isPlaceholder ? <HomeRecipePlaceholder recipe={recipe} /> : null}

      <footer className="grid gap-3 sm:grid-cols-3">
        <QuickLink href="/magazines" label="Magazines" />
        <QuickLink href="/top-restaurants" label="Top restaurants" />
        <QuickLink href="/top-chefs" label="Top chefs" />
      </footer>
    </div>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="ftmag-panel rounded-lg border border-white/10 px-3 py-2.5 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-[#e8d48b]/90 transition hover:border-[#c9a227]/40 hover:text-white"
    >
      {label}
    </Link>
  );
}
