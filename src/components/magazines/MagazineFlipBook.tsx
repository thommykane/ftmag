"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const PAGE_TURN_SOUND = "/page-turn.mp3";

/** Stay under conservative canvas limits — large bitmaps stall GPU copy and look “stuck forever”. */
const MAX_CANVAS_EDGE = 4096;
const MAX_CANVAS_PIXELS = 48_000_000;
const GET_PAGE_TIMEOUT_MS = 45_000;
const RENDER_TIMEOUT_MS = 45_000;
/** Spread mode: cap sharpness so two pages never overload the worker/GPU. */
const MAX_RENDER_DPR = 1.25;

function spreadCountFromTotal(total: number) {
  if (total <= 0) return 0;
  return Math.ceil(total / 2);
}

function isBenignPdfRenderError(e: unknown) {
  const message = e instanceof Error ? e.message : String(e);
  return /cancel|cancell?ed|abort|destroy|transport|worker/i.test(message);
}

export function MagazineFlipBook({ pdfUrl, title }: { pdfUrl: string; title: string }) {
  const shellRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const canvasLeftRef = useRef<HTMLCanvasElement>(null);
  const canvasRightRef = useRef<HTMLCanvasElement>(null);
  const pdfRef = useRef<import("pdfjs-dist/types/src/display/api").PDFDocumentProxy | null>(null);
  const renderGen = useRef(0);
  const inflightRenderTasksRef = useRef<Array<{ cancel: () => void }>>([]);

  const cancelInflightPdfRenders = useCallback(() => {
    for (const t of inflightRenderTasksRef.current) {
      try {
        t.cancel();
      } catch {
        /* ignore */
      }
    }
    inflightRenderTasksRef.current = [];
  }, []);

  const withTimeout = useCallback(<T,>(p: Promise<T>, ms: number, label: string): Promise<T> => {
    return new Promise((resolve, reject) => {
      const id = window.setTimeout(() => {
        reject(new Error(`${label} timed out after ${ms / 1000}s`));
      }, ms);
      p.then(
        (v) => {
          window.clearTimeout(id);
          resolve(v);
        },
        (e) => {
          window.clearTimeout(id);
          reject(e);
        },
      );
    });
  }, []);

  const [numPages, setNumPages] = useState(0);
  /** 0-based spread index: spread 0 = PDF pages 1–2, spread 1 = 3–4, … last spread may show a single page if total is odd. */
  const [spreadIdx, setSpreadIdx] = useState(0);
  const [phase, setPhase] = useState<"loading-pdf" | "rendering" | "ready" | "error">("loading-pdf");
  const [loadPct, setLoadPct] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFs, setIsFs] = useState(false);

  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  const playTurnSound = useCallback(() => {
    const a = new Audio(PAGE_TURN_SOUND);
    a.volume = 0.42;
    void a.play().catch(() => {});
  }, []);

  useEffect(() => {
    let cancelled = false;
    pdfRef.current = null;
    setPhase("loading-pdf");
    setError(null);
    setLoadPct(null);
    setNumPages(0);
    setSpreadIdx(0);

    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = new URL("/pdf.worker.min.js", window.location.href).href;

        const absoluteUrl = new URL(pdfUrl, window.location.origin).href;

        /**
         * Prefer full-file load into memory + disableRange/disableStream.
         * Range/stream fetching often breaks mid-document page extraction on CDNs / Blob hosts
         * (symptom: spinner forever around ~page 10).
         */
        let loadingTask: import("pdfjs-dist/types/src/display/api").PDFDocumentLoadingTask;

        try {
          const ac = new AbortController();
          const dlTimeout = window.setTimeout(() => ac.abort(), 180_000);
          const res = await fetch(absoluteUrl, {
            mode: "cors",
            credentials: "omit",
            signal: ac.signal,
          });
          window.clearTimeout(dlTimeout);
          if (!res.ok) throw new Error(`PDF download failed (${res.status})`);
          const buf = await res.arrayBuffer();
          if (cancelled) return;
          loadingTask = pdfjs.getDocument({
            data: new Uint8Array(buf),
            disableRange: true,
            disableStream: true,
          });
        } catch {
          loadingTask = pdfjs.getDocument({
            url: absoluteUrl,
            disableRange: true,
            disableStream: true,
          });
        }

        loadingTask.onProgress = (p: { loaded: number; total: number }) => {
          if (cancelled || p.total <= 0) return;
          setLoadPct(Math.round((100 * p.loaded) / p.total));
        };

        const pdf = await loadingTask.promise;
        if (cancelled) {
          void pdf.destroy().catch(() => {});
          return;
        }

        pdfRef.current = pdf;
        setNumPages(pdf.numPages);
        setPhase("rendering");
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Could not load this issue.");
          setPhase("error");
        }
      }
    })();

    return () => {
      cancelled = true;
      cancelInflightPdfRenders();
      const p = pdfRef.current;
      pdfRef.current = null;
      if (p) void p.destroy().catch(() => {});
    };
  }, [pdfUrl, cancelInflightPdfRenders]);

  const drawSpread = useCallback(
    async (sIdx: number, generation: number) => {
      cancelInflightPdfRenders();

      const finishIfCurrent = () => {
        if (generation === renderGen.current) setPhase("ready");
      };

      const pdf = pdfRef.current;
      const leftCanvas = canvasLeftRef.current;
      const rightCanvas = canvasRightRef.current;
      const viewer = viewerRef.current;
      if (!pdf || !leftCanvas || !rightCanvas || !viewer) {
        finishIfCurrent();
        return;
      }

      const total = pdf.numPages;
      if (total < 1) {
        finishIfCurrent();
        return;
      }

    const leftNum = sIdx * 2 + 1;
    const rightNum = sIdx * 2 + 2 <= total ? sIdx * 2 + 2 : null;
    const isSpread = rightNum !== null;

    let vw = viewer.clientWidth;
    let vh = viewer.clientHeight;
    if (vw < 32 || vh < 32) {
      await new Promise<void>((r) => requestAnimationFrame(() => r()));
      await new Promise<void>((r) => requestAnimationFrame(() => r()));
      vw = viewer.clientWidth;
      vh = viewer.clientHeight;
    }
    if (vw < 32 || vh < 32) {
      finishIfCurrent();
      return;
    }

    const pad = 12;
    const gutter = 10;
    const innerW = Math.max(vw - pad * 2, 64);
    const innerH = Math.max(vh - pad * 2, 64);
    const halfW = (innerW - gutter) / 2;
    const maxH = innerH;

    let dpr = Math.min(
      typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1,
      MAX_RENDER_DPR,
    );

    const renderSide = async (pageNum: number | null, canvas: HTMLCanvasElement, boxW: number) => {
      if (pageNum === null || pageNum < 1 || pageNum > total) {
        canvas.width = 0;
        canvas.height = 0;
        canvas.style.width = "0px";
        canvas.style.height = "0px";
        canvas.style.opacity = "0";
        canvas.style.visibility = "hidden";
        return;
      }

      canvas.style.opacity = "1";
      canvas.style.visibility = "visible";

      const pdfPage = await withTimeout(pdf.getPage(pageNum), GET_PAGE_TIMEOUT_MS, `Load page ${pageNum}`);
      if (generation !== renderGen.current) return;

      const base = pdfPage.getViewport({ scale: 1 });
      let scaleFit = Math.min(boxW / base.width, maxH / base.height);
      let viewport = pdfPage.getViewport({ scale: scaleFit * dpr });

      let guard = 0;
      while (
        guard < 16 &&
        (viewport.width > MAX_CANVAS_EDGE ||
          viewport.height > MAX_CANVAS_EDGE ||
          viewport.width * viewport.height > MAX_CANVAS_PIXELS)
      ) {
        scaleFit *= 0.75;
        viewport = pdfPage.getViewport({ scale: scaleFit * dpr });
        guard += 1;
      }
      if (viewport.width > MAX_CANVAS_EDGE || viewport.height > MAX_CANVAS_EDGE || viewport.width * viewport.height > MAX_CANVAS_PIXELS) {
        dpr = Math.min(dpr, 1);
        scaleFit = Math.min(boxW / base.width, maxH / base.height) * 0.55;
        viewport = pdfPage.getViewport({ scale: scaleFit * dpr });
      }

      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      canvas.style.width = `${viewport.width / dpr}px`;
      canvas.style.height = `${viewport.height / dpr}px`;

      if (generation !== renderGen.current) return;

      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) return;

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const renderTask = pdfPage.render({ canvasContext: ctx, viewport, intent: "display" });
      inflightRenderTasksRef.current.push(renderTask);

      try {
        await withTimeout(renderTask.promise, RENDER_TIMEOUT_MS, `Draw page ${pageNum}`);
      } catch (err) {
        try {
          renderTask.cancel();
        } catch {
          /* ignore */
        }
        throw err;
      } finally {
        inflightRenderTasksRef.current = inflightRenderTasksRef.current.filter((t) => t !== renderTask);
      }
    };

    await renderSide(leftNum, leftCanvas, isSpread ? halfW : innerW);
    if (generation !== renderGen.current) return;
    await renderSide(rightNum, rightCanvas, halfW);
    if (generation !== renderGen.current) return;

    setPhase("ready");
    },
    [cancelInflightPdfRenders, withTimeout],
  );

  useEffect(() => {
    if (phaseRef.current === "loading-pdf" || phaseRef.current === "error" || !numPages) return;

    renderGen.current += 1;
    const gen = renderGen.current;

    let alive = true;
    void (async () => {
      try {
        await drawSpread(spreadIdx, gen);
      } catch (e) {
        if (!alive || gen !== renderGen.current) return;
        if (isBenignPdfRenderError(e)) return;
        setError(e instanceof Error ? e.message : "Could not render this spread.");
        setPhase("error");
      }
    })();

    return () => {
      alive = false;
    };
  }, [spreadIdx, numPages, drawSpread]);

  useEffect(() => {
    if (phase !== "ready" && phase !== "rendering") return;
    const viewer = viewerRef.current;
    if (!viewer) return;

    let lastW = 0;
    let lastH = 0;
    let t: ReturnType<typeof setTimeout>;
    const ro = new ResizeObserver(() => {
      clearTimeout(t);
      t = setTimeout(() => {
        const w = viewer.clientWidth;
        const h = viewer.clientHeight;
        if (w === lastW && h === lastH) return;
        if (Math.abs(w - lastW) < 3 && Math.abs(h - lastH) < 3 && lastW > 0) return;
        lastW = w;
        lastH = h;
        renderGen.current += 1;
        const gen = renderGen.current;
        void (async () => {
          try {
            await drawSpread(spreadIdx, gen);
          } catch (e) {
            if (gen !== renderGen.current) return;
            if (isBenignPdfRenderError(e)) return;
            setError(e instanceof Error ? e.message : "Could not render this spread.");
            setPhase("error");
          }
        })();
      }, 280);
    });
    lastW = viewer.clientWidth;
    lastH = viewer.clientHeight;
    ro.observe(viewer);
    return () => {
      clearTimeout(t);
      ro.disconnect();
    };
  }, [phase, spreadIdx, drawSpread]);

  useEffect(() => {
    const onFs = () => setIsFs(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const totalPages = Math.max(numPages, pdfRef.current?.numPages ?? 0);
  const spreads = spreadCountFromTotal(totalPages);
  const leftLabel = spreadIdx * 2 + 1;
  const rightLabel = spreadIdx * 2 + 2 <= totalPages ? spreadIdx * 2 + 2 : null;
  const isSpread = rightLabel !== null;

  const goNextRef = useRef<() => void>(() => {});
  const goPrevRef = useRef<() => void>(() => {});

  const goNext = useCallback(() => {
    setSpreadIdx((s) => {
      const total = pdfRef.current?.numPages ?? numPages;
      const maxS = spreadCountFromTotal(total) - 1;
      if (s >= maxS) return s;
      playTurnSound();
      setPhase("rendering");
      return s + 1;
    });
  }, [numPages, playTurnSound]);

  const goPrev = useCallback(() => {
    setSpreadIdx((s) => {
      if (s <= 0) return s;
      playTurnSound();
      setPhase("rendering");
      return s - 1;
    });
  }, [playTurnSound]);

  goNextRef.current = goNext;
  goPrevRef.current = goPrev;

  useEffect(() => {
    if (phase !== "ready") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        goNextRef.current();
      }
      if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        goPrevRef.current();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase]);

  const toggleFullscreen = useCallback(async () => {
    const el = shellRef.current;
    if (!el) return;
    try {
      if (!document.fullscreenElement) await el.requestFullscreen();
      else await document.exitFullscreen();
    } catch {
      /* ignore */
    }
  }, []);

  const busy = phase === "loading-pdf" || phase === "rendering";
  const canPrev = spreadIdx > 0 && !busy;
  const canNext = spreadIdx < spreads - 1 && !busy;

  return (
    <div
      ref={shellRef}
      className={
        isFs
          ? "fixed inset-0 z-[100] flex h-[100dvh] max-h-[100dvh] w-full flex-col overflow-hidden bg-zinc-950 text-white"
          : "flex w-full max-w-[880px] flex-col gap-3 overflow-hidden rounded-xl border border-white/12 bg-zinc-900/50 p-3 shadow-xl md:gap-4 md:p-5"
      }
      style={isFs ? { paddingBottom: "env(safe-area-inset-bottom, 0px)" } : undefined}
    >
      {!isFs && (
        <p className="text-center text-[10px] font-semibold uppercase tracking-[0.25em] text-[#c9a227]/90">{title}</p>
      )}
      {isFs && (
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 px-3 py-2 md:px-4">
          <p className="truncate text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a227]/95">{title}</p>
          <button
            type="button"
            onClick={() => void toggleFullscreen()}
            className="shrink-0 rounded border border-white/25 bg-black/40 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-white hover:bg-black/55"
          >
            Exit fullscreen
          </button>
        </div>
      )}

      {phase === "loading-pdf" && (
        <div className="flex flex-col items-center gap-2 py-10 text-sm text-white/85">
          <p>Opening issue…</p>
          {loadPct !== null ? (
            <>
              <div className="h-1.5 w-48 overflow-hidden rounded-full bg-white/10">
                <div className="h-full bg-[#c9a227] transition-[width] duration-300" style={{ width: `${loadPct}%` }} />
              </div>
              <p className="text-xs tabular-nums text-white/60">{loadPct}%</p>
            </>
          ) : (
            <p className="text-xs text-white/50">Starting download…</p>
          )}
        </div>
      )}

      {phase === "error" && error && <p className="max-w-md px-4 py-8 text-center text-sm text-red-200">{error}</p>}

      {(phase === "ready" || phase === "rendering") && numPages > 0 && (
        <>
          <div
            ref={viewerRef}
            className={
              isFs
                ? "relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden px-2 pb-1 pt-2 md:px-4"
                : "relative mx-auto flex h-[min(68vh,560px)] w-full max-w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-zinc-950/70 px-1 md:h-[min(70vh,600px)]"
            }
          >
            <div
              className={`relative flex max-h-full max-w-full items-center justify-center transition-opacity duration-200 ease-out ${busy ? "opacity-75" : "opacity-100"}`}
            >
              <div
                className={`flex max-h-full items-stretch ${isSpread ? "gap-1.5 md:gap-2.5" : "justify-center"} `}
              >
                <canvas
                  ref={canvasLeftRef}
                  className={`pointer-events-none h-auto max-h-full w-auto shrink bg-white shadow-[4px_4px_24px_rgba(0,0,0,0.35)] ${isSpread ? "max-w-[50%]" : "max-w-full"}`}
                />
                {isSpread && (
                  <div
                    className="w-px shrink-0 self-stretch bg-gradient-to-b from-transparent via-zinc-500/80 to-transparent"
                    aria-hidden
                  />
                )}
                <canvas
                  ref={canvasRightRef}
                  className="pointer-events-none h-auto max-h-full w-auto max-w-[50%] shrink bg-white shadow-[-4px_4px_24px_rgba(0,0,0,0.35)]"
                />
              </div>
            </div>

            {/* Tap left / right to turn (above canvases) */}
            <button
              type="button"
              aria-label="Previous spread"
              disabled={!canPrev}
              onClick={() => canPrev && goPrev()}
              className={`absolute inset-y-0 left-0 z-20 w-1/2 bg-transparent ${canPrev ? "cursor-w-resize" : "pointer-events-none cursor-default"}`}
            />
            <button
              type="button"
              aria-label="Next spread"
              disabled={!canNext}
              onClick={() => canNext && goNext()}
              className={`absolute inset-y-0 right-0 z-20 w-1/2 bg-transparent ${canNext ? "cursor-e-resize" : "pointer-events-none cursor-default"}`}
            />

            {busy && phase === "rendering" && (
              <p className="pointer-events-none absolute bottom-3 z-30 rounded bg-black/55 px-2 py-1 text-[10px] text-white/80">
                Rendering…
              </p>
            )}
          </div>

          <div
            className={
              isFs
                ? "flex shrink-0 flex-wrap items-center justify-center gap-2 border-t border-white/10 px-2 py-3 md:gap-3"
                : "flex flex-wrap items-center justify-center gap-2 md:gap-3"
            }
            style={isFs ? { paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" } : undefined}
          >
            <button
              type="button"
              onClick={goPrev}
              disabled={!canPrev}
              className="rounded border border-white/25 bg-black/35 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-black/55 disabled:opacity-35 md:px-4"
            >
              ← Prev
            </button>
            <span className="max-w-[min(100vw,280px)] text-center text-[11px] tabular-nums text-white/90 md:text-sm" aria-live="polite">
              {rightLabel !== null ? (
                <>
                  Pages {leftLabel}–{rightLabel} of {totalPages}
                </>
              ) : (
                <>
                  Page {leftLabel} of {totalPages}
                </>
              )}
            </span>
            <button
              type="button"
              onClick={goNext}
              disabled={!canNext}
              className="rounded border border-white/25 bg-black/35 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-black/55 disabled:opacity-35 md:px-4"
            >
              Next →
            </button>
            {!isFs && (
              <button
                type="button"
                onClick={() => void toggleFullscreen()}
                className="rounded border border-[#c9a227]/50 bg-[#6E0F1F]/85 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-[#5a0c19] md:px-4"
              >
                Fullscreen
              </button>
            )}
          </div>

          {!isFs && (
            <p className="text-center text-[10px] text-white/45">
              Tip: tap the left or right page to turn; or use Prev / Next and arrow keys. Sound plays on each turn.
            </p>
          )}
        </>
      )}
    </div>
  );
}
