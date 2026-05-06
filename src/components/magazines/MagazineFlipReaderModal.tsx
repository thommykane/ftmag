"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export type FlipReaderIssue = {
  slug: string;
  displayTitle: string;
  coverSrc: string;
  flipbookUrl: string;
};

type Props = {
  issue: FlipReaderIssue | null;
  open: boolean;
  onClose: () => void;
};

export function MagazineFlipReaderModal({ issue, open, onClose }: Props) {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    setIframeLoaded(false);
  }, [issue?.flipbookUrl, open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const onBackdropPointerDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose],
  );

  if (!open || !issue) return null;

  const src = issue.flipbookUrl.trim();

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/88 backdrop-blur-[2px] p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Food & Travel Magazine reader — ${issue.displayTitle}`}
      onMouseDown={onBackdropPointerDown}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-[210] flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-zinc-950/90 text-lg font-light text-white shadow-lg transition hover:border-[#c9a227]/50 hover:bg-zinc-900 hover:text-[#e8d48b]"
        aria-label="Close reader"
      >
        ×
      </button>

      <div
        className="relative flex h-[100dvh] w-screen flex-col md:h-[90vh] md:w-[95vw]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="relative flex min-h-0 flex-1 flex-col bg-zinc-950 shadow-[0_0_80px_rgba(0,0,0,0.65)] md:rounded-sm md:border md:border-white/10">
          <div className="flex shrink-0 items-center gap-3 border-b border-white/10 px-4 py-3 md:px-5">
            <div className="relative h-11 w-8 shrink-0 overflow-hidden rounded border border-white/10 bg-zinc-900">
              <Image src={issue.coverSrc} alt="" fill className="object-cover" sizes="32px" />
            </div>
            <p className="truncate font-display text-sm font-semibold tracking-wide text-white md:text-base">
              {issue.displayTitle}
            </p>
          </div>

          <div className="relative min-h-0 flex-1 bg-zinc-950">
            {!iframeLoaded ? (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-zinc-950 text-white">
                <span
                  className="h-9 w-9 animate-spin rounded-full border-2 border-[#c9a227]/30 border-t-[#c9a227]"
                  aria-hidden
                />
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-white/70">Loading edition…</p>
              </div>
            ) : null}
            <iframe
              title={issue.displayTitle}
              src={src}
              className={`h-full w-full border-0 bg-zinc-950 transition-opacity duration-300 ${
                iframeLoaded ? "opacity-100" : "opacity-0"
              }`}
              allowFullScreen
              allow="fullscreen; autoplay; clipboard-write"
              onLoad={() => setIframeLoaded(true)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
