import Link from "next/link";
import type { SeasonalFeedPost } from "@/lib/wordpress/mapPost";
import { categoryAccentClass } from "./categoryAccent";

function InitialsThumb({ title }: { title: string }) {
  const ch = title.trim().charAt(0).toUpperCase() || "•";
  return (
    <div
      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-gradient-to-br from-zinc-100 to-zinc-200 text-lg font-semibold text-zinc-600"
      aria-hidden
    >
      {ch}
    </div>
  );
}

export function SeasonalPostCard({ post }: { post: SeasonalFeedPost }) {
  const accent = categoryAccentClass(post.categorySlug);
  return (
    <article className="border-b border-zinc-200 pb-10 pt-2 last:border-0">
      <div className="mb-4 flex flex-wrap items-start gap-4">
        {post.thumbUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- WordPress / Gravatar hosts vary; avoid brittle remotePatterns.
          <img
            src={post.thumbUrl}
            alt={post.thumbAlt}
            width={56}
            height={56}
            className="h-14 w-14 shrink-0 rounded-full object-cover ring-1 ring-zinc-200"
            loading="lazy"
          />
        ) : (
          <InitialsThumb title={post.title} />
        )}
        <div className="min-w-0 flex-1">
          <p className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${accent}`}>
            {post.categoryLabel}
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold uppercase leading-tight tracking-[0.02em] text-zinc-900 md:text-[1.65rem]">
            {post.title}
          </h2>
        </div>
      </div>

      {post.featuredImageUrl ? (
        <Link href={post.href} className="group block overflow-hidden rounded-lg ring-1 ring-zinc-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.featuredImageUrl}
            alt={post.featuredAlt}
            width={1200}
            height={675}
            className="aspect-video w-full object-cover transition duration-500 group-hover:scale-[1.02]"
            loading="lazy"
          />
        </Link>
      ) : null}

      {post.excerpt ? (
        <p className="mt-5 text-[15px] leading-relaxed text-zinc-700">{post.excerpt}</p>
      ) : null}

      <Link
        href={post.href}
        className="mt-4 inline-block text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6E0F1F] underline-offset-4 transition hover:text-[#c9a227]"
      >
        Read more »
      </Link>
    </article>
  );
}
