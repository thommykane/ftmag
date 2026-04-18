import Link from "next/link";
import { SEASONAL_TAB_ORDER, tabLabel, type SeasonalTabSlug } from "@/lib/wordpress/seasonalCategories";

const BASE = "/featured-articles";

const TAB_STYLE: Record<"all" | SeasonalTabSlug, { idle: string; active: string }> = {
  all: {
    idle: "bg-zinc-200 text-zinc-900",
    active: "bg-zinc-800 text-white",
  },
  spring: {
    idle: "bg-[#b8e0c8] text-[#0f3328]",
    active: "bg-emerald-800 text-white",
  },
  summer: {
    idle: "bg-[#fde68a] text-[#713f12]",
    active: "bg-amber-600 text-amber-950",
  },
  fall: {
    idle: "bg-[#fdba74] text-[#7c2d12]",
    active: "bg-orange-700 text-white",
  },
  winter: {
    idle: "bg-[#bae6fd] text-[#0c4a6e]",
    active: "bg-sky-800 text-white",
  },
  foodie: {
    idle: "bg-[#f5d0d5] text-[#4a121c]",
    active: "bg-[#6E0F1F] text-[#fdf2f4]",
  },
  editorials: {
    idle: "bg-[#d4d4d8] text-[#27272a]",
    active: "bg-zinc-700 text-white",
  },
  interviews: {
    idle: "bg-[#fbcfe8] text-[#831843]",
    active: "bg-pink-800 text-white",
  },
};

export function SeasonalCategoryTabs({ active }: { active: "all" | SeasonalTabSlug }) {
  const tabs: { id: "all" | SeasonalTabSlug; label: string }[] = [
    { id: "all", label: "All posts" },
    ...SEASONAL_TAB_ORDER.map((id) => ({ id, label: tabLabel(id) })),
  ];

  return (
    <nav
      className="mb-10 w-full border border-zinc-400 bg-zinc-400"
      aria-label="Filter by category"
    >
      <ul className="grid w-full grid-cols-2 gap-px sm:grid-cols-4 lg:grid-cols-8">
        {tabs.map((t) => {
          const href = t.id === "all" ? BASE : `${BASE}?cat=${t.id}`;
          const isOn = active === t.id;
          const palette = TAB_STYLE[t.id];
          return (
            <li key={t.id} className="min-w-0">
              <Link
                href={href}
                scroll={false}
                className={`flex min-h-[2.75rem] w-full items-center justify-center px-2 py-2.5 text-center text-[10px] font-bold uppercase leading-snug tracking-[0.1em] transition sm:text-[11px] ${
                  isOn ? palette.active : `${palette.idle} hover:brightness-[0.96]`
                }`}
              >
                {t.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
