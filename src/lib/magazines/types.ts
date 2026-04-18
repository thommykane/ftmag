export type MagazineIssue = {
  slug: string;
  displayTitle: string;
  /** ISO date YYYY-MM-DD for sorting */
  releaseDate: string;
  releaseLabel: string;
  blurb: string;
  coverSrc: string;
  pdfSrc: string;
  /** Stripe or store URL for the Purchase issue button; null = disabled */
  purchaseUrl: string | null;
};
