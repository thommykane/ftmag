"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

export type EmailListRow = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
};

type SortKey = "firstName" | "lastName" | "email" | "phone";

const COLS: { key: SortKey; label: string }[] = [
  { key: "firstName", label: "First Name" },
  { key: "lastName", label: "Last Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone Number" },
];

function sortRows(rows: EmailListRow[], sortKey: SortKey, sortDir: "asc" | "desc"): EmailListRow[] {
  const mul = sortDir === "asc" ? 1 : -1;
  return [...rows].sort((a, b) => {
    const av = (a[sortKey] ?? "").toString();
    const bv = (b[sortKey] ?? "").toString();
    return av.localeCompare(bv, undefined, { numeric: true, sensitivity: "base" }) * mul;
  });
}

export function EmailListSubscribersGrid() {
  const [rows, setRows] = useState<EmailListRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("lastName");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await fetch("/api/admin/email-list", { cache: "no-store", credentials: "same-origin" });
      if (res.status === 403) {
        setLoadError("You do not have access.");
        return;
      }
      if (!res.ok) {
        setLoadError("Could not load subscribers.");
        return;
      }
      const data = (await res.json()) as { rows?: EmailListRow[] };
      setRows(Array.isArray(data.rows) ? data.rows : []);
    } finally {
      setLoading(false);
    }
  }, []);

  async function removeSubscriber(id: string) {
    if (!confirm("Remove this email-list subscriber permanently?")) return;
    setRemovingId(id);
    try {
      const res = await fetch(`/api/admin/email-list/${encodeURIComponent(id)}`, {
        method: "DELETE",
        credentials: "same-origin",
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setLoadError(data.error ?? "Could not remove.");
        return;
      }
      setLoadError(null);
      await load();
    } finally {
      setRemovingId(null);
    }
  }

  useEffect(() => {
    void load();
  }, [load]);

  function onSort(key: SortKey) {
    if (key === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const sorted = useMemo(() => sortRows(rows, sortKey, sortDir), [rows, sortKey, sortDir]);

  return (
    <div className="space-y-3">
      {loadError && (
        <p className="rounded border border-red-500/35 bg-red-950/30 px-3 py-2 text-sm text-red-300/90">{loadError}</p>
      )}
      <div className="scrollbar-thin max-h-[calc(100vh-240px)] overflow-auto rounded-md border border-[#6e0f1f]/45 bg-black">
        <table className="min-w-[820px] w-full border-collapse text-left text-xs">
          <thead className="sticky top-0 z-10 border-b border-[#6e0f1f]/45 bg-[#2a0a10] shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
            <tr className="border-b border-white/10">
              <th colSpan={5} className="px-3 py-1.5 text-right font-normal">
                <a
                  href="/api/admin/email-list/export"
                  className="text-[9px] uppercase tracking-[0.12em] text-[#c9a227]/70 underline decoration-[#c9a227]/30 underline-offset-2 transition hover:text-[#e8d48b]"
                  title="Download all rows as CSV"
                >
                  .csv
                </a>
              </th>
            </tr>
            <tr className="text-[11px] uppercase tracking-[0.18em] text-white/80">
              {COLS.map((c) => (
                <th key={c.key} className="whitespace-nowrap border-b border-white/10 px-3 py-3 font-normal">
                  <button
                    type="button"
                    onClick={() => onSort(c.key)}
                    className="inline-flex items-center gap-2 text-white/90 transition hover:text-[#c9a227]"
                  >
                    <span>{c.label}</span>
                    {sortKey === c.key && (
                      <span className="text-[#c9a227]">{sortDir === "asc" ? "▲" : "▼"}</span>
                    )}
                  </button>
                </th>
              ))}
              <th className="border-b border-white/10 px-3 py-3 text-right text-[10px] font-normal uppercase tracking-[0.2em] text-white/45">
                Remove
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="border-b border-white/[0.08] bg-black">
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-white/45">
                  Loading…
                </td>
              </tr>
            ) : !loadError && sorted.length === 0 ? (
              <tr className="border-b border-white/[0.08] bg-black">
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-white/45">
                  No subscribers yet.
                </td>
              </tr>
            ) : (
              sorted.map((r) => (
                <tr key={r.id} className="border-b border-white/[0.08] bg-black transition hover:bg-[#0a0a0a]">
                  <td className="px-3 py-2 font-medium text-white/95">{r.firstName}</td>
                  <td className="px-3 py-2 text-white/85">{r.lastName}</td>
                  <td className="px-3 py-2 text-white/85">{r.email}</td>
                  <td className="whitespace-nowrap px-3 py-2 text-white/75">{r.phone ?? "—"}</td>
                  <td className="px-3 py-2 text-right align-middle">
                    <button
                      type="button"
                      disabled={removingId === r.id}
                      onClick={() => void removeSubscriber(r.id)}
                      className="text-[10px] font-medium uppercase tracking-[0.15em] text-rose-400/90 underline decoration-rose-500/35 underline-offset-2 transition hover:text-rose-300 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {removingId === r.id ? "…" : "Remove"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="text-[10px] text-white/35">
        <Link href="/admin" className="text-white/50 underline hover:text-[#c9a227]">
          ← Admin
        </Link>
      </p>
    </div>
  );
}
