"use client";

import dynamic from "next/dynamic";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";

// react-pageflip has incomplete typings for dynamic import + stretch props
const HTMLFlipBook = dynamic(() => import("react-pageflip"), { ssr: false }) as React.ComponentType<
  Record<string, unknown>
>;

const TurnPage = forwardRef<HTMLDivElement, { src: string }>(({ src }, ref) => (
  <div ref={ref} className="h-full w-full bg-white shadow-inner">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={src} alt="" className="h-full w-full object-contain" draggable={false} />
  </div>
));
TurnPage.displayName = "TurnPage";

type FlipBookRef = { pageFlip: () => PageFlipApi | null };
type PageFlipApi = {
  flipNext: (corner?: string) => void;
  flipPrev: (corner?: string) => void;
  getCurrentPageIndex: () => number;
  getPageCount: () => number;
};

const PAGE_TURN_SOUND = "/page-turn.mp3";

export function MagazineFlipBook({ pdfUrl, title }: { pdfUrl: string; title: string }) {
  const bookRef = useRef<FlipBookRef | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const skipNextFlipSound = useRef(true);
  const [pageImages, setPageImages] = useState<string[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [isFs, setIsFs] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    setPageImages([]);

    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        // Same-origin worker in /public — avoids CDN .mjs failures (CSP, offline, wrong path for v3.11)
        pdfjs.GlobalWorkerOptions.workerSrc = new URL("/pdf.worker.min.js", window.location.href).href;

        const absoluteUrl = new URL(pdfUrl, typeof window !== "undefined" ? window.location.origin : "http://localhost").href;
        const pdf = await pdfjs.getDocument({ url: absoluteUrl }).promise;
        const n = pdf.numPages;
        const targetW = 440;
        const urls: string[] = [];

        for (let i = 1; i <= n; i++) {
          if (cancelled) return;
          const page = await pdf.getPage(i);
          const base = page.getViewport({ scale: 1 });
          const scale = targetW / base.width;
          const viewport = page.getViewport({ scale });
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) throw new Error("Canvas unsupported");
          canvas.width = Math.floor(viewport.width);
          canvas.height = Math.floor(viewport.height);
          await page.render({ canvasContext: ctx, viewport }).promise;
          urls.push(canvas.toDataURL("image/jpeg", 0.92));
        }

        if (!cancelled) {
          setPageImages(urls);
          setPageCount(urls.length);
          setPageIndex(0);
          skipNextFlipSound.current = true;
        }
      } catch (e) {
        if (!cancelled) {
          setLoadError(e instanceof Error ? e.message : "Could not load this issue.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pdfUrl]);

  useEffect(() => {
    const onFsChange = () => setIsFs(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const playTurnSound = useCallback(() => {
    const a = new Audio(PAGE_TURN_SOUND);
    a.volume = 0.45;
    void a.play().catch(() => {});
  }, []);

  const onFlip = useCallback(
    (e: { data: number }) => {
      setPageIndex(e.data);
      if (skipNextFlipSound.current) {
        skipNextFlipSound.current = false;
        return;
      }
      playTurnSound();
    },
    [playTurnSound],
  );

  const onInit = useCallback(() => {
    const api = bookRef.current?.pageFlip?.();
    if (api) {
      setPageIndex(api.getCurrentPageIndex());
      setPageCount(api.getPageCount());
    }
  }, []);

  const goNext = useCallback(() => {
    bookRef.current?.pageFlip?.()?.flipNext("top");
  }, []);

  const goPrev = useCallback(() => {
    bookRef.current?.pageFlip?.()?.flipPrev("top");
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const el = containerRef.current;
    if (!el) return;
    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      /* ignore */
    }
  }, []);

  const displayPage = pageCount > 0 ? pageIndex + 1 : 0;

  return (
    <div ref={containerRef} className="flex w-full flex-col items-center gap-4 bg-zinc-900/40 p-4 md:p-6">
      <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a227]/90">
        {title}
      </p>

      {loading && (
        <p className="text-sm text-white/80">Loading issue…</p>
      )}
      {loadError && (
        <p className="max-w-md text-center text-sm text-red-200">{loadError}</p>
      )}

      {!loading && !loadError && pageImages.length > 0 && (
        <>
          <div className="w-full max-w-[min(100%,920px)] overflow-x-auto">
            <div className="mx-auto flex min-h-[min(70vh,640px)] justify-center py-2">
              <HTMLFlipBook
                ref={bookRef}
                width={420}
                height={595}
                size="stretch"
                minWidth={280}
                maxWidth={900}
                minHeight={400}
                maxHeight={1200}
                maxShadowOpacity={0.6}
                showCover
                mobileScrollSupport
                className="mx-auto"
                style={{}}
                onFlip={onFlip}
                onInit={onInit}
              >
                {pageImages.map((src, i) => (
                  <TurnPage key={i} src={src} />
                ))}
              </HTMLFlipBook>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={goPrev}
              disabled={pageIndex <= 0}
              className="rounded border border-white/25 bg-black/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-black/50 disabled:opacity-35"
              aria-label="Previous page"
            >
              ← Prev
            </button>
            <span className="text-sm tabular-nums text-white/90">
              Page {displayPage} / {pageCount}
            </span>
            <button
              type="button"
              onClick={goNext}
              disabled={pageIndex >= pageCount - 1}
              className="rounded border border-white/25 bg-black/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-black/50 disabled:opacity-35"
              aria-label="Next page"
            >
              Next →
            </button>
            <button
              type="button"
              onClick={() => void toggleFullscreen()}
              className="rounded border border-[#c9a227]/50 bg-[#6E0F1F]/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-[#5a0c19]"
            >
              {isFs ? "Minimize" : "Fullscreen"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
