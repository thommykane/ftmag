import Link from "next/link";
import type { RestaurantDTO } from "@/lib/restaurantPublic";
import { bookingHref, bookingLabel, telHref } from "@/lib/restaurantPublic";
import { RestaurantThumb } from "./RestaurantThumb";

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  if (!href || href === "#") return <span className="text-white/45">—</span>;
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-display text-sm text-[#e8d48b]/95 underline decoration-[#c9a227]/35 underline-offset-[3px] transition hover:text-white hover:decoration-[#c9a227]/55"
    >
      {children}
    </Link>
  );
}

const contactLinkClass =
  "font-display text-[15px] leading-snug text-white/85 underline decoration-white/20 underline-offset-[3px] transition hover:text-[#e8d48b] hover:decoration-[#c9a227]/40";

export function NameAddressBlock({ r }: { r: RestaurantDTO }) {
  return (
    <div className="min-w-[160px] space-y-2.5">
      <p className="font-display text-xl font-bold leading-tight tracking-[0.02em] text-white md:text-2xl">{r.name}</p>
      {r.address ? (
        <p className="font-display text-[15px] leading-relaxed text-white/82 md:text-base">{r.address}</p>
      ) : null}
      <div className="font-display space-y-1.5 text-[15px] leading-relaxed text-white/80 md:text-base">
        {r.email ? (
          <p>
            <a href={`mailto:${r.email}`} className={contactLinkClass}>
              {r.email}
            </a>
          </p>
        ) : null}
        {r.phone ? (
          <p>
            {telHref(r.phone) ? (
              <a href={telHref(r.phone)} className={contactLinkClass}>
                {r.phone}
              </a>
            ) : (
              <span className="text-white/80">{r.phone}</span>
            )}
          </p>
        ) : null}
      </div>
    </div>
  );
}

/** /top-restaurants — national rank first, then thumbnail, then details. */
export function RestaurantRowNational({ r }: { r: RestaurantDTO }) {
  const book = bookingHref(r);
  const rank = r.nationalRank;

  return (
    <div className="ftmag-panel flex flex-col gap-3 rounded-lg border border-[#c9a227]/20 p-3 sm:grid sm:grid-cols-[40px_75px_minmax(160px,1.4fr)_minmax(72px,0.75fr)_minmax(80px,0.85fr)_minmax(88px,1fr)_minmax(72px,0.65fr)] sm:items-start sm:gap-x-2 sm:gap-y-1">
      <div className="font-display text-xl font-semibold tabular-nums text-[#c9a227] sm:pt-1 sm:text-2xl">
        {rank != null ? rank : "—"}
      </div>
      <RestaurantThumb url={r.thumbnailUrl} />
      <NameAddressBlock r={r} />
      <div className="font-display text-[15px] leading-relaxed text-white/88 sm:pt-1 md:text-base">{r.cuisine || "—"}</div>
      <div className="font-display text-[15px] leading-relaxed text-white/88 sm:pt-1 md:text-base">{r.ownerChef || "—"}</div>
      <div className="font-display text-[15px] leading-relaxed text-white/78 sm:pt-1 md:text-base">{r.awards?.trim() ? r.awards : "—"}</div>
      <div className="sm:pt-1">
        <ExternalLink href={book}>{bookingLabel(r)}</ExternalLink>
      </div>
    </div>
  );
}

/** State Eat section — thumbnail first; national rank is live from admin ordering. */
export function RestaurantRowState({ r }: { r: RestaurantDTO }) {
  const book = bookingHref(r);
  const rank = r.nationalRank;

  return (
    <div className="ftmag-panel flex flex-col gap-3 rounded-lg border border-[#c9a227]/20 p-3 sm:grid sm:grid-cols-[75px_minmax(160px,1.4fr)_minmax(72px,0.75fr)_minmax(80px,0.85fr)_minmax(88px,1fr)_48px_minmax(72px,0.65fr)] sm:items-start sm:gap-x-2">
      <RestaurantThumb url={r.thumbnailUrl} />
      <NameAddressBlock r={r} />
      <div className="font-display text-[15px] leading-relaxed text-white/88 sm:pt-1 md:text-base">{r.cuisine || "—"}</div>
      <div className="font-display text-[15px] leading-relaxed text-white/88 sm:pt-1 md:text-base">{r.ownerChef || "—"}</div>
      <div className="font-display text-[15px] leading-relaxed text-white/78 sm:pt-1 md:text-base">{r.awards?.trim() ? r.awards : "—"}</div>
      <div className="text-center font-display text-base font-semibold tabular-nums text-[#c9a227] sm:pt-1 md:text-lg">
        {rank != null ? `#${rank}` : "—"}
      </div>
      <div className="sm:pt-1">
        <ExternalLink href={book}>{bookingLabel(r)}</ExternalLink>
      </div>
    </div>
  );
}
