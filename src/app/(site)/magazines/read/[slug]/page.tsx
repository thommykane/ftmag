import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MagazineFlipBook } from "@/components/magazines/MagazineFlipBook";
import { getIssueBySlug } from "@/lib/magazines/repo";

export const dynamic = "force-dynamic";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const issue = await getIssueBySlug(params.slug);
  if (!issue) return { title: "Issue | Food & Travel Magazine" };
  return {
    title: `${issue.displayTitle} | Food & Travel Magazine`,
    description: issue.blurb.slice(0, 160),
  };
}

export default async function MagazineReadPage({ params }: Props) {
  const issue = await getIssueBySlug(params.slug);
  if (!issue) notFound();

  return (
    <div className="w-full max-w-none min-w-0 -mr-2 self-stretch pb-24 pt-4 md:pt-4">
      <div className="w-full bg-white pl-3 pr-4 py-6 text-left text-zinc-900 shadow-[0_2px_40px_rgba(0,0,0,0.12)] sm:pl-6 sm:pr-10 sm:py-8 md:pl-8 md:pr-14">
        <div className="mb-6 flex flex-wrap items-center gap-4 border-b border-zinc-200 pb-6">
          <Link
            href="/magazines"
            className="text-sm font-medium text-[#6E0F1F] underline decoration-[#6E0F1F]/35 underline-offset-2 hover:text-[#5a0c19]"
          >
            ← All issues
          </Link>
          <span className="text-sm text-zinc-500">{issue.displayTitle}</span>
        </div>
        <div className="flex justify-center">
          <MagazineFlipBook pdfUrl={issue.pdfSrc} title={issue.displayTitle} />
        </div>
      </div>
    </div>
  );
}
