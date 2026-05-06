"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { MagazineIssue } from "@/lib/magazines/types";
import { MagazineFlipReaderModal } from "@/components/magazines/MagazineFlipReaderModal";

function hasFlipbook(issue: MagazineIssue) {
  return issue.flipbookUrl.trim().startsWith("http");
}

export function MagazineIssuesSection({ issues }: { issues: MagazineIssue[] }) {
  const [modalIssue, setModalIssue] = useState<MagazineIssue | null>(null);

  function openReader(issue: MagazineIssue) {
    setModalIssue(issue);
  }

  function closeModal() {
    setModalIssue(null);
  }

  return (
    <>
      <ul className="mx-auto grid max-w-6xl list-none grid-cols-1 gap-8 justify-items-center sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
        {issues.map((issue) => (
          <li key={issue.slug} className="flex w-full max-w-[min(100%,360px)] flex-col">
            {hasFlipbook(issue) ? (
              <button
                type="button"
                onClick={() => openReader(issue)}
                className="group block w-full overflow-hidden rounded border border-zinc-200 bg-zinc-50 text-left shadow-sm transition hover:border-[#c9a227]/50 hover:shadow-md"
              >
                <div className="relative aspect-[3/4] w-full bg-zinc-100">
                  <Image
                    src={issue.coverSrc}
                    alt={issue.displayTitle}
                    fill
                    className="object-cover transition group-hover:opacity-95"
                    sizes="(max-width:640px) 92vw, (max-width:1024px) 44vw, 360px"
                  />
                </div>
              </button>
            ) : (
              <div className="relative block w-full overflow-hidden rounded border border-zinc-200 bg-zinc-50 shadow-sm">
                <div className="relative aspect-[3/4] w-full bg-zinc-100">
                  <Image
                    src={issue.coverSrc}
                    alt={issue.displayTitle}
                    fill
                    className="object-cover opacity-90"
                    sizes="(max-width:640px) 92vw, (max-width:1024px) 44vw, 360px"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 px-3">
                    <p className="text-center text-[11px] font-semibold uppercase leading-snug tracking-[0.12em] text-white drop-shadow-sm">
                      Digital edition coming soon
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="mt-3 flex min-h-0 flex-1 flex-col">
              <h3 className="font-display text-base font-semibold leading-snug text-zinc-900 md:text-lg">
                {issue.displayTitle}
              </h3>
              <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-[#6E0F1F]/90">
                {issue.releaseLabel}
              </p>
              <p className="mt-2 flex-1 text-[13px] leading-snug text-zinc-600 md:text-sm">{issue.blurb}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {issue.purchaseUrl ? (
                  <a
                    href={issue.purchaseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded border border-zinc-300 bg-white px-2.5 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-800 transition hover:border-[#c9a227]/60 sm:text-[11px]"
                  >
                    Purchase issue
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="cursor-not-allowed rounded border border-zinc-200 bg-zinc-100 px-2 py-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-zinc-400 sm:text-[10px]"
                    title="Purchase link not set yet"
                  >
                    Purchase issue
                  </button>
                )}
                {issue.subscribeUrl ? (
                  <a
                    href={issue.subscribeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded border border-[#6E0F1F]/40 bg-[#6E0F1F] px-2.5 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-[#5a0c19] sm:text-[11px]"
                  >
                    Subscribe
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="cursor-not-allowed rounded border border-zinc-200 bg-zinc-100 px-2.5 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-400 sm:text-[11px]"
                    title="Subscribe link not set yet"
                  >
                    Subscribe
                  </button>
                )}
              </div>
              {hasFlipbook(issue) ? (
                <button
                  type="button"
                  onClick={() => openReader(issue)}
                  className="mt-2 inline-block text-left text-sm font-medium text-[#6E0F1F] underline decoration-[#6E0F1F]/30 underline-offset-2 hover:text-[#5a0c19]"
                >
                  Read digital edition
                </button>
              ) : issue.pdfSrc.trim() ? (
                <Link
                  href={`/magazines/read/${issue.slug}`}
                  className="mt-2 inline-block text-sm font-medium text-[#6E0F1F] underline decoration-[#6E0F1F]/30 underline-offset-2 hover:text-[#5a0c19]"
                >
                  Open PDF reader
                </Link>
              ) : (
                <p className="mt-2 text-sm text-zinc-500">Digital edition coming soon.</p>
              )}
            </div>
          </li>
        ))}
      </ul>

      <MagazineFlipReaderModal
        open={Boolean(modalIssue && hasFlipbook(modalIssue))}
        onClose={closeModal}
        issue={
          modalIssue && hasFlipbook(modalIssue)
            ? {
                slug: modalIssue.slug,
                displayTitle: modalIssue.displayTitle,
                coverSrc: modalIssue.coverSrc,
                flipbookUrl: modalIssue.flipbookUrl.trim(),
              }
            : null
        }
      />
    </>
  );
}
