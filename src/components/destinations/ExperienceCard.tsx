export function ExperienceCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <article className="group ftmag-panel flex min-w-[240px] max-w-xs shrink-0 flex-col gap-2 rounded-lg p-4 transition duration-300 hover:-translate-y-0.5 hover:border-[#c9a227]/50">
      <div className="flex items-center gap-3">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-md border border-[#c9a227]/35 bg-black/50 text-lg text-[#e8d48b] shadow-[inset_0_0_20px_rgba(201,162,39,0.08)] transition group-hover:shadow-[inset_0_0_28px_rgba(201,162,39,0.14)]"
          aria-hidden
        >
          {icon}
        </span>
        <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-white">{title}</h3>
      </div>
      <p className="text-xs leading-relaxed text-white/70">{description}</p>
    </article>
  );
}
