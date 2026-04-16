import type { StateDestination } from "@/types/stateDestination";

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[#c9a227]/35 bg-black/40 px-2.5 py-1 text-[11px] text-white/85">
      {children}
    </span>
  );
}

function Meter({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/10 py-2 last:border-0">
      <span className="text-[10px] uppercase tracking-[0.2em] text-[#e8d48b]/55">{label}</span>
      <span className="text-right text-xs text-white/90">{value}</span>
    </div>
  );
}

export function DossierCard({ d }: { d: StateDestination }) {
  return (
    <div className="ftmag-panel rounded-xl p-5 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl">
      <header className="ftmag-panel__header mb-4 pb-3">
        <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-[#e8d48b]">Field notes</h2>
        <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/45">Travel intelligence</p>
      </header>

      <dl className="space-y-1 text-sm">
        <div className="mb-3">
          <dt className="text-[10px] uppercase tracking-[0.2em] text-white/45">Best season</dt>
          <dd className="mt-1 text-white/90">{d.bestSeason}</dd>
        </div>

        <div className="mb-3">
          <dt className="text-[10px] uppercase tracking-[0.2em] text-white/45">Ideal for</dt>
          <dd className="mt-2 flex flex-wrap gap-2">
            {d.idealFor.map((t) => (
              <Chip key={t}>{t}</Chip>
            ))}
          </dd>
        </div>

        <div className="mb-3">
          <dt className="text-[10px] uppercase tracking-[0.2em] text-white/45">Population</dt>
          <dd className="mt-1 text-white/90">{d.population}</dd>
        </div>

        <div className="mb-3">
          <dt className="text-[10px] uppercase tracking-[0.2em] text-white/45">Known for</dt>
          <dd className="mt-2 flex flex-wrap gap-2">
            {d.knownFor.map((k) => (
              <Chip key={k}>{k}</Chip>
            ))}
          </dd>
        </div>

        <div className="mb-3">
          <dt className="text-[10px] uppercase tracking-[0.2em] text-white/45">Climate</dt>
          <dd className="mt-1 text-sm leading-relaxed text-white/85">{d.climate}</dd>
        </div>

        <div className="mb-3">
          <dt className="text-[10px] uppercase tracking-[0.2em] text-white/45">Avg. cost / day</dt>
          <dd className="mt-1 font-medium text-[#e8d48b]">{d.avgCostPerDay}</dd>
        </div>

        <div className="mb-3">
          <dt className="text-[10px] uppercase tracking-[0.2em] text-white/45">Major airports</dt>
          <dd className="mt-2 space-y-1.5">
            {d.majorAirports.map((a) => (
              <p key={a} className="text-xs leading-snug text-white/80">
                {a}
              </p>
            ))}
          </dd>
        </div>

        <div className="border-t border-white/10 pt-2">
          <Meter label="Walkability" value={d.walkability} />
          <Meter label="Driveability" value={d.driveability} />
        </div>
      </dl>
    </div>
  );
}
