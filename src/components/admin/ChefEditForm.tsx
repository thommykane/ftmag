"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CUISINE_FILTERS } from "@/data/chefs";

const SITE =
  typeof process.env.NEXT_PUBLIC_SITE_URL === "string" && process.env.NEXT_PUBLIC_SITE_URL.trim()
    ? process.env.NEXT_PUBLIC_SITE_URL.trim().replace(/\/$/, "")
    : "https://www.foodandtravelmagazine.com";

export type ChefEditInitial = {
  id: string;
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
  cuisines: string[];
  birthDate: string;
  birthPlace: string;
  specialtyCuisine: string;
  awards: string;
  ownedRestaurantsJson: string;
};

export function ChefEditForm({ chef }: { chef: ChefEditInitial | null }) {
  const router = useRouter();
  const isNew = !chef;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slug, setSlug] = useState(chef?.slug ?? "");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    try {
      const url = isNew ? "/api/admin/chefs" : `/api/admin/chefs/${chef!.id}`;
      const res = await fetch(url, {
        method: isNew ? "POST" : "PUT",
        body: fd,
        credentials: "same-origin",
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? `Request failed (${res.status})`);
        return;
      }
      router.push("/admin/chefs");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setBusy(false);
    }
  }

  async function onDelete() {
    if (!chef || !confirm(`Remove ${chef.name} from the database? This cannot be undone.`)) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/chefs/${chef.id}`, { method: "DELETE", credentials: "same-origin" });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? "Delete failed");
        return;
      }
      router.push("/admin/chefs");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setBusy(false);
    }
  }

  const profileUrl = `${SITE}/top-chefs/${slug || "your-path"}`;

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded border border-white/15 bg-black/25 p-5">
      <p className="text-xs text-white/55">
        Public profile URL:{" "}
        <span className="break-all font-mono text-[11px] text-[#e8d48b]/90">{profileUrl}</span>
        <span className="mt-1 block text-white/40">
          Set the path segment below (e.g. <code className="text-white/70">gordon-ramsay</code>). Site base
          comes from <code className="text-white/70">NEXT_PUBLIC_SITE_URL</code> or defaults to foodandtravelmagazine.com.
        </span>
      </p>

      {error ? <p className="text-sm text-red-300">{error}</p> : null}

      <label className="block text-xs uppercase tracking-wide text-white/50">
        Name
        <input
          name="name"
          required
          defaultValue={chef?.name ?? ""}
          className="mt-1 w-full rounded border border-white/20 bg-black/40 px-3 py-2 text-sm text-white"
        />
      </label>

      <label className="block text-xs uppercase tracking-wide text-white/50">
        URL path (slug) — appears as /top-chefs/
        <input
          name="slug"
          required
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="mt-1 w-full rounded border border-white/20 bg-black/40 px-3 py-2 font-mono text-sm text-white"
          placeholder="firstname-lastname"
        />
      </label>

      <label className="block text-xs uppercase tracking-wide text-white/50">
        Description
        <textarea
          name="description"
          required
          rows={10}
          defaultValue={chef?.description ?? ""}
          className="mt-1 w-full rounded border border-white/20 bg-black/40 px-3 py-2 text-sm text-white"
        />
      </label>

      <p className="text-[11px] uppercase tracking-[0.18em] text-[#c9a227]/90">Profile detail (public page)</p>

      <label className="block text-xs uppercase tracking-wide text-white/50">
        Birth date (optional)
        <input
          name="birthDate"
          type="date"
          defaultValue={chef?.birthDate ?? ""}
          className="mt-1 w-full rounded border border-white/20 bg-black/40 px-3 py-2 text-sm text-white"
        />
      </label>

      <label className="block text-xs uppercase tracking-wide text-white/50">
        Birthplace
        <input
          name="birthPlace"
          defaultValue={chef?.birthPlace ?? ""}
          className="mt-1 w-full rounded border border-white/20 bg-black/40 px-3 py-2 text-sm text-white"
          placeholder="City, Country"
        />
      </label>

      <label className="block text-xs uppercase tracking-wide text-white/50">
        Specialty cuisine (headline)
        <input
          name="specialtyCuisine"
          defaultValue={chef?.specialtyCuisine ?? ""}
          className="mt-1 w-full rounded border border-white/20 bg-black/40 px-3 py-2 text-sm text-white"
          placeholder="e.g. New Nordic"
        />
      </label>

      <label className="block text-xs uppercase tracking-wide text-white/50">
        Awards
        <textarea
          name="awards"
          rows={4}
          defaultValue={chef?.awards ?? ""}
          className="mt-1 w-full rounded border border-white/20 bg-black/40 px-3 py-2 text-sm text-white"
          placeholder="Michelin stars, 50 Best, etc."
        />
      </label>

      <label className="block text-xs uppercase tracking-wide text-white/50">
        Restaurants (JSON array)
        <textarea
          name="ownedRestaurantsJson"
          rows={6}
          defaultValue={chef?.ownedRestaurantsJson ?? "[]"}
          placeholder='[{"name":"Noma","location":"Copenhagen, Denmark","role":"Chef-owner"}]'
          className="mt-1 w-full rounded border border-white/20 bg-black/40 px-3 py-2 font-mono text-xs text-white"
        />
      </label>

      <fieldset className="space-y-2">
        <legend className="text-xs uppercase tracking-wide text-white/50">Known for (cuisines)</legend>
        <div className="max-h-56 overflow-y-auto rounded border border-white/10 bg-black/30 p-3">
          <ul className="grid gap-2 sm:grid-cols-2">
            {CUISINE_FILTERS.map((c) => (
              <li key={c} className="flex items-start gap-2">
                <input
                  type="checkbox"
                  name="cuisines"
                  value={c}
                  id={`cuisine-${c}`}
                  defaultChecked={chef?.cuisines.includes(c)}
                  className="mt-1 border-white/30 bg-black/50"
                />
                <label htmlFor={`cuisine-${c}`} className="text-sm text-white/80">
                  {c}
                </label>
              </li>
            ))}
          </ul>
        </div>
      </fieldset>

      <label className="block text-xs uppercase tracking-wide text-white/50">
        Portrait — image URL (https) optional if you upload a file
        <input
          name="imageUrl"
          type="url"
          defaultValue={
            chef?.imageUrl?.startsWith("http") && !chef.imageUrl.startsWith("/") ? chef.imageUrl : ""
          }
          className="mt-1 w-full rounded border border-white/20 bg-black/40 px-3 py-2 text-sm text-white"
          placeholder="https://…"
        />
      </label>

      <label className="block text-xs uppercase tracking-wide text-white/50">
        Portrait — file {isNew ? "(required if no URL)" : "(optional — replaces current)"}
        <input
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="mt-1 w-full text-sm text-white/90 file:mr-3 file:rounded file:border-0 file:bg-[#6E0F1F] file:px-3 file:py-1.5 file:text-xs file:uppercase file:tracking-wide file:text-white"
        />
        {!isNew ? (
          <span className="mt-1 block text-[10px] text-white/45">
            If you pick a new file, it replaces the portrait even when the URL field above still shows the old link.
          </span>
        ) : null}
      </label>

      {chef?.imageUrl ? (
        <p className="text-[10px] text-white/40 break-all">Current image: {chef.imageUrl}</p>
      ) : null}

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          disabled={busy}
          className="rounded border-2 border-[#c9a227] bg-[#6E0F1F] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white disabled:opacity-50"
        >
          {busy ? "Saving…" : isNew ? "Create chef" : "Save changes"}
        </button>
        <Link
          href="/admin/chefs"
          className="rounded border border-white/25 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 hover:bg-white/5"
        >
          Cancel
        </Link>
        {!isNew ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => void onDelete()}
            className="rounded border border-rose-500/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-rose-300/95 hover:bg-rose-950/40 disabled:opacity-50"
          >
            Delete
          </button>
        ) : null}
      </div>
    </form>
  );
}
