import type { DestinationMapPlace } from "@/types/stateDestination";
import { googleMapsSearchUrl } from "@/lib/googleMapsUrl";

export function DestinationMapPlacesSection({
  title,
  subtitle,
  places,
}: {
  title: string;
  subtitle?: string;
  places: DestinationMapPlace[];
}) {
  if (places.length === 0) return null;

  return (
    <section>
      <header className="mb-4 px-1">
        <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-[#e8d48b]">{title}</h2>
        {subtitle ? (
          <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/45">{subtitle}</p>
        ) : null}
      </header>
      <div className="grid gap-3 sm:grid-cols-2">
        {places.map((p) => (
          <a
            key={`${p.name}-${p.address}`}
            href={googleMapsSearchUrl(p.address || p.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="group ftmag-panel block rounded-lg border border-[#c9a227]/25 p-4 transition duration-300 hover:-translate-y-0.5 hover:border-[#c9a227]/50"
          >
            <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-white transition group-hover:text-[#e8d48b]">
              {p.name}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-white/65">{p.address || "Open in Maps"}</p>
            <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-[#c9a227]/80">Directions →</p>
          </a>
        ))}
      </div>
    </section>
  );
}
