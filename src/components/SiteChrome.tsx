"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useCallback, useEffect, useState } from "react";
import { VideoBackground } from "@/components/VideoBackground";

function isNavActive(href: string, pathname: string): boolean {
  if (!href || href === "#") return false;
  if (href === "/") return pathname === "/";
  if (href === "/top-destinations") {
    return pathname === "/top-destinations" || pathname.startsWith("/visit/");
  }
  if (href === "/top-restaurants") {
    return pathname === "/top-restaurants" || pathname.startsWith("/top-restaurants/");
  }
  if (href === "/seasonal-travel-vacation-spots") {
    return pathname === "/seasonal-travel-vacation-spots";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

const NAV_ITEMS: { label: string; href: string; ready: boolean }[] = [
  { label: "Welcome", href: "/", ready: true },
  { label: "Our Magazine", href: "#", ready: false },
  { label: "Seasonal Travel", href: "/seasonal-travel-vacation-spots", ready: true },
  { label: "Discover & Explore", href: "#", ready: false },
  { label: "Top Destinations", href: "/top-destinations", ready: true },
  { label: "Top Restaurants", href: "/top-restaurants", ready: true },
  { label: "Top Chefs", href: "/top-chefs", ready: true },
  { label: "Vacation in a Box", href: "#", ready: false },
  { label: "Plan Your Trip", href: "#", ready: false },
  { label: "Our Products", href: "#", ready: false },
  { label: "Advertise", href: "#", ready: false },
];

function NavButton({
  label,
  href,
  active,
  ready,
}: {
  label: string;
  href: string;
  active: boolean;
  ready: boolean;
}) {
  const base =
    "block w-full min-w-0 shrink overflow-hidden text-ellipsis whitespace-nowrap rounded border px-2.5 py-2 text-left text-[10px] uppercase leading-none tracking-[0.1em] transition";
  const activeCls =
    "border-[#c9a227]/80 bg-white/10 text-white shadow-[inset_0_0_20px_rgba(201,162,39,0.06)]";
  const idleCls =
    "border-transparent text-white hover:border-white/20 hover:bg-white/5 hover:text-white";

  if (ready) {
    return (
      <Link href={href} title={label} className={`${base} ${active ? activeCls : idleCls}`}>
        {label}
      </Link>
    );
  }

  return (
    <button
      type="button"
      title="Coming soon"
      className={`${base} cursor-default border-transparent text-white/45`}
      disabled
    >
      {label}
    </button>
  );
}

const adminLinkClass =
  "block w-full text-center text-[10px] uppercase tracking-[0.22em] text-[#c9a227]/90 underline decoration-[#c9a227]/45 underline-offset-[3px] transition hover:text-[#e8d48b] hover:decoration-[#e8d48b]/55";

const loginBtnClass =
  "block w-full rounded border-2 border-[#c9a227] bg-[#6E0F1F] px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-white shadow-[0_4px_20px_rgba(0,0,0,0.35)] transition hover:bg-[#5a0c19] hover:shadow-[0_0_22px_rgba(201,162,39,0.25)]";

const logoutBtnClass =
  "w-full rounded border-2 border-white/40 bg-black/40 px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm transition hover:border-[#c9a227]/50 hover:bg-black/55";

function SidebarAuthBlock() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ email: string } | null>(null);

  const refreshMe = useCallback(() => {
    void fetch("/api/auth/me", { credentials: "same-origin", cache: "no-store" })
      .then((r) => r.json())
      .then((d: { user?: { email: string } | null }) => {
        setUser(d.user ?? null);
      })
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    refreshMe();
  }, [pathname, refreshMe]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" });
    setUser(null);
    router.refresh();
  }

  const adminActive = pathname.startsWith("/admin");

  return (
    <div className="mb-3 flex flex-col gap-2">
      {user ? (
        <>
          <Link
            href="/admin"
            className={`${adminLinkClass} ${adminActive ? "text-[#e8d48b]" : ""}`}
          >
            Admin
          </Link>
          <button type="button" onClick={() => void logout()} className={logoutBtnClass}>
            Log out
          </button>
        </>
      ) : (
        <Link href="/admin/login" className={loginBtnClass}>
          Login
        </Link>
      )}
    </div>
  );
}

