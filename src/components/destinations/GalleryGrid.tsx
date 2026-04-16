"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export function GalleryGrid({ images, altBase }: { images: string[]; altBase: string }) {
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);

  useEffect(() => {
    if (open === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  if (!images.length) return null;

  return (
    <>
      <div className="columns-1 gap-3 sm:columns-2 lg:columns-3">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setOpen(i)}
            className="group mb-3 w-full break-inside-avoid overflow-hidden rounded-lg border border-white/10 bg-black/40 text-left transition hover:border-[#c9a227]/40"
          >
            <div className="relative">
              <Image
                src={src}
                alt={`${altBase} — ${i + 1}`}
                width={800}
                height={1000}
                className="h-auto w-full object-cover transition duration-500 group-hover:scale-[1.03]"
              />
              <div className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/20" />
            </div>
          </button>
        ))}
      </div>

      {open !== null && images[open] && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/88 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label="Gallery image"
          onClick={close}
          onKeyDown={(e) => e.key === "Escape" && close()}
        >
          <div
            className="relative max-h-[90vh] max-w-[min(1200px,96vw)] overflow-hidden rounded-lg border border-[#c9a227]/35 shadow-[0_0_60px_rgba(0,0,0,0.8)]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[open]}
              alt={`${altBase} — enlarged`}
              width={1400}
              height={1000}
              className="max-h-[90vh] w-auto object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
