"use client";

import { FormEvent, useState } from "react";

export function CreateUserForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          email: email.trim(),
          password,
          phone: phone.trim(),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; ok?: boolean };
      if (!res.ok) {
        setError(data.error ?? "Could not create user.");
        return;
      }
      setOk(`Account created for ${email.trim().toLowerCase()}.`);
      setEmail("");
      setPassword("");
      setPhone("");
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-md space-y-4">
      <label className="block space-y-2">
        <span className="text-[11px] uppercase tracking-[0.22em] text-white/60">Email</span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none backdrop-blur-sm transition focus:border-[#c9a227]/50"
        />
      </label>
      <label className="block space-y-2">
        <span className="text-[11px] uppercase tracking-[0.22em] text-white/60">Password</span>
        <input
          type="password"
          name="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="w-full rounded border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none backdrop-blur-sm transition focus:border-[#c9a227]/50"
        />
      </label>
      <label className="block space-y-2">
        <span className="text-[11px] uppercase tracking-[0.22em] text-white/60">Phone</span>
        <input
          type="tel"
          name="phone"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="w-full rounded border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none backdrop-blur-sm transition focus:border-[#c9a227]/50"
        />
      </label>
      {error ? (
        <div className="rounded border border-red-500/35 bg-red-950/30 px-3 py-2 text-xs text-red-200">{error}</div>
      ) : null}
      {ok ? (
        <div className="rounded border border-emerald-500/35 bg-emerald-950/30 px-3 py-2 text-xs text-emerald-200">{ok}</div>
      ) : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded border border-emerald-500/40 px-4 py-2.5 text-xs uppercase tracking-[0.22em] text-emerald-300 transition hover:shadow-[0_0_16px_rgba(16,185,129,0.2)] disabled:opacity-50"
      >
        {loading ? "Creating…" : "Create account"}
      </button>
    </form>
  );
}
