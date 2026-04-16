"use client";

export function AdminLogoutButton() {
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" });
    window.location.href = "/";
  }

  return (
    <button
      type="button"
      onClick={() => void logout()}
      className="rounded border border-white/25 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80 transition hover:border-[#c9a227]/50 hover:text-white"
    >
      Log out
    </button>
  );
}
