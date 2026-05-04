import Link from "next/link";
import type { RestaurantDTO } from "@/lib/restaurantPublic";
import { displayWebsiteHostname, restaurantDetailHref, telHref } from "@/lib/restaurantPublic";
import { RestaurantThumb } from "./RestaurantThumb";

/** ~Google knowledge-panel listing: 14px secondary, relaxed line-height */
const rowSans = "font-sans antialiased";
const cellBody = `${rowSans} text-sm font-normal leading-[1.43] text-white/[0.68]`;
const cellBodyMuted = `${rowSans} text-sm font-normal leading-[1.43] text-white/[0.62]`;
const cellTitle = `${rowSans} text-[1.25rem] font-medium leading-snug tracking-tight text-white sm:text-[1.375rem]`;
const linkSubtle = `${rowSans} text-sm font-normal leading-[1.43] text-sky-400/90 underline decoration-sky-500/35 underline-offset-[3px] transition hover:text-sky-300 hover:decoration-sky-400/50`;
const contactLine = `${rowSans} text-sm font-normal leading-[1.43] text-white/[0.65] underline decoration-white/[0.15] underline-offset-[3px] transition hover:text-white/[0.88] hover:decoration-white/25`;

function dashOr(s: string | undefined | null): string {
  const t = s?.trim();
  return t ? t : "—";
}

/** Rank + thumbnail + contact block column layout (shared grid prefix). */
const gridNational =
  "sm:grid sm:min-w-[1040px] sm:grid-cols-[40px_75px_minmax(176px,1.55fr)_minmax(68px,0.48fr)_minmax(68px,0.48fr)_minmax(72px,0.5fr)_minmax(64px,0.46fr)_minmax(64px,0.46fr)_minmax(84px,0.58fr)_minmax(76px,0.42fr)] sm:items-start sm:gap-x-2 sm:gap-y-1";

const gridState =
  "sm:grid sm:min-w-[1040px] sm:grid-cols-[75px_minmax(176px,1.55fr)_minmax(68px,0.48fr)_minmax(68px,0.48fr)_minmax(72px,0.5fr)_minmax(64px,0.46fr)_minmax(64px,0.46fr)_minmax(84px,0.58fr)_40px_minmax(76px,0.42fr)] sm:items-start sm:gap-x-2";

function NameContactBlock({ r }: { r: RestaurantDTO }) {
  const detailHref = restaurantDetailHref(r);
  const host = displayWebsiteHostname(r.website);
  const webHrefRaw = r.website.trim();
  const webHref =
    webHrefRaw.length > 0
      ? webHrefRaw.includes("://")
        ? webHrefRaw
        : `https://${webHrefRaw}`
      : "";

  return (
    <div className={`min-w-[160px] space-y-2 ${rowSans}`}>
      <p className={cellTitle}>
        <Link href={detailHref} className="text-inherit no-underline hover:opacity-95">
          {r.name}
        </Link>
      </p>
      {r.address ? <p className={`${cellBody} mt-0.5`}>{r.address}</p> : null}
      <div className="mt-2 space-y-1">
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
        {host && webHref ? (
          <p>
            <a href={webHref} target="_blank" rel="noopener noreferrer" className={linkSubtle}>
              {host}
            </a>
          </p>
        ) : null}
      </div>
    </div>
  );
}

function OpenTableCell({ r }: { r: RestaurantDTO }) {
  const ot = r.openTableUrl?.trim();
  if (!ot) return <span className={`${cellBody} sm:pt-1`}>—</span>;
  return (
    <div className="sm:pt-1">
      <a href={ot} target="_blank" rel="noopener noreferrer" className={linkSubtle}>
        OpenTable
      </a>
    </div>
  );
}

/** /top-restaurants — national rank first, then thumbnail, then details. */
export function RestaurantRowNational({ r }: { r: RestaurantDTO }) {
  const rank = r.nationalRank;

  return (
    <div className="overflow-x-auto">
      <div className={`ftmag-panel flex flex-col gap-3 rounded-lg border border-[#c9a227]/20 p-3 ${gridNational}`}>
        <div
          className={`${rowSans} pt-0.5 text-sm font-medium tabular-nums text-white/[0.78] sm:pt-1`}
          title="National rank"
        >
          {rank != null ? rank : "—"}
        </div>
        <RestaurantThumb url={r.thumbnailUrl} />
        <NameContactBlock r={r} />
        <div className={`${cellBody} sm:pt-1`}>{dashOr(r.city)}</div>
        <div className={`${cellBody} sm:pt-1`}>{dashOr(r.county)}</div>
        <div className={`${cellBody} sm:pt-1`}>{dashOr(r.cuisine)}</div>
        <div className={`${cellBody} sm:pt-1`}>{dashOr(r.owner)}</div>
        <div className={`${cellBody} sm:pt-1`}>{dashOr(r.headChef)}</div>
        <div className={`${cellBodyMuted} sm:pt-1`}>{r.awards?.trim() ? r.awards : "—"}</div>
        <OpenTableCell r={r} />
      </div>
    </div>
  );
}

/** State Eat section — thumbnail first; national rank column preserved. */
export function RestaurantRowState({ r }: { r: RestaurantDTO }) {
  const rank = r.nationalRank;

  return (
    <div className="overflow-x-auto">
      <div className={`ftmag-panel flex flex-col gap-3 rounded-lg border border-[#c9a227]/20 p-3 ${gridState}`}>
        <RestaurantThumb url={r.thumbnailUrl} />
        <NameContactBlock r={r} />
        <div className={`${cellBody} sm:pt-1`}>{dashOr(r.city)}</div>
        <div className={`${cellBody} sm:pt-1`}>{dashOr(r.county)}</div>
        <div className={`${cellBody} sm:pt-1`}>{dashOr(r.cuisine)}</div>
        <div className={`${cellBody} sm:pt-1`}>{dashOr(r.owner)}</div>
        <div className={`${cellBody} sm:pt-1`}>{dashOr(r.headChef)}</div>
        <div className={`${cellBodyMuted} sm:pt-1`}>{r.awards?.trim() ? r.awards : "—"}</div>
        <div
          className={`${rowSans} text-center text-sm font-medium tabular-nums text-white/[0.78] sm:pt-1`}
          title="National rank"
        >
          {rank != null ? `#${rank}` : "—"}
        </div>
        <OpenTableCell r={r} />
      </div>
    </div>
  );
}
