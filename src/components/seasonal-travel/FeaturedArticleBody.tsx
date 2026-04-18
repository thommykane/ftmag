/** Sanitized WordPress block content — typography tuned for white magazine column. */
export function FeaturedArticleBody({ html }: { html: string }) {
  if (!html.trim()) {
    return <p className="text-sm text-zinc-500">No article body returned from WordPress.</p>;
  }

  return <div className="ftmag-wp-content max-w-none" dangerouslySetInnerHTML={{ __html: html }} />;
}
