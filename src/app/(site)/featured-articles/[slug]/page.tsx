import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FeaturedArticleBody } from "@/components/seasonal-travel/FeaturedArticleBody";
import { categoryAccentClass } from "@/components/seasonal-travel/categoryAccent";
import { fetchWordPressPostBySlug } from "@/lib/wordpress/fetchPostBySlug";

export const revalidate = 120;

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = decodeURIComponent(params.slug);
  const result = await fetchWordPressPostBySlug(slug);
  if (!result.ok) {
    return { title: "Article | Food & Travel Magazine" };
  }
  const { post } = result;
  return {
    title: `${post.title} | Food & Travel Magazine`,
    description: post.excerpt.slice(0, 160),
    openGraph: post.featuredImageUrl
      ? { images: [{ url: post.featuredImageUrl }] }
      : undefined,
  };
}

export default async function FeaturedArticlePage({ params }: Props) {
  const slug = decodeURIComponent(params.slug);
  const result = await fetchWordPressPostBySlug(slug);

  if (!result.ok) {
    if (result.notFound) notFound();
    return (
      <div className="w-full max-w-none min-w-0 -mr-2 self-stretch pb-20 pt-4">
        <div className="w-full bg-white px-4 py-8 text-left text-zinc-900 sm:px-8 md:px-12">
          <p className="text-sm text-red-800">{result.error}</p>
        </div>
      </div>
    );
  }

  const { post } = result;
  const accent = categoryAccentClass(post.categorySlug);
  const dateLabel = new Date(post.dateIso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="w-full max-w-none min-w-0 -mr-2 self-stretch pb-20 pt-4 md:pt-4">
      <article className="w-full bg-white pl-3 pr-4 py-8 text-left text-zinc-900 shadow-[0_2px_40px_rgba(0,0,0,0.12)] sm:pl-5 sm:pr-8 sm:py-10 md:pl-6 md:pr-12 lg:pl-8 lg:pr-16">
        <Link
          href="/featured-articles"
          className="inline-flex text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6E0F1F] transition hover:text-[#c9a227]"
        >
          ← Featured articles
        </Link>

        <header className="mt-6 border-b border-zinc-200 pb-8">
          <p className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${accent}`}>{post.categoryLabel}</p>
          <h1 className="mt-3 max-w-4xl font-display text-3xl font-semibold uppercase leading-tight tracking-wide text-zinc-900 md:text-4xl lg:text-[2.35rem]">
            {post.title}
          </h1>
          <p className="mt-3 text-xs uppercase tracking-[0.18em] text-zinc-500">{dateLabel}</p>
        </header>

        {post.featuredImageUrl ? (
          <div className="mt-8 overflow-hidden rounded-lg ring-1 ring-zinc-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.featuredImageUrl}
              alt={post.featuredAlt}
              width={1400}
              height={788}
              className="aspect-video w-full object-cover"
              loading="eager"
            />
          </div>
        ) : null}

        <div className="mt-10">
          <FeaturedArticleBody html={post.bodyHtml} />
        </div>

        <footer className="mt-12 border-t border-zinc-200 pt-6">
          <p className="text-[11px] text-zinc-500">
            Original permalink:{" "}
            <a href={post.canonicalUrl} className="text-[#6E0F1F] underline underline-offset-2 hover:text-[#c9a227]">
              {(() => {
                try {
                  return new URL(post.canonicalUrl).hostname;
                } catch {
                  return "WordPress";
                }
              })()}
            </a>
          </p>
        </footer>
      </article>
    </div>
  );
}
