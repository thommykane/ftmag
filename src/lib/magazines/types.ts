export type MagazineIssue = {
  slug: string;
  displayTitle: string;
  /** ISO date YYYY-MM-DD for sorting */
  releaseDate: string;
  releaseLabel: string;
  blurb: string;
  coverSrc: string;
  pdfSrc: string;
  /** FlipHTML5 / branded digital edition URL; empty = no modal reader */
  flipbookUrl: string;
  /** Stripe or store URL for the Purchase issue button; null = disabled */
  purchaseUrl: string | null;
  /** Subscribe CTA; null = disabled */
  subscribeUrl: string | null;
};
