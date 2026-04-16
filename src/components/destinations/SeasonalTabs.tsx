"use client";

import { useState } from "react";
import type { SeasonalBreakdown } from "@/types/stateDestination";

const SEASONS = [
  { key: "spring" as const, label: "Spring" },
  { key: "summer" as const, label: "Summer" },
  { key: "fall" as const, label: "Fall" },
  { key: "winter" as const, label: "Winter" },
];

export function SeasonalTabs({ breakdown }: { breakdown: SeasonalBreakdown }) {
  const [active, setActive] = useState<(typeof SEASONS)[number]["key"]>("spring");

  return (
    <div className="ftmag-panel rounded-xl p-5 md:p-6">
      <header className="ftmag-panel__header mb-5 pb-3">
        <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-[#e8d48b]">Seasonal breakdown</h2>
        <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/45">When the landscape shifts character</p>
      </header>

      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
        {SEASONS.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setActive(s.key)}
            className={`rounded-md border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition ${
              active === s.key
                ? "border-[#c9a227] bg-[#6E0F1F]/80 text-[#e8d48b] shadow-[0_0_20px_rgba(201,162,39,0.15)]"
                : "border-transparent bg-white/5 text-white/60 hover:border-white/20 hover:text-white/90"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div
        key={active}
        className="animate-panel-in mt-5 text-sm leading-relaxed text-white/85 md:text-base"
      >
        {breakdown[active]}
      </div>
    </div>
  );
}
