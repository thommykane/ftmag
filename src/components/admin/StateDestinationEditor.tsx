"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type {
  DestinationCity,
  DestinationCounty,
  FeaturedExperience,
  IdealForOption,
  StateDestination,
} from "@/types/stateDestination";
import {
  BEST_SEASONS,
  DRIVEABILITY,
  IDEAL_FOR_OPTIONS,
  WALKABILITY,
} from "@/types/stateDestination";

const inputClass =
  "w-full rounded border border-white/20 bg-black/50 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:border-[#c9a227]/55 focus:outline-none";
const labelClass = "mb-1 block text-[11px] uppercase tracking-[0.2em] text-white/55";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8 rounded-lg border border-white/15 bg-black/35 p-5">
      <h2 className="mb-4 border-b border-[#c9a227]/25 pb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#e8d48b]">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

const emptyCity = (): DestinationCity => ({
  name: "",
  slug: "",
  shortDescription: "",
  imageUrl: "",
});

const emptyCounty = (): DestinationCounty => ({
  name: "",
  slug: "",
  shortDescription: "",
});

const emptyExperience = (): FeaturedExperience => ({
  icon: "◆",
  title: "",
  description: "",
});

function sanitizeDestinationForSave(d: StateDestination): StateDestination {
  return {
    ...d,
    metaTitle: d.metaTitle.trim(),
    metaDescription: d.metaDescription.trim(),
    name: d.name.trim(),
    slug: d.slug.trim(),
    tagline: d.tagline.trim(),
    topCities: d.topCities
      .filter((c) => c.name.trim() && c.slug.trim() && c.shortDescription.trim())
      .map((c) => ({
        ...c,
        name: c.name.trim(),
        slug: c.slug.trim(),
        shortDescription: c.shortDescription.trim(),
        imageUrl: c.imageUrl?.trim() || undefined,
      })),
    topCounties: d.topCounties
      .filter((c) => c.name.trim() && c.slug.trim() && c.shortDescription.trim())
      .map((c) => ({
        ...c,
        name: c.name.trim(),
        slug: c.slug.trim(),
        shortDescription: c.shortDescription.trim(),
      })),
    featuredExperiences: d.featuredExperiences
      .filter((ex) => ex.title.trim() && ex.description.trim())
      .map((ex) => ({
        ...ex,
        icon: ex.icon.trim() || "◆",
        title: ex.title.trim(),
        description: ex.description.trim(),
      })),
    knownFor: d.knownFor.map((s) => s.trim()).filter(Boolean),
    majorAirports: d.majorAirports.map((s) => s.trim()).filter(Boolean),
    quickTips: d.quickTips.map((s) => s.trim()).filter(Boolean),
    gallery: d.gallery.map((s) => s.trim()).filter(Boolean),
  };
}

