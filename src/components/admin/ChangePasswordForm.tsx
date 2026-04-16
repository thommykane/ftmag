"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function ChangePasswordForm() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (newPassword !== confirm) {
      setError("New password and confirmation do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Could not update password.");
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-md space-y-4">
      <div className="rounded border border-[#c9a227]/35 bg-black/35 px-3 py-3 text-sm leading-relaxed text-white/85">
        <p className="font-semibold text-[#c9a227]">Change your password</p>
        <p className="mt-2 text-white/75">
          You signed in with a temporary password. Choose a new password (at least 8 characters) before using the admin
          tools.
        </p>
      </div>
      <label className="block space-y-2">
        <span className="text-[11px] uppercase tracking-[0.22em] text-white/60">Current password</span>
        <input
          type="password"
          autoComplete="current-password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
          className="w-full rounded border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none backdrop-blur-sm transition focus:border-[#c9a227]/50"
        />
      </label>
      <label className="block space-y-2">
        <span className="text-[11px] uppercase tracking-[0.22em] text-white/60">New password</span>
        <input
          type="password"
          autoComplete="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          minLength={8}
          className="w-full rounded border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none backdrop-blur-sm transition focus:border-[#c9a227]/50"
        />
      </label>
      <label className="block space-y-2">
        <span className="text-[11px] uppercase tracking-[0.22em] text-white/60">Confirm new password</span>
        <input
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          minLength={8}
          className="w-full rounded border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none backdrop-blur-sm transition focus:border-[#c9a227]/50"
        />
      </label>
      {error ? (
        <div className="rounded border border-red-500/35 bg-red-950/30 px-3 py-2 text-xs text-red-200">{error}</div>
      ) : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded border-2 border-[#c9a227] bg-[#6E0F1F] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-[#5a0c19] disabled:opacity-50"
      >
        {loading ? "Saving…" : "Update password"}
      </button>
    </form>
  );
}