function MobileAuthRow() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ email: string } | null>(null);

  const refreshMe = useCallback(() => {
    void fetch("/api/auth/me", { credentials: "same-origin", cache: "no-store" })
      .then((r) => r.json())
      .then((d: { user?: { email: string } | null }) => setUser(d.user ?? null))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    refreshMe();
  }, [pathname, refreshMe]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" });
    setUser(null);
    router.refresh();
  }

  const adminActive = pathname.startsWith("/admin");

  return (
    <div className="mb-2 flex flex-col gap-2">
      {user ? (
        <>
          <Link
            href="/admin"
            className={`text-center text-[10px] uppercase tracking-[0.2em] text-[#c9a227]/90 underline decoration-[#c9a227]/45 underline-offset-2 ${adminActive ? "text-[#e8d48b]" : ""}`}
          >
            Admin
          </Link>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => void logout()}
              className="shrink-0 rounded border-2 border-white/40 bg-black/40 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white"
            >
              Log out
            </button>
          </div>
        </>
      ) : (
        <div className="flex gap-2">
          <Link
            href="/admin/login"
            className="shrink-0 rounded border-2 border-[#c9a227] bg-[#6E0F1F] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white shadow-[0_4px_16px_rgba(0,0,0,0.35)]"
          >
            Login
          </Link>
        </div>
      )}
    </div>
  );
}

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="relative min-h-screen">
      <VideoBackground />

      {/* Mobile logo */}
      <div className="pointer-events-none fixed left-1/2 top-4 z-20 -translate-x-1/2 select-none md:hidden">
        <Image
          src="/logo.png"
          alt="Food and Travel Magazine"
          width={175}
          height={175}
          className="pointer-events-auto h-[175px] w-[175px] object-contain opacity-95 drop-shadow-[0_0_24px_rgba(0,0,0,0.5)]"
          priority
        />
      </div>

      <div className="relative z-10 mx-auto flex max-w-[1920px] min-h-screen">
        <nav className="hidden w-80 min-w-0 shrink-0 flex-col gap-1 p-4 pt-4 text-white md:flex" aria-label="Primary navigation">
          <div className="mb-3 flex w-full flex-col items-center gap-2">
            <Image
              src="/logo.png"
              alt=""
              width={175}
              height={175}
              className="h-[175px] w-[175px] object-contain opacity-95 drop-shadow-[0_0_20px_rgba(0,0,0,0.45)]"
              priority
            />
            <p className="text-center text-[10px] font-normal uppercase tracking-[0.42em] text-white/90">
              Eat. Stay. Explore.
            </p>
          </div>

          <SidebarAuthBlock />

          <div className="min-w-0 space-y-1">
            {NAV_ITEMS.map((item) => (
              <NavButton
                key={item.label}
                label={item.label}
                href={item.href}
                ready={item.ready}
                active={item.ready && isNavActive(item.href, pathname)}
              />
            ))}
          </div>
        </nav>

        <main className="flex min-h-screen min-w-0 flex-1 flex-col gap-4 pl-4 pr-2 pb-36 pt-44 md:pb-6 md:pl-2 md:pr-2 md:pt-4">
          {children}
        </main>
      </div>

      <nav className="fixed bottom-4 left-4 right-4 z-20 md:hidden" aria-label="Mobile navigation">
        <div className="ftmag-panel rounded-lg p-2">
          <MobileAuthRow />
          <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1">
            {NAV_ITEMS.map((item) =>
              item.ready ? (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`shrink-0 whitespace-nowrap rounded border px-3 py-2 text-[10px] uppercase tracking-[0.16em] ${
                    isNavActive(item.href, pathname)
                      ? "border-[#c9a227]/80 bg-white/10 text-white"
                      : "border-white/20 text-white hover:border-white/35"
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  key={item.label}
                  className="shrink-0 cursor-default whitespace-nowrap rounded border border-white/15 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-white/45"
                  title="Coming soon"
                >
                  {item.label}
                </span>
              ),
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
