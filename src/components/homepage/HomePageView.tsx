import Link from "next/link";
import type { ReactNode } from "react";
import type { HomePageContent } from "@/lib/homepage/getHomePageContent";
import {
  HomeArticleTile,
  HomeChefCompact,
  HomeDestinationTile,
  HomeMagazineHero,
  HomeRecipeCompact,
  HomeRestaurantCompact,
} from "./HomePageTiles";

type Props = {
  content: HomePageContent;
};

function EmptySlot({ eyebrow, message }: { eyebrow: string; message: ReactNode }) {
  return (
    <section className="ftmag-panel flex h-full min-h-[200px] flex-col justify-center rounded-xl border border-dashed border-white/15 bg-black/20 p-4 text-center">
      <p className="text-[10px] uppercase tracking-[0.24em] text-[#e8d48b]/70">{eyebrow}</p>
      <p className="mt-2 text-xs text-white/45">{message}</p>
    </section>
  );
}

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

      {/* Row 1 — magazine */}
      {magazine ? <HomeMagazineHero magazine={magazine} /> : null}

      {/* Row 2 — vacation spot (left) · latest article (right) */}
      <div className="grid gap-4 md:grid-cols-2 md:gap-5 md:items-stretch">
        {destination ? (
          <HomeDestinationTile destination={destination} eyebrow={config.destinationTitle} compact />
        ) : (
          <EmptySlot eyebrow={config.destinationTitle} message="Destination loading…" />
        )}
        {article ? (
          <HomeArticleTile article={article} eyebrow={config.articleTitle} stacked />
        ) : (
          <EmptySlot
            eyebrow={config.articleTitle}
            message={
              <>
                Latest story from the CMS will appear here.{" "}
                <Link href="/featured-articles" className="text-[#e8d48b] underline">
                  Featured articles
                </Link>
              </>
            }
          />
        )}
      </div>

      {/* Row 3 — chef · restaurant · recipe (compact) */}
      <div className="grid gap-4 sm:grid-cols-3 md:gap-5 md:items-stretch">
        {chef ? (
          <HomeChefCompact chef={chef} eyebrow={config.chefTitle} />
        ) : (
          <EmptySlot eyebrow={config.chefTitle} message="Chef profile loading…" />
        )}
        {restaurant ? (
          <HomeRestaurantCompact
            restaurant={restaurant}
            eyebrow={config.restaurantTitle}
            subtitle={config.restaurantSubtitle}
          />
        ) : (
          <EmptySlot eyebrow={config.restaurantTitle} message="Restaurant pick loading…" />
        )}
        {recipe && config.recipeEnabled ? (
          <HomeRecipeCompact recipe={recipe} />
        ) : (
          <EmptySlot eyebrow={config.recipeTitle} message="Recipe coming soon" />
        )}
      </div>

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
