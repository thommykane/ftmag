"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const PAGE_TURN_SOUND = "/page-turn.mp3";

export function MagazineFlipBook({ pdfUrl, title }: { pdfUrl: string; title: string }) {
  const shellRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pdfRef = useRef<import("pdfjs-dist/types/src/display/api").PDFDocumentProxy | null>(null);
  const renderGen = useRef(0);

  const [numPages, setNumPages] = useState(0);
  const [page, setPage] = useState(1);
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

  /** Load PDF once — uses HTTP range/streaming so bytes arrive progressively (fast start vs rendering all pages). */
  useEffect(() => {
    let cancelled = false;
    pdfRef.current = null;
    setPhase("loading-pdf");
    setError(null);
    setLoadPct(null);
    setNumPages(0);
    setPage(1);

    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = new URL("/pdf.worker.min.js", window.location.href).href;

        const absoluteUrl = new URL(pdfUrl, window.location.origin).href;

        const loadingTask = pdfjs.getDocument({
          url: absoluteUrl,
          disableRange: false,
          disableStream: false,
        });

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
      const p = pdfRef.current;
      pdfRef.current = null;
      if (p) void p.destroy().catch(() => {});
    };
  }, [pdfUrl]);

  const drawPage = useCallback(
    async (pageNum: number, generation: number) => {
      const pdf = pdfRef.current;
      const canvas = canvasRef.current;
      const shell = shellRef.current;
      if (!pdf || !canvas || !shell || pageNum < 1 || pageNum > pdf.numPages) return;

      const pdfPage = await pdf.getPage(pageNum);
      if (generation !== renderGen.current) return;

      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) return;

      const cssMaxW = Math.min(shell.clientWidth - 16, 960);
      const base = pdfPage.getViewport({ scale: 1 });
      const scale = cssMaxW / base.width;
      const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2);

      const viewport = pdfPage.getViewport({ scale: scale * dpr });

      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      canvas.style.width = `${viewport.width / dpr}px`;
      canvas.style.height = `${viewport.height / dpr}px`;

      if (generation !== renderGen.current) return;

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      await pdfPage.render({ canvasContext: ctx, viewport, intent: "display" }).promise;
      if (generation !== renderGen.current) return;

      setPhase("ready");
    },
    [],
  );

  /** Redraw when page / issue changes — do not depend on `phase`; finishing a draw sets phase to `ready` and would retrigger this effect and double-render (races / stuck controls). */
  useEffect(() => {
    if (phaseRef.current === "loading-pdf" || phaseRef.current === "error" || !numPages) return;

    renderGen.current += 1;
    const gen = renderGen.current;

    let alive = true;
    void (async () => {
      try {
        await drawPage(page, gen);
      } catch (e) {
        if (!alive || gen !== renderGen.current) return;
        setError(e instanceof Error ? e.message : "Could not render this page.");
        setPhase("error");
      }
    })();

    return () => {
      alive = false;
    };
  }, [page, numPages, drawPage]);

  useEffect(() => {
    if (phase !== "ready" && phase !== "rendering") return;
    const shell = shellRef.current;
    if (!shell) return;

    let t: ReturnType<typeof setTimeout>;
    const ro = new ResizeObserver(() => {
      clearTimeout(t);
      t = setTimeout(() => {
        renderGen.current += 1;
        const gen = renderGen.current;
        void drawPage(page, gen);
      }, 120);
    });
    ro.observe(shell);
    return () => {
      clearTimeout(t);
      ro.disconnect();
    };
  }, [phase, page, drawPage]);

  useEffect(() => {
    const onFs = () => setIsFs(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const goNextRef = useRef<() => void>(() => {});
  const goPrevRef = useRef<() => void>(() => {});

  const goNext = useCallback(() => {
    setPage((p) => {
      const n = pdfRef.current?.numPages ?? numPages;
      if (p >= n) return p;
      playTurnSound();
      setPhase("rendering");
      return p + 1;
    });
  }, [numPages, playTurnSound]);

  const goPrev = useCallback(() => {
    setPage((p) => {
      if (p <= 1) return p;
      playTurnSound();
      setPhase("rendering");
      return p - 1;
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

  return (
    <div ref={shellRef} className="flex w-full flex-col items-center gap-4 bg-zinc-900/40 p-4 md:p-6">
      <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a227]/90">{title}</p>

      {phase === "loading-pdf" && (
        <div className="flex flex-col items-center gap-2 text-sm text-white/85">
          <p>Opening issue…</p>
          {loadPct !== null ? (
            <>
              <div className="h-1.5 w-48 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full bg-[#c9a227] transition-[width] duration-300"
                  style={{ width: `${loadPct}%` }}
                />
              </div>
              <p className="text-xs tabular-nums text-white/60">{loadPct}%</p>
            </>
          ) : (
            <p className="text-xs text-white/50">Starting download…</p>
          )}
        </div>
      )}

      {phase === "error" && error && (
        <p className="max-w-md text-center text-sm text-red-200">{error}</p>
      )}

      {(phase === "ready" || phase === "rendering") && numPages > 0 && (
        <>
          <div className="w-full max-w-[min(100%,980px)] overflow-x-auto rounded border border-white/10 bg-zinc-950/50 p-2 shadow-inner">
            <div className="mx-auto flex min-h-[min(55vh,520px)] max-w-full justify-center">
              <canvas
                ref={canvasRef}
                className="mx-auto block h-auto max-w-full bg-white shadow-lg"
                style={{ touchAction: "pan-y pinch-zoom" }}
              />
            </div>
          </div>
          {busy && phase === "rendering" && (
            <p className="text-xs text-white/55">Rendering page…</p>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={goPrev}
              disabled={page <= 1 || busy}
              className="rounded border border-white/25 bg-black/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-black/50 disabled:opacity-35"
              aria-label="Previous page"
            >
              ← Prev
            </button>
            <span className="text-sm tabular-nums text-white/90" aria-live="polite">
              Page {page} / {numPages}
            </span>
            <button
              type="button"
              onClick={goNext}
              disabled={page >= numPages || busy}
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
              {isFs ? "Exit fullscreen" : "Fullscreen"}
            </button>
          </div>
          <p className="text-center text-[10px] text-white/40">Tip: use ← → arrow keys to turn pages.</p>
        </>
      )}
    </div>
  );
}
