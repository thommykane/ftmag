import type { RestaurantDTO } from "@/lib/restaurantPublic";
import { RestaurantRowState } from "@/components/restaurants/RestaurantRowCells";

export function StateEatSection({
  stateName,
  restaurants,
}: {
  stateName: string;
  restaurants: RestaurantDTO[];
}) {
  if (restaurants.length === 0) {
    return (
      <section className="ftmag-panel rounded-xl p-6 md:p-8">
        <header className="mb-6 border-b border-[#c9a227]/20 pb-4">
          <h2 className="text-lg font-bold uppercase tracking-[0.12em] text-white">Eat</h2>
          <p className="mt-2 text-xs text-white/55">
            Top dining picks for {stateName} will appear here once assigned in admin.
          </p>
        </header>
      </section>
    );
  }

  const display = restaurants.slice(0, 8);

  return (
    <section className="ftmag-panel rounded-xl p-4 md:p-8">
      <header className="mb-6 border-b border-[#c9a227]/20 pb-4">
        <h2 className="text-lg font-bold uppercase tracking-[0.12em] text-white">Eat</h2>
        <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-white/45">
          Signature tables — national rank stays in sync with the master list
        </p>
      </header>

      <div className="mb-3 hidden gap-2 border-b border-white/10 pb-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#e8d48b]/70 sm:grid sm:grid-cols-[75px_minmax(160px,1.4fr)_minmax(72px,0.75fr)_minmax(80px,0.85fr)_minmax(88px,1fr)_48px_minmax(72px,0.65fr)] sm:px-1">
        <span />
        <span>Restaurant</span>
        <span>Cuisine</span>
        <span>Chef / owner</span>
        <span>Awards</span>
        <span className="text-center">Rank</span>
        <span>Book</span>
      </div>

      <ul className="space-y-3">
        {display.map((r) => (
          <li key={r.id}>
            <RestaurantRowState r={r} />
          </li>
        ))}
      </ul>
    </section>
  );
}
