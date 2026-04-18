import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getMagazineIssuesSorted } from "@/data/magazines/issues";

export const metadata: Metadata = {
  title: "Our Magazine | Food & Travel Magazine",
  description:
    "Food & Travel Magazine — a modern luxury publication for taste, culture, and experience. Browse issues and read online.",
};

const INTRO = [
  "Food & Travel Magazine is a modern luxury publication created for those who see the world differently—through taste, culture, and experience. We don’t just cover destinations; we immerse ourselves in them, bringing you closer to the chefs, landscapes, stories, and moments that define the world’s most compelling places.",
  "Published six times per year—Spring, Special Edition, Summer, Fall, Holiday Edition, and Winter—each issue is thoughtfully curated to reflect the rhythm of the seasons. From sun-soaked coastal escapes to intimate winter retreats, every edition captures where you should be going, what you should be tasting, and why it matters right now.",
  "Our pages blend high-end travel with culinary storytelling, featuring world-renowned chefs, hidden gems, and unforgettable experiences. Whether it’s a quiet vineyard tucked away in the hills or a globally celebrated restaurant redefining fine dining, we focus on what’s worth your time—not what’s trending for the moment.",
  "Subscribing to Food & Travel Magazine means more than receiving a publication—it’s access to a lifestyle. You’ll discover destinations before they become crowded, gain insider perspectives you won’t find on search engines, and experience storytelling that feels personal, not promotional. Every issue is designed to inspire your next journey while elevating how you see food, travel, and the connection between them.",
  "For those who value quality, authenticity, and discovery, this is your guide.",
];

export default function MagazinesPage() {
  const issues = getMagazineIssuesSorted();

  return (
    <div className="w-full max-w-none min-w-0 -mr-2 self-stretch pb-20 pt-4 md:pt-4">
      <div className="w-full bg-white pl-3 pr-4 py-8 text-left text-zinc-900 shadow-[0_2px_40px_rgba(0,0,0,0.12)] sm:pl-5 sm:pr-8 sm:py-10 md:pl-6 md:pr-12 lg:pl-8 lg:pr-16">
        <header className="mb-10 max-w-none border-b border-zinc-200 pb-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#6E0F1F]">
            Food &amp; Travel Magazine
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-wide text-zinc-900 md:text-4xl">
            Our magazine
          </h1>
          <div className="mt-6 max-w-3xl space-y-4 text-sm leading-relaxed text-zinc-700">
            {INTRO.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </header>

        <h2 className="mb-6 font-display text-xl font-semibold text-zinc-900 md:text-2xl">
          Issues
        </h2>
        <ul className="grid list-none grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          {issues.map((issue) => (
            <li key={issue.slug} className="flex flex-col">
              <Link
                href={`/magazines/read/${issue.slug}`}
                className="group block overflow-hidden rounded border border-zinc-200 bg-zinc-50 shadow-sm transition hover:border-[#c9a227]/50 hover:shadow-md"
              >
                <div className="relative aspect-[3/4] w-full bg-zinc-100">
                  <Image
                    src={issue.coverSrc}
                    alt={issue.displayTitle}
                    fill
                    className="object-cover transition group-hover:opacity-95"
                    sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                  />
                </div>
              </Link>
              <div className="mt-4 flex min-h-0 flex-1 flex-col">
                <h3 className="font-display text-lg font-semibold text-zinc-900">{issue.displayTitle}</h3>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-[#6E0F1F]/90">
                  {issue.releaseLabel}
                </p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-600">{issue.blurb}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="rounded border border-zinc-300 bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-800 transition hover:border-[#c9a227]/60"
                  >
                    Purchase issue
                  </button>
                  <button
                    type="button"
                    className="rounded border border-[#6E0F1F]/40 bg-[#6E0F1F] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#5a0c19]"
                  >
                    Subscribe
                  </button>
                </div>
                <Link
                  href={`/magazines/read/${issue.slug}`}
                  className="mt-3 inline-block text-sm font-medium text-[#6E0F1F] underline decoration-[#6E0F1F]/30 underline-offset-2 hover:text-[#5a0c19]"
                >
                  Open in reader
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
