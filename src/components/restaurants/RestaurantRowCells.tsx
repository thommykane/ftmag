import Link from "next/link";
import type { RestaurantDTO } from "@/lib/restaurantPublic";
import { bookingHref, bookingLabel, telHref } from "@/lib/restaurantPublic";
import { RestaurantThumb } from "./RestaurantThumb";

/** ~Google knowledge-panel listing: 14px secondary, relaxed line-height */
const rowSans = "font-sans antialiased";
const cellBody = `${rowSans} text-sm font-normal leading-[1.43] text-white/[0.68]`;
const cellBodyMuted = `${rowSans} text-sm font-normal leading-[1.43] text-white/[0.62]`;
const cellTitle = `${rowSans} text-[1.25rem] font-medium leading-snug tracking-tight text-white sm:text-[1.375rem]`;
const linkSubtle = `${rowSans} text-sm font-normal leading-[1.43] text-sky-400/90 underline decoration-sky-500/35 underline-offset-[3px] transition hover:text-sky-300 hover:decoration-sky-400/50`;
const contactLine = `${rowSans} text-sm font-normal leading-[1.43] text-white/[0.65] underline decoration-white/[0.15] underline-offset-[3px] transition hover:text-white/[0.88] hover:decoration-white/25`;

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  if (!href || href === "#") return <span className="text-white/45">—</span>;
  return (
    <Link href={href} target="_blank" rel="noopener noreferrer" className={linkSubtle}>
      {children}
    </Link>
  );
}

export function NameAddressBlock({ r }: { r: RestaurantDTO }) {
  return (
    <div className={`min-w-[160px] space-y-2 ${rowSans}`}>
      <p className={cellTitle}>{r.name}</p>
      {r.address ? <p className={`${cellBody} mt-0.5`}>{r.address}</p> : null}
      <div className="mt-2 space-y-1">
        {r.email ? (
          <p>
            <a href={`mailto:${r.email}`} className={contactLine}>
              {r.email}
            </a>
          </p>
        ) : null}
        {r.phone ? (
          <p>
            {telHref(r.phone) ? (
              <a href={telHref(r.phone)} className={contactLine}>
                {r.phone}
              </a>
            ) : (
              <span className={cellBody}>{r.phone}</span>
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
      <div
        className={`${rowSans} pt-0.5 text-sm font-medium tabular-nums text-white/[0.78] sm:pt-1`}
        title="National rank"
      >
        {rank != null ? rank : "—"}
      </div>
      <RestaurantThumb url={r.thumbnailUrl} />
      <NameAddressBlock r={r} />
      <div className={`${cellBody} sm:pt-1`}>{r.cuisine || "—"}</div>
      <div className={`${cellBody} sm:pt-1`}>{r.ownerChef || "—"}</div>
      <div className={`${cellBodyMuted} sm:pt-1`}>{r.awards?.trim() ? r.awards : "—"}</div>
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
      <div className={`${cellBody} sm:pt-1`}>{r.cuisine || "—"}</div>
      <div className={`${cellBody} sm:pt-1`}>{r.ownerChef || "—"}</div>
      <div className={`${cellBodyMuted} sm:pt-1`}>{r.awards?.trim() ? r.awards : "—"}</div>
      <div
        className={`${rowSans} text-center text-sm font-medium tabular-nums text-white/[0.78] sm:pt-1`}
        title="National rank"
      >
        {rank != null ? `#${rank}` : "—"}
      </div>
      <div className="sm:pt-1">
        <ExternalLink href={book}>{bookingLabel(r)}</ExternalLink>
      </div>
    </div>
  );
}
