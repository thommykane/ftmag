"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { COUNTRY_OPTIONS } from "@/data/countries";
import type { RestaurantDTO } from "@/lib/restaurantPublic";
import { RestaurantRowNational } from "@/components/restaurants/RestaurantRowCells";

const PAGE_SIZE = 100;

type Props = {
  restaurants: RestaurantDTO[];
  filterOptions: { cuisines: string[]; stateSlugs: string[]; countries: string[] };
  currentPage: number;
};

function pageHref(page: number): string {
  if (page <= 1) return "/top-restaurants";
  return `/top-restaurants?page=${page}`;
}

export function TopRestaurantsClient({ restaurants, filterOptions, currentPage }: Props) {
  const [country, setCountry] = useState("United States");
  const [stateSlug, setStateSlug] = useState("");
  const [cuisine, setCuisine] = useState("");

  const countryChoices = useMemo(() => {
    const s = new Set<string>([...COUNTRY_OPTIONS, ...filterOptions.countries]);
    restaurants.forEach((r) => {
      if (r.country) s.add(r.country);
    });
    return Array.from(s).sort((a, b) => {
      if (a === "United States") return -1;
      if (b === "United States") return 1;
      return a.localeCompare(b);
    });
  }, [filterOptions.countries, restaurants]);

  const filtered = useMemo(() => {
    return restaurants.filter((r) => {
      if (country && r.country !== country) return false;
      if (stateSlug && r.stateSlug !== stateSlug) return false;
      if (cuisine && r.cuisine !== cuisine) return false;
      return true;
    });
  }, [restaurants, country, stateSlug, cuisine]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(currentPage, totalPages);
  const startIdx = (page - 1) * PAGE_SIZE;
  const paged = filtered.slice(startIdx, startIdx + PAGE_SIZE);
  const rangeFrom = filtered.length === 0 ? 0 : startIdx + 1;
  const rangeTo = filtered.length === 0 ? 0 : startIdx + paged.length;

  const pageNumbers = useMemo(() => {
    if (totalPages <= 12) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const set = new Set<number>([1, totalPages, page, page - 1, page + 1]);
    for (let i = 2; i <= 4; i++) set.add(i);
    for (let i = totalPages - 3; i < totalPages; i++) if (i > 1) set.add(i);
    return Array.from(set)
      .filter((n) => n >= 1 && n <= totalPages)
      .sort((a, b) => a - b);
  }, [totalPages, page]);

  return (
    <div className="space-y-8 animate-panel-in pb-16">
      <header className="space-y-2 px-1">
        <p className="text-[10px] uppercase tracking-[0.35em] text-[#e8d48b]/80">Eat · Stay · Explore</p>
        <h1 className="text-2xl font-semibold tracking-[0.06em] text-white md:text-3xl">Top restaurants</h1>
        <p className="max-w-prose text-sm leading-relaxed text-white/70">
          America&apos;s most compelling tables—ranked nationally. Filters update the list; rankings always follow
          the master order you maintain in admin.
        </p>
      </header>

      <div className="ftmag-panel rounded-xl p-4 md:p-6">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#e8d48b]/80">
          Filter
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="flex flex-col gap-1.5 text-xs text-white/70">
            <span className="text-[10px] uppercase tracking-[0.18em] text-white/45">Country</span>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="rounded border border-white/15 bg-black/50 px-3 py-2 text-sm text-white outline-none focus:border-[#c9a227]/50"
            >
              <option value="">All countries</option>
              {countryChoices.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-xs text-white/70">
            <span className="text-[10px] uppercase tracking-[0.18em] text-white/45">State</span>
            <select
              value={stateSlug}
              onChange={(e) => setStateSlug(e.target.value)}
              className="rounded border border-white/15 bg-black/50 px-3 py-2 text-sm text-white outline-none focus:border-[#c9a227]/50"
            >
              <option value="">All states</option>
              {filterOptions.stateSlugs.map((s) => (
                <option key={s} value={s}>
                  {s.replace(/-/g, " ")}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-xs text-white/70">
            <span className="text-[10px] uppercase tracking-[0.18em] text-white/45">Cuisine</span>
            <select
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              className="rounded border border-white/15 bg-black/50 px-3 py-2 text-sm text-white outline-none focus:border-[#c9a227]/50"
            >
              <option value="">All cuisines</option>
              {filterOptions.cuisines.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="mt-3 text-[11px] text-white/45">
          {filtered.length === restaurants.length
            ? `${restaurants.length} ranked restaurants`
            : `${filtered.length} match filters (${restaurants.length} ranked total)`}
          {filtered.length > 0 ? (
            <>
              {" "}
              · page {page} of {totalPages} ({PAGE_SIZE} per page)
            </>
          ) : null}
        </p>
      </div>

      <div className="mb-3 hidden overflow-x-auto font-sans sm:block">
        <div className="min-w-[1040px] gap-2 border-b border-white/10 pb-2 text-[11px] font-medium uppercase tracking-[0.08em] text-white/45 sm:grid sm:grid-cols-[40px_75px_minmax(176px,1.55fr)_minmax(68px,0.48fr)_minmax(68px,0.48fr)_minmax(72px,0.5fr)_minmax(64px,0.46fr)_minmax(64px,0.46fr)_minmax(84px,0.58fr)_minmax(76px,0.42fr)] sm:px-1">
          <span>#</span>
          <span />
          <span>Restaurant</span>
          <span>City</span>
          <span>County</span>
          <span>Cuisine</span>
          <span>Owner</span>
          <span>Head chef</span>
          <span>Awards</span>
          <span>OpenTable</span>
        </div>
      </div>

      <ul className="space-y-3">
        {paged.map((r) => (
          <li key={r.id}>
            <RestaurantRowNational r={r} />
          </li>
        ))}
      </ul>

      {filtered.length === 0 ? (
        <p className="text-center text-sm text-white/50">No restaurants match these filters.</p>
      ) : (
        <div className="space-y-4 border-t border-white/10 pt-6">
          <p className="text-center text-[11px] text-white/50">
            Rows {rangeFrom}–{rangeTo} of {filtered.length} (same national order as the full list)
          </p>
          <nav
            className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8"
            aria-label="Restaurant list pages"
          >
            <div className="flex items-center gap-3">
              {page > 1 ? (
                <Link
                  href={pageHref(page - 1)}
                  className="rounded border border-white/20 bg-white/[0.06] px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] text-[#e8d48b] transition hover:border-[#c9a227]/50 hover:bg-white/[0.1]"
                >
                  ← Previous {PAGE_SIZE}
                </Link>
              ) : (
                <span className="rounded border border-white/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] text-white/25">
                  ← Previous {PAGE_SIZE}
                </span>
              )}
              {page < totalPages ? (
                <Link
                  href={pageHref(page + 1)}
                  className="rounded border border-white/20 bg-white/[0.06] px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] text-[#e8d48b] transition hover:border-[#c9a227]/50 hover:bg-white/[0.1]"
                >
                  Next {PAGE_SIZE} →
                </Link>
              ) : (
                <span className="rounded border border-white/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] text-white/25">
                  Next {PAGE_SIZE} →
                </span>
              )}
            </div>
            <div className="flex max-w-full flex-wrap items-center justify-center gap-1.5">
              {pageNumbers.map((n, i) => {
                const prev = pageNumbers[i - 1];
                const showEllipsis = prev !== undefined && n - prev > 1;
                return (
                  <span key={n} className="flex items-center gap-1.5">
                    {showEllipsis ? (
                      <span className="px-1 text-[11px] text-white/35" aria-hidden>
                        …
                      </span>
                    ) : null}
                    {n === page ? (
                      <span className="min-w-[2.25rem] rounded bg-[#c9a227]/25 px-2.5 py-1.5 text-center text-xs font-semibold text-[#f5e6a8]">
                        {n}
                      </span>
                    ) : (
                      <Link
                        href={pageHref(n)}
                        className="min-w-[2.25rem] rounded border border-white/15 px-2.5 py-1.5 text-center text-xs text-white/70 transition hover:border-[#c9a227]/40 hover:text-white"
                      >
                        {n}
                      </Link>
                    )}
                  </span>
                );
              })}
            </div>
          </nav>
        </div>
      )}

      <p className="text-center text-xs text-white/45">
        <Link href="/top-destinations" className="text-[#e8d48b]/80 underline hover:text-white">
          ← All destinations
        </Link>
      </p>
    </div>
  );
}
