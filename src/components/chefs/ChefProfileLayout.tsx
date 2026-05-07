import Image from "next/image";
import Link from "next/link";
import { ageFromBirthDate } from "@/lib/chefs/chefDetail";
import type { ChefDetailDTO } from "@/lib/chefs/queries";
import { restaurantDetailHref, type RestaurantDTO } from "@/lib/restaurantPublic";

function portraitUnoptimized(url: string) {
  return url.includes("blob.vercel-storage.com") || url.includes("placehold.co");
}

function InfoRow({ label, value }: { label: string; value: string }) {
  if (!value.trim()) return null;
  return (
    <div className="border-b border-white/10 py-2.5 last:border-0">
      <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c9a227]/90">{label}</dt>
      <dd className="mt-1 text-[14px] leading-snug text-white/90">{value}</dd>
    </div>
  );
}

export function ChefProfileLayout({
  chef,
  rankedRestaurants,
}: {
  chef: ChefDetailDTO;
  rankedRestaurants: RestaurantDTO[];
}) {
  const age = ageFromBirthDate(chef.birthDate);
  const specialty =
    chef.specialtyCuisine.trim() ||
    (chef.cuisines.length ? chef.cuisines.join(", ") : "");

  return (
    <section className="ftmag-panel overflow-hidden rounded-lg">
      <div className="grid gap-6 p-4 md:grid-cols-[minmax(260px,340px)_1fr] md:gap-8 md:p-6 lg:p-8">
        <div className="flex flex-col gap-4">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[340px] bg-black/40 md:mx-0">
            <Image
              src={chef.imageUrl}
              alt={chef.name}
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 340px"
              priority
              unoptimized={portraitUnoptimized(chef.imageUrl)}
            />
          </div>

          <div className="rounded-lg border border-[#6e0f1f]/35 bg-black/35 px-4 py-3 shadow-inner">
            <h2 className="border-b border-white/10 pb-2 font-electrolize text-[11px] font-normal uppercase tracking-[0.28em] text-white/90">
              At a glance
            </h2>
            <dl className="mt-1">
              <InfoRow label="Name" value={chef.name} />
              <InfoRow label="Age" value={age !== null ? String(age) : ""} />
              <InfoRow label="Birthplace" value={chef.birthPlace} />
              <InfoRow label="Specialty" value={specialty} />
              <InfoRow label="Awards" value={chef.awards} />
            </dl>
          </div>
        </div>

        <div className="flex min-w-0 flex-col">
          <h1 className="text-center font-display text-3xl font-semibold tracking-[0.06em] text-white md:text-left md:text-4xl">
            {chef.name}
          </h1>
          <div className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
            {chef.cuisines.map((tag) => (
              <span
                key={tag}
                className="rounded border border-[#6e0f1f]/50 bg-black/30 px-2.5 py-1 text-[11px] uppercase tracking-wider text-[#e8d48b]/95"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-8 border-t border-white/10 pt-8">
            {chef.description.trim() ? (
              <p className="whitespace-pre-wrap text-[15px] leading-[1.65] text-white/88">{chef.description}</p>
            ) : (
              <div
                className="min-h-[min(28vh,240px)] rounded-lg border border-dashed border-white/20 bg-black/25"
                aria-label="Biography coming soon"
              />
            )}
          </div>

          {chef.ownedRestaurants.length > 0 ? (
            <div className="mt-10 border-t border-white/10 pt-8">
              <h2 className="font-display text-xl font-semibold tracking-wide text-white md:text-2xl">
                Restaurants
              </h2>
              <p className="mt-1 text-[13px] text-white/55">Venues associated with this chef — names and locations.</p>
              <ul className="mt-4 space-y-4">
                {chef.ownedRestaurants.map((r, i) => (
                  <li
                    key={`${r.name}-${i}`}
                    className="rounded-lg border border-white/10 bg-black/25 px-4 py-3"
                  >
                    <p className="font-display text-lg font-semibold text-white">{r.name}</p>
                    <p className="mt-0.5 text-[14px] text-[#e8d48b]/90">{r.location}</p>
                    {r.role ? <p className="mt-2 text-[13px] text-white/70">{r.role}</p> : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-10 border-t border-white/10 pt-8">
            <h2 className="font-display text-xl font-semibold tracking-wide text-white md:text-2xl">
              On the national list
            </h2>
            <p className="mt-1 text-[13px] text-white/55">
              U.S. Food &amp; Travel national rankings where this chef appears as owner or head chef (by name match).
            </p>
            {rankedRestaurants.length === 0 ? (
              <p className="mt-4 rounded-lg border border-white/10 bg-black/20 px-4 py-6 text-center text-[14px] text-white/60">
                No matching ranked restaurants yet — this chef&apos;s venues may be outside the U.S. list or use a
                different spelling in our data.
              </p>
            ) : (
              <div className="mt-4 overflow-x-auto rounded-lg border border-white/10">
                <table className="w-full min-w-[520px] text-left text-[13px] text-white/88">
                  <thead>
                    <tr className="border-b border-white/10 bg-black/40 text-[10px] uppercase tracking-[0.15em] text-[#c9a227]/95">
                      <th className="px-3 py-2.5 font-semibold">Rank</th>
                      <th className="px-3 py-2.5 font-semibold">Restaurant</th>
                      <th className="px-3 py-2.5 font-semibold">Location</th>
                      <th className="px-3 py-2.5 font-semibold" />
                    </tr>
                  </thead>
                  <tbody>
                    {rankedRestaurants.map((r) => (
                      <tr key={r.id} className="border-b border-white/5 transition hover:bg-white/[0.04]">
                        <td className="whitespace-nowrap px-3 py-2.5 font-semibold tabular-nums text-[#e8d48b]">
                          #{r.nationalRank}
                        </td>
                        <td className="px-3 py-2.5 font-medium text-white">{r.name}</td>
                        <td className="px-3 py-2.5 text-white/75">
                          {[r.city, r.stateSlug?.replace(/-/g, " ")].filter(Boolean).join(", ") || r.address || "—"}
                        </td>
                        <td className="px-3 py-2.5 text-right">
                          <Link
                            href={restaurantDetailHref(r)}
                            className="text-[11px] font-semibold uppercase tracking-wider text-[#c9a227] underline decoration-[#c9a227]/40 underline-offset-2 hover:text-[#e8d48b]"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
