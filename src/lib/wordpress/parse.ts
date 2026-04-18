export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function decodeWpEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
}

/** ~25–40 words for card excerpts */
export function excerptWords(text: string, maxWords = 36): string {
  const t = text.trim();
  if (!t) return "";
  const words = t.split(/\s+/);
  if (words.length <= maxWords) return t;
  return `${words.slice(0, maxWords).join(" ")}…`;
}
