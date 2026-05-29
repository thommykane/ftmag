"use client";

import { useCallback, useEffect, useState } from "react";
import type { HomePageConfigDTO } from "@/lib/homepage/getHomePageContent";

type ChefOption = { id: string; name: string; slug: string };
type RestaurantOption = {
  id: string;
  name: string;
  nationalRank: number | null;
  city: string;
  stateSlug: string;
};
type StateOption = { slug: string; name: string };

export function MainPageAdminClient() {
  const [config, setConfig] = useState<HomePageConfigDTO | null>(null);
  const [chefs, setChefs] = useState<ChefOption[]>([]);
  const [restaurants, setRestaurants] = useState<RestaurantOption[]>([]);
  const [states, setStates] = useState<StateOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/main-page", { credentials: "same-origin", cache: "no-store" });
      if (!res.ok) throw new Error("load failed");
      const data = await res.json();
      setConfig(data.config);
      setChefs(data.chefs ?? []);
      setRestaurants(data.restaurants ?? []);
      setStates(data.states ?? []);
    } catch {
      setError("Could not load main page settings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function patch(partial: Partial<HomePageConfigDTO>) {
    setConfig((c) => (c ? { ...c, ...partial } : c));
    setSaved(false);
  }

  async function save() {
    if (!config) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/main-page", {
        method: "PATCH",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Save failed");
        return;
      }
      setConfig(data.config);
      setSaved(true);
    } catch {
      setError("Network error — try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !config) {
    return <p className="text-sm text-white/60">Loading…</p>;
  }

  return (
    <div className="space-y-8 text-sm text-white/90">
      {error ? <p className="text-red-300">{error}</p> : null}
      {saved ? <p className="text-emerald-300/90">Saved — refresh the homepage to preview.</p> : null}

      <SlotSection title="Top restaurant">
        <Toggle label="Show on homepage" checked={config.restaurantEnabled} onChange={(v) => patch({ restaurantEnabled: v })} />
        <TextField label="Section title" value={config.restaurantTitle} onChange={(v) => patch({ restaurantTitle: v })} />
        <TextField label="Subtitle (year)" value={config.restaurantSubtitle} onChange={(v) => patch({ restaurantSubtitle: v })} />
        <SelectField
          label="Selection mode"
          value={config.restaurantMode}
          onChange={(v) => patch({ restaurantMode: v })}
          options={[
            { value: "auto", label: "Auto — seeded pick from Top 1000 for summer year" },
            { value: "manual", label: "Manual — pick a restaurant" },
            { value: "off", label: "Hidden" },
          ]}
        />
        {config.restaurantMode === "manual" ? (
          <SelectField
            label="Restaurant"
            value={config.restaurantId ?? ""}
            onChange={(v) => patch({ restaurantId: v || null })}
            options={[
              { value: "", label: "— choose —" },
              ...restaurants.map((r) => ({
                value: r.id,
                label: `#${r.nationalRank ?? "?"} ${r.name} (${r.city})`,
              })),
            ]}
          />
        ) : null}
      </SlotSection>

      <SlotSection title="Chef of the month">
        <Toggle label="Show on homepage" checked={config.chefEnabled} onChange={(v) => patch({ chefEnabled: v })} />
        <TextField label="Section title" value={config.chefTitle} onChange={(v) => patch({ chefTitle: v })} />
        <SelectField
          label="Selection mode"
          value={config.chefMode}
          onChange={(v) => patch({ chefMode: v })}
          options={[
            { value: "auto", label: "Auto — changes each calendar month" },
            { value: "manual", label: "Manual — pick a chef profile" },
            { value: "off", label: "Hidden" },
          ]}
        />
        {config.chefMode === "manual" ? (
          <SelectField
            label="Chef"
            value={config.chefId ?? ""}
            onChange={(v) => patch({ chefId: v || null })}
            options={[
              { value: "", label: "— choose —" },
              ...chefs.map((c) => ({ value: c.id, label: c.name })),
            ]}
          />
        ) : null}
      </SlotSection>

      <SlotSection title="Summer vacation spot">
        <Toggle label="Show on homepage" checked={config.destinationEnabled} onChange={(v) => patch({ destinationEnabled: v })} />
        <TextField label="Section title" value={config.destinationTitle} onChange={(v) => patch({ destinationTitle: v })} />
        <SelectField
          label="Selection mode"
          value={config.destinationMode}
          onChange={(v) => patch({ destinationMode: v })}
          options={[
            { value: "state", label: "Fixed state dossier" },
            { value: "random", label: "Random state (monthly seed)" },
            { value: "off", label: "Hidden" },
          ]}
        />
        {config.destinationMode === "state" ? (
          <SelectField
            label="State"
            value={config.destinationStateSlug}
            onChange={(v) => patch({ destinationStateSlug: v })}
            options={states.map((s) => ({ value: s.slug, label: s.name }))}
          />
        ) : null}
      </SlotSection>

      <SlotSection title="Most recent article">
        <Toggle label="Show on homepage" checked={config.articleEnabled} onChange={(v) => patch({ articleEnabled: v })} />
        <TextField label="Section title" value={config.articleTitle} onChange={(v) => patch({ articleTitle: v })} />
        <SelectField
          label="Selection mode"
          value={config.articleMode}
          onChange={(v) => patch({ articleMode: v })}
          options={[
            { value: "latest", label: "Latest from CMS (cms.foodandtravelmagazine.com)" },
            { value: "manual", label: "Manual — WordPress slug" },
            { value: "off", label: "Hidden" },
          ]}
        />
        {config.articleMode === "manual" ? (
          <TextField
            label="Article slug"
            value={config.articleSlug ?? ""}
            onChange={(v) => patch({ articleSlug: v || null })}
            placeholder="wordpress-post-slug"
          />
        ) : null}
      </SlotSection>

      <SlotSection title="Recipe of the week">
        <Toggle label="Show placeholder section" checked={config.recipeEnabled} onChange={(v) => patch({ recipeEnabled: v })} />
        <TextField label="Section title" value={config.recipeTitle} onChange={(v) => patch({ recipeTitle: v })} />
        <TextField label="Blurb (optional)" value={config.recipeBlurb} onChange={(v) => patch({ recipeBlurb: v })} />
        <TextField label="Link URL (optional)" value={config.recipeHref} onChange={(v) => patch({ recipeHref: v })} />
        <TextField label="Image URL (optional)" value={config.recipeImageUrl} onChange={(v) => patch({ recipeImageUrl: v })} />
        <p className="text-[11px] text-white/45">
          Leave blurb, link, and image empty to show the “coming soon” placeholder. When filled, the recipe card uses
          your image like other homepage slots.
        </p>
      </SlotSection>

      <button
        type="button"
        disabled={saving}
        onClick={() => void save()}
        className="rounded border-2 border-[#c9a227] bg-[#6E0F1F] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-white disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save main page"}
      </button>
    </div>
  );
}

function SlotSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-white/10 bg-black/30 p-4 space-y-3">
      <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-[#c9a227]">{title}</h2>
      {children}
    </section>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-xs text-white/75">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block text-xs text-white/70">
      {label}
      <input
        className="mt-1 w-full rounded border border-white/15 bg-black/40 px-2 py-1.5 text-white"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block text-xs text-white/70">
      {label}
      <select
        className="mt-1 w-full rounded border border-white/15 bg-black/40 px-2 py-1.5 text-white"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value || "empty"} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
