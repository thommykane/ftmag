import type { Metadata } from "next";
import Image from "next/image";
import { MagazineIssuesSection } from "@/components/magazines/MagazineIssuesSection";
import { getMagazineIssuesSorted } from "@/lib/magazines/repo";

export const dynamic = "force-dynamic";

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

export default async function MagazinesPage() {
  const issues = await getMagazineIssuesSorted();

  return (
    <div className="w-full max-w-none min-w-0 -mr-2 self-stretch pb-20 pt-4 md:pt-4">
      <div className="w-full bg-white pl-3 pr-4 py-8 text-left text-zinc-900 shadow-[0_2px_40px_rgba(0,0,0,0.12)] sm:pl-5 sm:pr-8 sm:py-10 md:pl-6 md:pr-12 lg:pl-8 lg:pr-16">
        <header className="mb-10 max-w-none border-b border-zinc-200 pb-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-10 xl:gap-14">
            <div className="min-w-0 flex-1">
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
            </div>
            <div className="relative mx-auto w-full max-w-[600px] shrink-0 overflow-hidden rounded border border-zinc-200 bg-zinc-100 shadow-sm lg:mx-0">
              <Image
                src="/stores.jpg"
                alt="Food &amp; Travel Magazine"
                width={600}
                height={391}
                className="h-auto w-full object-cover"
                sizes="(max-width: 640px) 100vw, 600px"
                priority
              />
            </div>
          </div>
        </header>

        <h2 className="mb-6 font-display text-xl font-semibold text-zinc-900 md:text-2xl">
          Recent issues
        </h2>
        {issues.length === 0 ? (
          <p className="text-sm text-zinc-500">No issues yet. Add one in Admin → Magazines.</p>
        ) : (
          <MagazineIssuesSection issues={issues} />
        )}
      </div>
    </div>
  );
}
