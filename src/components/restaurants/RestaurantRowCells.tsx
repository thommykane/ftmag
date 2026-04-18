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
      className="text-[#e8d48b]/90 underline decoration-[#c9a227]/40 underline-offset-2 hover:text-white"
    >
      {children}
    </Link>
  );
}

export function NameAddressBlock({ r }: { r: RestaurantDTO }) {
  return (
    <div className="min-w-[160px] space-y-1">
      <p className="font-semibold text-white">{r.name}</p>
      {r.address ? <p className="text-[11px] leading-snug text-white/70">{r.address}</p> : null}
      <div className="text-[10px] leading-relaxed text-white/60">
        {r.email ? (
          <p>
            <a href={`mailto:${r.email}`} className="text-[#e8d48b]/85 underline hover:text-white">
              {r.email}
            </a>
          </p>
        ) : null}
        {r.phone ? (
          <p>
            {telHref(r.phone) ? (
              <a href={telHref(r.phone)} className="text-[#e8d48b]/85 underline hover:text-white">
                {r.phone}
              </a>
            ) : (
              <span className="text-white/70">{r.phone}</span>
            )}
          </p>
        ) : null}
        {r.website ? (
          <p>
            <ExternalLink href={r.website}>Website</ExternalLink>
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
      <div className="font-serif text-xl font-semibold tabular-nums text-[#c9a227] sm:pt-1 sm:text-2xl">
        {rank != null ? rank : "—"}
      </div>
      <RestaurantThumb url={r.thumbnailUrl} />
      <NameAddressBlock r={r} />
      <div className="text-xs leading-snug text-white/85 sm:pt-1">{r.cuisine || "—"}</div>
      <div className="text-xs leading-snug text-white/85 sm:pt-1">{r.ownerChef || "—"}</div>
      <div className="text-[11px] leading-snug text-white/75 sm:pt-1">{r.awards?.trim() ? r.awards : "—"}</div>
      <div className="text-xs sm:pt-1">
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
      <div className="text-xs leading-snug text-white/85 sm:pt-1">{r.cuisine || "—"}</div>
      <div className="text-xs leading-snug text-white/85 sm:pt-1">{r.ownerChef || "—"}</div>
      <div className="text-[11px] leading-snug text-white/75 sm:pt-1">{r.awards?.trim() ? r.awards : "—"}</div>
      <div className="text-center text-sm font-semibold tabular-nums text-[#c9a227] sm:pt-1">
        {rank != null ? `#${rank}` : "—"}
      </div>
      <div className="text-xs sm:pt-1">
        <ExternalLink href={book}>{bookingLabel(r)}</ExternalLink>
      </div>
    </div>
  );
}
