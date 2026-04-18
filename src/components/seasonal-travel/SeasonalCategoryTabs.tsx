import Link from "next/link";
import { SEASONAL_TAB_ORDER, tabLabel, type SeasonalTabSlug } from "@/lib/wordpress/seasonalCategories";

const BASE = "/seasonal-travel-vacation-spots";

export function SeasonalCategoryTabs({ active }: { active: "all" | SeasonalTabSlug }) {
  const tabs: { id: "all" | SeasonalTabSlug; label: string }[] = [
    { id: "all", label: "All posts" },
    ...SEASONAL_TAB_ORDER.map((id) => ({ id, label: tabLabel(id) })),
  ];

  return (
    <nav
      className="mb-10 flex flex-wrap gap-2 border-b border-zinc-200 pb-4"
      aria-label="Filter by category"
    >
      {tabs.map((t) => {
        const href = t.id === "all" ? BASE : `${BASE}?cat=${t.id}`;
        const isOn = active === t.id;
        return (
          <Link
            key={t.id}
            href={href}
            scroll={false}
            className={`rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition ${
              isOn
                ? "border-[#6E0F1F] bg-[#6E0F1F] text-white shadow-sm"
                : "border-zinc-200 bg-white text-zinc-700 hover:border-[#c9a227]/80 hover:text-[#6E0F1F]"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