export function StateDestinationEditor({ slug }: { slug: string }) {
  const [data, setData] = useState<StateDestination | null>(null);
  const [storedInDatabase, setStoredInDatabase] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(`/api/admin/state-destinations/${encodeURIComponent(slug)}`, {
        credentials: "same-origin",
      });
      const j = await r.json();
      if (!r.ok) {
        setError(j.error ?? "Failed to load");
        setData(null);
        return;
      }
      setData(j.destination as StateDestination);
      setStoredInDatabase(!!j.storedInDatabase);
    } catch {
      setError("Network error");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    void load();
  }, [load]);

  const update = useCallback(<K extends keyof StateDestination>(key: K, value: StateDestination[K]) => {
    setData((prev) => (prev ? { ...prev, [key]: value } : null));
  }, []);

  const toggleIdeal = (opt: IdealForOption) => {
    setData((prev) => {
      if (!prev) return null;
      const has = prev.idealFor.includes(opt);
      return {
        ...prev,
        idealFor: has ? prev.idealFor.filter((x) => x !== opt) : [...prev.idealFor, opt],
      };
    });
  };

  async function save() {
    if (!data) return;
    setSaving(true);
    setMessage(null);
    setError(null);
    const body = sanitizeDestinationForSave(data);
    try {
      const r = await fetch(`/api/admin/state-destinations/${encodeURIComponent(slug)}`, {
        method: "PUT",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const j = await r.json();
      if (!r.ok) {
        setError(typeof j.error === "string" ? j.error : JSON.stringify(j.details ?? j));
        return;
      }
      setData(j.destination as StateDestination);
      setStoredInDatabase(true);
      setMessage("Saved. Public pages will show this version.");
    } catch {
      setError("Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function resetToBundled() {
    if (!confirm("Remove the database copy and revert this state to the bundled default (code / placeholder)?")) {
      return;
    }
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const r = await fetch(`/api/admin/state-destinations/${encodeURIComponent(slug)}`, {
        method: "DELETE",
        credentials: "same-origin",
      });
      const j = await r.json();
      if (!r.ok) {
        setError(j.error ?? "Reset failed");
        return;
      }
      setData(j.destination as StateDestination);
      setStoredInDatabase(false);
      setMessage("Reverted to bundled default.");
    } catch {
      setError("Reset failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !data) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-white/70">
        {error ? <p className="text-red-300">{error}</p> : <p>Loading…</p>}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 text-white">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#c9a227]/80">Edit destination</p>
          <h1 className="text-xl font-semibold text-white">{data.name}</h1>
          <p className="mt-1 text-xs text-white/55">
            {storedInDatabase
              ? "Serving from database (overrides bundled content)."
              : "Serving from bundled TypeScript / placeholder until you save."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/visit/${slug}`}
            className="rounded border border-white/25 px-4 py-2 text-center text-xs uppercase tracking-[0.16em] text-white/85 hover:border-[#c9a227]/45"
            target="_blank"
            rel="noreferrer"
          >
            View public page
          </Link>
          <button
            type="button"
            onClick={() => void save()}
            disabled={saving}
            className="rounded border-2 border-[#c9a227] bg-[#6E0F1F] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            onClick={() => void resetToBundled()}
            disabled={saving || !storedInDatabase}
            className="rounded border border-white/35 px-4 py-2 text-xs uppercase tracking-[0.16em] text-white/70 hover:bg-white/5 disabled:opacity-40"
            title={storedInDatabase ? "Delete DB row" : "No DB row to remove"}
          >
            Revert to bundled
          </button>
        </div>
      </div>

      {message && <p className="mb-4 text-sm text-[#e8d48b]">{message}</p>}
      {error && <p className="mb-4 text-sm text-red-300">{error}</p>}

      <Section title="SEO">
        <Field label="Meta title">
          <input className={inputClass} value={data.metaTitle} onChange={(e) => update("metaTitle", e.target.value)} />
        </Field>
        <Field label="Meta description">
          <textarea
            className={`${inputClass} min-h-[80px]`}
            value={data.metaDescription}
            onChange={(e) => update("metaDescription", e.target.value)}
          />
        </Field>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-white/80">
          <input
            type="checkbox"
            checked={!!data.contentComplete}
            onChange={(e) => update("contentComplete", e.target.checked)}
          />
          Content complete (hide “expansion in progress” ribbon)
        </label>
      </Section>

      <Section title="Hero & identity">
        <Field label="Name">
          <input className={inputClass} value={data.name} onChange={(e) => update("name", e.target.value)} />
        </Field>
        <Field label="Slug (read-only)">
          <input className={`${inputClass} opacity-70`} value={data.slug} readOnly />
        </Field>
        <Field label="Tagline">
          <input className={inputClass} value={data.tagline} onChange={(e) => update("tagline", e.target.value)} />
        </Field>
        <Field label="Hero image URL">
          <input className={inputClass} value={data.heroImage} onChange={(e) => update("heroImage", e.target.value)} />
        </Field>
        <Field label="State shape / thumbnail URL">
          <input
            className={inputClass}
            value={data.thumbnailShape}
            onChange={(e) => update("thumbnailShape", e.target.value)}
          />
        </Field>
      </Section>

      <Section title="Dossier">
        <Field label="Best season">
          <select
            className={inputClass}
            value={data.bestSeason}
            onChange={(e) => update("bestSeason", e.target.value as StateDestination["bestSeason"])}
          >
            {BEST_SEASONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
        <div className="mb-4">
          <span className={labelClass}>Ideal for</span>
          <div className="flex flex-wrap gap-3">
            {IDEAL_FOR_OPTIONS.map((opt) => (
              <label key={opt} className="flex items-center gap-2 text-sm text-white/80">
                <input type="checkbox" checked={data.idealFor.includes(opt)} onChange={() => toggleIdeal(opt)} />
                {opt}
              </label>
            ))}
          </div>
        </div>
        <Field label="Population">
          <input
            className={inputClass}
            value={data.population}
            onChange={(e) => update("population", e.target.value)}
          />
        </Field>
        <Field label="Known for (one per line)">
          <textarea
            className={`${inputClass} min-h-[100px] font-mono text-xs`}
            value={data.knownFor.join("\n")}
            onChange={(e) =>
              update(
                "knownFor",
                e.target.value
                  .split("\n")
                  .map((s) => s.trim())
                  .filter(Boolean),
              )
            }
          />
        </Field>
        <Field label="Climate">
          <textarea className={`${inputClass} min-h-[72px]`} value={data.climate} onChange={(e) => update("climate", e.target.value)} />
        </Field>
        <Field label="Avg. cost per day">
          <input
            className={inputClass}
            value={data.avgCostPerDay}
            onChange={(e) => update("avgCostPerDay", e.target.value)}
          />
        </Field>
        <Field label="Major airports (one per line)">
          <textarea
            className={`${inputClass} min-h-[100px] font-mono text-xs`}
            value={data.majorAirports.join("\n")}
            onChange={(e) =>
              update(
                "majorAirports",
                e.target.value
                  .split("\n")
                  .map((s) => s.trim())
                  .filter(Boolean),
              )
            }
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Driveability">
            <select
              className={inputClass}
              value={data.driveability}
              onChange={(e) => update("driveability", e.target.value as StateDestination["driveability"])}
            >
              {DRIVEABILITY.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Walkability">
            <select
              className={inputClass}
              value={data.walkability}
              onChange={(e) => update("walkability", e.target.value as StateDestination["walkability"])}
            >
              {WALKABILITY.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </Section>

      <Section title="Editorial HTML">
        <Field label="Description (HTML)">
          <textarea
            className={`${inputClass} min-h-[160px] font-mono text-xs`}
            value={data.description}
            onChange={(e) => update("description", e.target.value)}
          />
        </Field>
        <Field label="Why visit (HTML)">
          <textarea
            className={`${inputClass} min-h-[160px] font-mono text-xs`}
            value={data.whyVisit}
            onChange={(e) => update("whyVisit", e.target.value)}
          />
        </Field>
      </Section>

      <Section title="Featured experiences">
        <div className="space-y-4">
          {data.featuredExperiences.map((ex, i) => (
            <div key={i} className="rounded border border-white/10 p-3">
              <div className="mb-2 grid gap-2 sm:grid-cols-3">
                <input
                  className={inputClass}
                  placeholder="Icon"
                  value={ex.icon}
                  onChange={(e) => {
                    const next = [...data.featuredExperiences];
                    next[i] = { ...ex, icon: e.target.value };
                    update("featuredExperiences", next);
                  }}
                />
                <input
                  className={`${inputClass} sm:col-span-2`}
                  placeholder="Title"
                  value={ex.title}
                  onChange={(e) => {
                    const next = [...data.featuredExperiences];
                    next[i] = { ...ex, title: e.target.value };
                    update("featuredExperiences", next);
                  }}
                />
              </div>
              <textarea
                className={`${inputClass} min-h-[64px] text-xs`}
                placeholder="Description"
                value={ex.description}
                onChange={(e) => {
                  const next = [...data.featuredExperiences];
                  next[i] = { ...ex, description: e.target.value };
                  update("featuredExperiences", next);
                }}
              />
              <button
                type="button"
                className="mt-2 text-xs text-red-300/90 underline"
                onClick={() => update(
                  "featuredExperiences",
                  data.featuredExperiences.filter((_, j) => j !== i),
                )}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="text-xs uppercase tracking-[0.16em] text-[#e8d48b] underline"
            onClick={() => update("featuredExperiences", [...data.featuredExperiences, emptyExperience()])}
          >
            + Add experience
          </button>
        </div>
      </Section>

      <Section title="Top cities">
        <div className="space-y-4">
          {data.topCities.map((c, i) => (
            <div key={i} className="rounded border border-white/10 p-3">
              <div className="grid gap-2 sm:grid-cols-2">
                <input
                  className={inputClass}
                  placeholder="Name"
                  value={c.name}
                  onChange={(e) => {
                    const next = [...data.topCities];
                    next[i] = { ...c, name: e.target.value };
                    update("topCities", next);
                  }}
                />
                <input
                  className={inputClass}
                  placeholder="Slug"
                  value={c.slug}
                  onChange={(e) => {
                    const next = [...data.topCities];
                    next[i] = { ...c, slug: e.target.value };
                    update("topCities", next);
                  }}
                />
              </div>
              <textarea
                className={`${inputClass} mt-2 min-h-[56px] text-xs`}
                placeholder="Short description"
                value={c.shortDescription}
                onChange={(e) => {
                  const next = [...data.topCities];
                  next[i] = { ...c, shortDescription: e.target.value };
                  update("topCities", next);
                }}
              />
              <input
                className={`${inputClass} mt-2 text-xs`}
                placeholder="Image URL (optional)"
                value={c.imageUrl ?? ""}
                onChange={(e) => {
                  const next = [...data.topCities];
                  const v = e.target.value.trim();
                  next[i] = { ...c, imageUrl: v || undefined };
                  update("topCities", next);
                }}
              />
              <button
                type="button"
                className="mt-2 text-xs text-red-300/90 underline"
                onClick={() => update(
                  "topCities",
                  data.topCities.filter((_, j) => j !== i),
                )}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="text-xs uppercase tracking-[0.16em] text-[#e8d48b] underline"
            onClick={() => update("topCities", [...data.topCities, emptyCity()])}
          >
            + Add city
          </button>
        </div>
      </Section>

      <Section title="Regions & counties">
        <label className="mb-4 flex cursor-pointer items-center gap-2 text-sm text-white/80">
          <input
            type="checkbox"
            checked={data.showCounties}
            onChange={(e) => update("showCounties", e.target.checked)}
          />
          Show counties section on public page
        </label>
        <div className="space-y-4">
          {data.topCounties.map((c, i) => (
            <div key={i} className="rounded border border-white/10 p-3">
              <div className="grid gap-2 sm:grid-cols-2">
                <input
                  className={inputClass}
                  placeholder="Name"
                  value={c.name}
                  onChange={(e) => {
                    const next = [...data.topCounties];
                    next[i] = { ...c, name: e.target.value };
                    update("topCounties", next);
                  }}
                />
                <input
                  className={inputClass}
                  placeholder="Slug"
                  value={c.slug}
                  onChange={(e) => {
                    const next = [...data.topCounties];
                    next[i] = { ...c, slug: e.target.value };
                    update("topCounties", next);
                  }}
                />
              </div>
              <textarea
                className={`${inputClass} mt-2 min-h-[56px] text-xs`}
                placeholder="Short description"
                value={c.shortDescription}
                onChange={(e) => {
                  const next = [...data.topCounties];
                  next[i] = { ...c, shortDescription: e.target.value };
                  update("topCounties", next);
                }}
              />
              <button
                type="button"
                className="mt-2 text-xs text-red-300/90 underline"
                onClick={() => update(
                  "topCounties",
                  data.topCounties.filter((_, j) => j !== i),
                )}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="text-xs uppercase tracking-[0.16em] text-[#e8d48b] underline"
            onClick={() => update("topCounties", [...data.topCounties, emptyCounty()])}
          >
            + Add county
          </button>
        </div>
      </Section>

      <Section title="Gallery & video">
        <Field label="Gallery image URLs (one per line)">
          <textarea
            className={`${inputClass} min-h-[120px] font-mono text-xs`}
            value={data.gallery.join("\n")}
            onChange={(e) =>
              update(
                "gallery",
                e.target.value
                  .split("\n")
                  .map((s) => s.trim())
                  .filter(Boolean),
              )
            }
          />
        </Field>
        <Field label="Video URL (YouTube or Vimeo, or leave empty)">
          <input
            className={inputClass}
            value={data.videoUrl ?? ""}
            onChange={(e) => {
              const v = e.target.value.trim();
              update("videoUrl", v === "" ? null : v);
            }}
          />
        </Field>
      </Section>

      <Section title="Seasonal breakdown">
        {(["spring", "summer", "fall", "winter"] as const).map((k) => (
          <Field key={k} label={k.charAt(0).toUpperCase() + k.slice(1)}>
            <textarea
              className={`${inputClass} min-h-[72px]`}
              value={data.seasonalBreakdown[k]}
              onChange={(e) =>
                update("seasonalBreakdown", {
                  ...data.seasonalBreakdown,
                  [k]: e.target.value,
                })
              }
            />
          </Field>
        ))}
      </Section>

      <Section title="Quick tips (one per line)">
        <textarea
          className={`${inputClass} min-h-[120px] font-mono text-xs`}
          value={data.quickTips.join("\n")}
          onChange={(e) =>
            update(
              "quickTips",
              e.target.value
                .split("\n")
                .map((s) => s.trim())
                .filter(Boolean),
            )
          }
        />
      </Section>

      <div className="flex flex-wrap gap-2 pb-16">
        <button
          type="button"
          onClick={() => void save()}
          disabled={saving}
          className="rounded border-2 border-[#c9a227] bg-[#6E0F1F] px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save to database"}
        </button>
        <Link href="/admin/destinations" className="rounded border border-white/30 px-6 py-3 text-xs uppercase tracking-[0.16em] text-white/80">
          Back to list
        </Link>
      </div>
    </div>
  );
}
