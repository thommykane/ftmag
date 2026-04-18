import type { Metadata } from "next";
import { SeasonalCategoryTabs } from "@/components/seasonal-travel/SeasonalCategoryTabs";
import { SeasonalPostCard } from "@/components/seasonal-travel/SeasonalPostCard";
import { fetchSeasonalPosts } from "@/lib/wordpress/fetchPosts";
import { SEASONAL_TAB_ORDER, type SeasonalTabSlug } from "@/lib/wordpress/seasonalCategories";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Seasonal Travel & Vacation Spots | Food & Travel Magazine",
  description: "Seasonal guides, editorials, and interviews — travel and dining through the year.",
};

function parseCat(param: string | string[] | undefined): "all" | SeasonalTabSlug {
  const raw = Array.isArray(param) ? param[0] : param;
  if (!raw) return "all";
  const lower = raw.toLowerCase();
  if (SEASONAL_TAB_ORDER.includes(lower as SeasonalTabSlug)) return lower as SeasonalTabSlug;
  return "all";
}

type Props = { searchParams: { cat?: string } };

export default async function SeasonalTravelPage({ searchParams }: Props) {
  const filter = parseCat(searchParams.cat);
  const result = await fetchSeasonalPosts(filter);

  return (
    <div className="mx-auto w-full max-w-3xl px-2 pb-20 pt-6 md:px-4 md:pt-4">
      <div className="rounded-2xl bg-white px-4 py-8 text-zinc-900 shadow-[0_2px_40px_rgba(0,0,0,0.12)] sm:px-8 sm:py-10 md:px-12">
        <header className="mb-8 border-b border-zinc-200 pb-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#6E0F1F]">Food &amp; Travel Magazine</p>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-wide text-zinc-900 md:text-4xl">
            Seasonal travel &amp; vacation spots
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-600">
            Stories from our editors — newest first. Filter by season or story type. Posts load from our WordPress library.
          </p>
        </header>

        <SeasonalCategoryTabs active={filter} />

        {!result.ok ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-5 text-sm leading-relaxed text-amber-950">
            <p className="font-semibold">Could not load posts</p>
            <p className="mt-2">{result.error}</p>
          </div>
        ) : result.posts.length === 0 ? (
          <p className="text-center text-sm text-zinc-500">
            No posts in this view yet. Publish posts in WordPress and assign categories (Spring, Summer, etc.).
          </p>
        ) : (
          <div className="space-y-2">
            {result.posts.map((post) => (
              <SeasonalPostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
