export type EuropeSeedRow = {
  europeRank: number;
  name: string;
  address: string;
  phone: string;
  website: string;
  openTableUrl: string;
  cuisine: string;
  city: string;
  /** Always empty for Europe list rows (no county in UI). */
  county: string;
  citySlug: string;
  /** Country slug — URL segment `/Europe/[countySlug]/`. */
  countySlug: string;
  nameSlug: string;
  owner: string;
  headChef: string;
  awards: string;
  thumbnailUrl: string;
  country: string;
};
