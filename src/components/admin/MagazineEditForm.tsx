"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export type MagazineEditInitial = {
  id: string;
  slug: string;
  displayTitle: string;
  releaseDate: string;
  releaseLabel: string;
  blurb: string;
  coverSrc: string;
  pdfSrc: string;
  purchaseUrl: string | null;
};

export function MagazineEditForm({ magazine: m }: { magazine: MagazineEditInitial }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/magazines/${m.id}`, {
        method: "PUT",
        body: fd,
        credentials: "same-origin",
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? `Request failed (${res.status})`);
        return;
      }
      router.push("/admin/magazines");
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded border border-white/15 bg-black/25 p-5">
      <p className="text-xs text-white/55">
        Change text, slug, purchase link, or replace PDF/cover (file or hosted URL). Leave file inputs empty to keep
        current assets.
      </p>
      {error ? <p className="text-sm text-red-300">{error}</p> : null}

      <label className="block text-xs uppercase tracking-wide text-white/50">
        Display title
        <input
          name="displayTitle"
          required
          defaultValue={m.displayTitle}
          className="mt-1 w-full rounded border border-white/20 bg-black/40 px-3 py-2 text-sm text-white"
        />
      </label>

      <label className="block text-xs uppercase tracking-wide text-white/50">
        URL slug (public link is /magazines/read/your-slug)
        <input
          name="slug"
          defaultValue={m.slug}
          className="mt-1 w-full rounded border border-white/20 bg-black/40 px-3 py-2 font-mono text-sm text-white"
        />
      </label>

      <label className="block text-xs uppercase tracking-wide text-white/50">
        Release date (sorting)
        <input
          name="releaseDate"
          type="date"
          required
          defaultValue={m.releaseDate}
          className="mt-1 w-full rounded border border-white/20 bg-black/40 px-3 py-2 text-sm text-white"
        />
      </label>

      <label className="block text-xs uppercase tracking-wide text-white/50">
        Release label (shown on site)
        <input
          name="releaseLabel"
          required
          defaultValue={m.releaseLabel}
          className="mt-1 w-full rounded border border-white/20 bg-black/40 px-3 py-2 text-sm text-white"
        />
      </label>

      <label className="block text-xs uppercase tracking-wide text-white/50">
        Blurb / description
        <textarea
          name="blurb"
          required
          rows={6}
          defaultValue={m.blurb}
          className="mt-1 w-full rounded border border-white/20 bg-black/40 px-3 py-2 text-sm text-white"
        />
      </label>

      <label className="block text-xs uppercase tracking-wide text-white/50">
        Store purchase link (optional)
        <input
          name="purchaseUrl"
          type="url"
          defaultValue={m.purchaseUrl ?? ""}
          className="mt-1 w-full rounded border border-white/20 bg-black/40 px-3 py-2 text-sm text-white"
          placeholder="https://…"
        />
      </label>

      <label className="block text-xs uppercase tracking-wide text-white/50">
        Replace PDF — hosted URL (optional)
        <input
          name="pdfUrl"
          type="url"
          className="mt-1 w-full rounded border border-white/20 bg-black/40 px-3 py-2 text-sm text-white"
          placeholder={`Current: ${m.pdfSrc.slice(0, 48)}…`}
        />
      </label>

      <label className="block text-xs uppercase tracking-wide text-white/50">
        Replace PDF — file (optional)
        <input
          name="pdf"
          type="file"
          accept="application/pdf"
          className="mt-1 w-full text-sm text-white/90 file:mr-3 file:rounded file:border-0 file:bg-[#6E0F1F] file:px-3 file:py-1.5 file:text-xs file:uppercase file:tracking-wide file:text-white"
        />
      </label>

      <label className="block text-xs uppercase tracking-wide text-white/50">
        Replace cover — hosted URL (optional)
        <input
          name="coverUrl"
          type="url"
          className="mt-1 w-full rounded border border-white/20 bg-black/40 px-3 py-2 text-sm text-white"
          placeholder={`Current cover…`}
        />
      </label>

      <label className="block text-xs uppercase tracking-wide text-white/50">
        Replace cover — file (optional)
        <input
          name="cover"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="mt-1 w-full text-sm text-white/90 file:mr-3 file:rounded file:border-0 file:bg-[#6E0F1F] file:px-3 file:py-1.5 file:text-xs file:uppercase file:tracking-wide file:text-white"
        />
      </label>

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          disabled={busy}
          className="rounded border-2 border-[#c9a227] bg-[#6E0F1F] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white disabled:opacity-50"
        >
          {busy ? "Saving…" : "Save changes"}
        </button>
        <Link
          href="/admin/magazines"
          className="rounded border border-white/25 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 hover:bg-white/5"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
