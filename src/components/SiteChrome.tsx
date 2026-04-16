"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { VideoBackground } from "@/components/VideoBackground";

const NAV_ITEMS: { label: string; href: string; ready: boolean }[] = [
  { label: "Welcome", href: "/", ready: true },
  { label: "Our Magazine", href: "#", ready: false },
  { label: "Top Destinations", href: "#", ready: false },
  { label: "Top Restaurants", href: "#", ready: false },
  { label: "Top Chefs", href: "#", ready: false },
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
    "w-full rounded border px-3 py-2 text-left text-xs uppercase tracking-[0.18em] transition";
  const activeCls =
    "border-[#c9a227]/70 bg-[rgba(110,15,31,0.22)] text-[#6e0f1f] shadow-[inset_0_0_20px_rgba(201,162,39,0.08)]";
  const idleCls =
    "border-transparent text-[#6e0f1f]/85 hover:border-[#6e0f1f]/35 hover:bg-black/30 hover:text-[#6e0f1f]";

  if (ready) {
    return (
      <Link href={href} className={`${base} ${active ? activeCls : idleCls}`}>
        {label}
      </Link>
    );
  }

  return (
    <button
      type="button"
      title="Coming soon"
      className={`${base} cursor-default opacity-55 ${idleCls}`}
      disabled
    >
      {label}
    </button>
  );
}

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const onWelcome = pathname === "/";

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
        <nav className="hidden w-64 shrink-0 flex-col gap-1 p-4 pt-4 text-[#6e0f1f] md:flex" aria-label="Primary navigation">
          <div className="mb-3 flex w-full flex-col items-center gap-2">
            <Image
              src="/logo.png"
              alt=""
              width={175}
              height={175}
              className="h-[175px] w-[175px] object-contain opacity-95 drop-shadow-[0_0_20px_rgba(0,0,0,0.45)]"
              priority
            />
            <p className="text-center text-[10px] font-normal uppercase tracking-[0.42em] text-[#6e0f1f]/80">
              Eat. Stay. Explore.
            </p>
          </div>

          <div className="mb-2 text-[10px] tracking-[0.35em] uppercase text-[#6e0f1f]/55">Navigation</div>

          <div className="mb-3">
            <button
              type="button"
              title="Coming soon"
              className="w-full rounded border-2 border-[#6e0f1f] bg-black/55 px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6e0f1f] backdrop-blur-sm transition hover:border-[#c9a227]/80 hover:text-[#c9a227] hover:shadow-[0_0_18px_rgba(201,162,39,0.15)]"
            >
              Login
            </button>
          </div>

          <div className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <NavButton
                key={item.label}
                label={item.label}
                href={item.href}
                ready={item.ready}
                active={item.ready && item.href === "/" && onWelcome}
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
          <div className="mb-2 flex gap-2">
            <button
              type="button"
              title="Coming soon"
              className="shrink-0 rounded border-2 border-[#6e0f1f] bg-black/50 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6e0f1f]"
            >
              Login
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1">
            {NAV_ITEMS.map((item) =>
              item.ready ? (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`shrink-0 whitespace-nowrap rounded border px-3 py-2 text-[10px] uppercase tracking-[0.16em] ${
                    onWelcome && item.href === "/"
                      ? "border-[#c9a227]/70 bg-[rgba(110,15,31,0.2)] text-[#6e0f1f]"
                      : "border-[#6e0f1f]/25 text-[#6e0f1f]/85"
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  key={item.label}
                  className="shrink-0 cursor-default whitespace-nowrap rounded border border-[#6e0f1f]/15 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-[#6e0f1f]/45"
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
