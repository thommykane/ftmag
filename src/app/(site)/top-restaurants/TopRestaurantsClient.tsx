"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { COUNTRY_OPTIONS } from "@/data/countries";
import type { RestaurantDTO } from "@/lib/restaurantPublic";
import { RestaurantRowNational } from "@/components/restaurants/RestaurantRowCells";

type Props = {
  restaurants: RestaurantDTO[];
  filterOptions: { cuisines: string[]; stateSlugs: string[]; countries: string[] };
};

export function TopRestaurantsClient({ restaurants, filterOptions }: Props) {
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
          Showing {filtered.length} of {restaurants.length} ranked restaurants
        </p>
      </div>

      <div className="mb-3 hidden gap-2 border-b border-white/10 pb-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#e8d48b]/70 sm:grid sm:grid-cols-[40px_75px_minmax(160px,1.4fr)_minmax(72px,0.75fr)_minmax(80px,0.85fr)_minmax(88px,1fr)_minmax(72px,0.65fr)] sm:px-1">
        <span>#</span>
        <span />
        <span>Restaurant</span>
        <span>Cuisine</span>
        <span>Chef / owner</span>
        <span>Awards</span>
        <span>Book</span>
      </div>

      <ul className="space-y-3">
        {filtered.map((r) => (
          <li key={r.id}>
            <RestaurantRowNational r={r} />
          </li>
        ))}
      </ul>

      {filtered.length === 0 ? (
        <p className="text-center text-sm text-white/50">No restaurants match these filters.</p>
      ) : null}

      <p className="text-center text-xs text-white/45">
        <Link href="/top-destinations" className="text-[#e8d48b]/80 underline hover:text-white">
          ← All destinations
        </Link>
      </p>
    </div>
  );
}
