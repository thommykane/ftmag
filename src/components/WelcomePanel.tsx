import { WELCOME_LOREM } from "@/content/welcomeLorem";

const paragraphs = WELCOME_LOREM.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);

export function WelcomePanel() {
  return (
    <section className="ftmag-panel animate-panel-in rounded-lg p-4 md:p-5">
      <header className="ftmag-panel__header mb-4 pb-3">
        <h1 className="font-display text-2xl font-semibold tracking-[0.12em] text-gold md:text-3xl">
          Welcome
        </h1>
        <p className="mt-2 font-electrolize text-[11px] uppercase tracking-[0.28em] text-[#6e0f1f]/65">
          A note for visitors
        </p>
        <p className="mt-1 font-display text-sm italic text-gold-soft/90">
          Curated journeys in taste, place, and craft.
        </p>
      </header>
      <div className="scrollbar-thin max-h-[calc(100dvh-14rem)] space-y-4 overflow-y-auto pr-1 text-[15px] leading-relaxed text-[#e8d4c8]/92 md:max-h-[calc(100dvh-6rem)]">
        {paragraphs.map((text, i) => (
          <p key={i} className="border-b border-[#6e0f1f]/25 pb-4 last:border-b-0 last:pb-0">
            {text}
          </p>
        ))}
      </div>
    </section>
  );
}
