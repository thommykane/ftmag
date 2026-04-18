import type { ThingsToExploreCounts } from "@/types/stateDestination";

const ROWS: { key: keyof ThingsToExploreCounts; label: string }[] = [
  { key: "counties", label: "Counties" },
  { key: "cities", label: "Cities" },
  { key: "touristAttractions", label: "Tourist Attractions" },
  { key: "nationalParks", label: "National Parks" },
  { key: "monumentsLandmarks", label: "Monuments & Landmarks" },
  { key: "publicBeaches", label: "Public Beaches" },
];

export function ThingsToExplorePanel({
  counts,
  rankedRestaurantCount,
  className = "",
}: {
  counts: ThingsToExploreCounts;
  rankedRestaurantCount: number;
  className?: string;
}) {
  return (
    <div className={`ftmag-panel min-w-0 flex-1 rounded-xl border border-[#c9a227]/20 p-4 md:p-5 ${className}`}>
      <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#e8d48b]">
        Things to explore
      </h2>
      <dl className="space-y-2 text-sm">
        {ROWS.map(({ key, label }) => (
          <div key={key} className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-2 last:border-0 last:pb-0">
            <dt className="text-[11px] text-white/75">{label}</dt>
            <dd className="shrink-0 tabular-nums text-xs font-medium text-white">({counts[key]})</dd>
          </div>
        ))}
        <div className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-2 pt-1 last:border-0 last:pb-0">
          <dt className="text-[11px] text-white/75">Ranked Restaurants</dt>
          <dd className="shrink-0 tabular-nums text-xs font-medium text-white">({rankedRestaurantCount})</dd>
        </div>
      </dl>
    </div>
  );
}
