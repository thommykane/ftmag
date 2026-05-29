"use client";

import { useEffect, useState } from "react";
import type { AdBannerDTO } from "@/lib/banners/queries";

const ROTATE_MS = 6000;
const FADE_MS = 700;

type Props = {
  banners: AdBannerDTO[];
};

export function BannerRotator({ banners }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % banners.length);
    }, ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) return null;

  return (
    <div
      className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-lg border border-[#c9a227]/25 bg-black/40 shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
      aria-label="Partner destinations"
      role="region"
    >
      <div className="relative flex min-h-[72px] items-center justify-center sm:min-h-[90px] md:min-h-[100px]">
        {banners.map((banner, i) => (
          <a
            key={banner.id}
            href={banner.href}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className={`absolute inset-0 flex items-center justify-center px-2 py-2 transition-opacity ease-in-out sm:px-4 sm:py-3 ${
              i === index ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0"
            }`}
            style={{ transitionDuration: `${FADE_MS}ms` }}
            aria-hidden={i !== index}
            tabIndex={i === index ? 0 : -1}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={banner.imageSrc}
              alt={banner.label || "Advertisement"}
              className="max-h-[72px] w-auto max-w-full object-contain sm:max-h-[90px] md:max-h-[100px]"
            />
          </a>
        ))}
      </div>
      {banners.length > 1 ? (
        <div className="flex justify-center gap-1.5 border-t border-white/10 bg-black/30 px-3 py-2">
          {banners.map((banner, i) => (
            <button
              key={banner.id}
              type="button"
              aria-label={`Show banner ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              onClick={() => setIndex(i)}
              className={`h-1.5 w-1.5 rounded-full transition ${
                i === index ? "bg-[#c9a227]" : "bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
