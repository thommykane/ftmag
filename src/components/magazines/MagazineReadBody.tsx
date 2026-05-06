"use client";

import { useEffect, useState } from "react";
import { MagazineFlipBook } from "@/components/magazines/MagazineFlipBook";
import type { MagazineIssue } from "@/lib/magazines/types";

export function MagazineReadBody({ issue }: { issue: MagazineIssue }) {
  const flip = issue.flipbookUrl.trim();
  const hasFlip = flip.startsWith("http");
  const pdf = issue.pdfSrc.trim();
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    setIframeLoaded(false);
  }, [flip]);

  if (hasFlip) {
    return (
      <div className="w-full max-w-[1200px]">
        <div className="relative overflow-hidden rounded-xl border border-zinc-200 bg-zinc-950 shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
          <div className="relative min-h-[70vh] w-full bg-zinc-950 md:min-h-[min(85vh,880px)]">
            {!iframeLoaded ? (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-zinc-950">
                <span
                  className="h-10 w-10 animate-spin rounded-full border-2 border-[#c9a227]/30 border-t-[#c9a227]"
                  aria-hidden
                />
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-white/70">Loading edition…</p>
              </div>
            ) : null}
            <iframe
              title={issue.displayTitle}
              src={flip}
              className={`block h-[min(85vh,880px)] min-h-[70vh] w-full border-0 bg-zinc-950 transition-opacity duration-300 ${
                iframeLoaded ? "opacity-100" : "opacity-0"
              }`}
              allowFullScreen
              allow="fullscreen; autoplay; clipboard-write"
              onLoad={() => setIframeLoaded(true)}
            />
          </div>
        </div>
      </div>
    );
  }

  if (pdf) {
    return <MagazineFlipBook pdfUrl={pdf} title={issue.displayTitle} />;
  }

  return (
    <p className="max-w-md text-center text-sm text-zinc-600">
      This issue does not have a digital edition configured yet. Please check back soon.
    </p>
  );
}
