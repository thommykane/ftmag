"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Row = {
  id: string;
  slug: string;
  displayTitle: string;
  releaseDate: string;
  releaseLabel: string;
  coverSrc: string;
  pdfSrc: string;
  purchaseUrl: string | null;
};

function shortUrl(u: string) {
  if (u.length <= 56) return u;
  return `${u.slice(0, 28)}…${u.slice(-20)}`;
}

export function MagazinesAdminForm({ initialMagazines }: { initialMagazines: Row[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setOk(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    setBusy(true);
    try {
      const res = await fetch("/api/admin/magazines", {
        method: "POST",
        body: fd,
        credentials: "same-origin",
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? `Request failed (${res.status})`);
        return;
      }
      setOk("Magazine created. It appears at the top of /magazines when its release date is newest.");
      form.reset();
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-10">
      <form onSubmit={onSubmit} className="space-y-4 rounded border border-white/15 bg-black/25 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c9a227]">Add magazine</h2>
        <p className="text-xs text-white/55">
          <strong className="text-white/75">Vercel:</strong> PDFs in git are not deployed (too large). Set{" "}
          <code className="text-white/80">BLOB_READ_WRITE_TOKEN</code> in Vercel, then uploads go to Blob. Or paste
          hosted <strong>https</strong> URLs for PDF and cover instead of files. Local dev can still save under{" "}
          <code className="text-white/80">public/magazines/</code> when Blob is unset.
        </p>

        {error ? <p className="text-sm text-red-300">{error}</p> : null}
        {ok ? <p className="text-sm text-emerald-300/95">{ok}</p> : null}

        <label className="block text-xs uppercase tracking-wide text-white/50">
          Display title
          <input
            name="displayTitle"
            required
            className="mt-1 w-full rounded border border-white/20 bg-black/40 px-3 py-2 text-sm text-white"
            placeholder="Spring 2027"
          />
        </label>

        <label className="block text-xs uppercase tracking-wide text-white/50">
          Release date (for sorting)
          <input
            name="releaseDate"
            type="date"
            required
            className="mt-1 w-full rounded border border-white/20 bg-black/40 px-3 py-2 text-sm text-white"
          />
        </label>

        <label className="block text-xs uppercase tracking-wide text-white/50">
          Release label (shown on site)
          <input
            name="releaseLabel"
            required
            className="mt-1 w-full rounded border border-white/20 bg-black/40 px-3 py-2 text-sm text-white"
            placeholder="April 12, 2027"
          />
        </label>

        <label className="block text-xs uppercase tracking-wide text-white/50">
          Blurb / description
          <textarea
            name="blurb"
            required
            rows={5}
            className="mt-1 w-full rounded border border-white/20 bg-black/40 px-3 py-2 text-sm text-white"
          />
        </label>

        <label className="block text-xs uppercase tracking-wide text-white/50">
          Store purchase link (optional — powers the &quot;Purchase issue&quot; button)
          <input
            name="purchaseUrl"
            type="url"
            className="mt-1 w-full rounded border border-white/20 bg-black/40 px-3 py-2 text-sm text-white"
            placeholder="https://buy.stripe.com/…"
          />
        </label>

        <label className="block text-xs uppercase tracking-wide text-white/50">
          Hosted cover image URL (optional — use instead of file)
          <input
            name="coverUrl"
            type="url"
            className="mt-1 w-full rounded border border-white/20 bg-black/40 px-3 py-2 text-sm text-white"
            placeholder="https://…"
          />
        </label>

        <label className="block text-xs uppercase tracking-wide text-white/50">
          Cover image file (if no cover URL)
          <input
            name="cover"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="mt-1 w-full text-sm text-white/90 file:mr-3 file:rounded file:border-0 file:bg-[#6E0F1F] file:px-3 file:py-1.5 file:text-xs file:uppercase file:tracking-wide file:text-white"
          />
        </label>

        <label className="block text-xs uppercase tracking-wide text-white/50">
          Hosted PDF URL (optional — use instead of file)
          <input
            name="pdfUrl"
            type="url"
            className="mt-1 w-full rounded border border-white/20 bg-black/40 px-3 py-2 text-sm text-white"
            placeholder="https://…"
          />
        </label>

        <label className="block text-xs uppercase tracking-wide text-white/50">
          PDF file (if no PDF URL)
          <input
            name="pdf"
            type="file"
            accept="application/pdf"
            className="mt-1 w-full text-sm text-white/90 file:mr-3 file:rounded file:border-0 file:bg-[#6E0F1F] file:px-3 file:py-1.5 file:text-xs file:uppercase file:tracking-wide file:text-white"
          />
        </label>

        <button
          type="submit"
          disabled={busy}
          className="rounded border-2 border-[#c9a227] bg-[#6E0F1F] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white disabled:opacity-50"
        >
          {busy ? "Uploading…" : "Create magazine"}
        </button>
      </form>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#c9a227]">
          Published issues ({initialMagazines.length})
        </h2>
        <ul className="space-y-2 text-sm text-white/80">
          {initialMagazines.map((m) => (
            <li key={m.id} className="flex flex-col gap-1 border-b border-white/10 pb-3">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-medium text-white">{m.displayTitle}</span>
              <span className="text-white/50">{m.releaseLabel}</span>
              <span className="text-xs text-white/40">{m.slug}</span>
              <span className="text-[10px] text-white/35" title={m.id}>
                id {m.id.slice(0, 12)}…
              </span>
              {m.purchaseUrl ? (
                <a
                  href={m.purchaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#c9a227] underline"
                >
                  purchase link
                </a>
              ) : (
                <span className="text-xs text-white/35">no purchase link</span>
              )}
              </div>
              <p className="text-[10px] leading-snug text-white/40 break-all">
                PDF: {shortUrl(m.pdfSrc)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
