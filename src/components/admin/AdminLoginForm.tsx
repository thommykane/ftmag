"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
        credentials: "same-origin",
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        mustChangePassword?: boolean;
        hint?: string;
        details?: string;
        prismaCode?: string;
      };
      if (!res.ok) {
        const parts = [data.error ?? "Login failed."];
        if (data.prismaCode) parts.push(`(${data.prismaCode})`);
        if (data.details) parts.push(`\n${data.details}`);
        if (data.hint) parts.push(`\n${data.hint}`);
        setError(parts.join(""));
        return;
      }
      if (data.mustChangePassword) {
        router.replace("/admin/change-password");
        router.refresh();
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
      <label className="block space-y-2">
        <span className="text-[11px] uppercase tracking-[0.22em] text-white/60">Email</span>
        <input
          type="email"
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
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full rounded border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none backdrop-blur-sm transition focus:border-[#c9a227]/50"
        />
      </label>
      {error ? (
        <div className="whitespace-pre-wrap rounded border border-red-500/35 bg-red-950/30 px-3 py-2 text-xs leading-relaxed text-red-200">
          {error}
        </div>
      ) : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded border-2 border-[#c9a227] bg-[#6E0F1F] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-[#5a0c19] disabled:opacity-50"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
