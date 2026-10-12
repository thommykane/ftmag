"use client";

import Link from "next/link";
import { useState } from "react";

export type DestinationMenuLink = { name: string; href: string };

export type StateDestinationMenu = {
  name: string;
  slug: string;
  counties: DestinationMenuLink[];
  cities: DestinationMenuLink[];
};

function PlaceGroup({ heading, links }: { heading: string; links: DestinationMenuLink[] }) {
  if (links.length === 0) return null;
  return (
    <div className="mt-3 first:mt-0">
      <h3 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#e8d48b]/75">{heading}</h3>
      <ul className="mt-1.5 space-y-1">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-white/80 transition hover:text-[#e8d48b]"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TopDestinationsMenu({ states }: { states: StateDestinationMenu[] }) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  return (
    <ol className="columns-1 gap-x-10 sm:columns-2">
      {states.map((state) => {
        const hasChildren = state.counties.length > 0 || state.cities.length > 0;
        const open = openSlug === state.slug;

        return (
          <li key={state.slug} className="break-inside-avoid">
            <div className="flex items-center gap-1.5 py-1.5">
              {hasChildren ? (
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={`destinations-${state.slug}`}
                  aria-label={open ? `Collapse ${state.name}` : `Expand ${state.name}`}
                  onClick={() => setOpenSlug(open ? null : state.slug)}
                  className="flex h-6 w-6 shrink-0 items-center justify-center text-[#e8d48b] transition hover:text-white"
                >
                  <svg
                    viewBox="0 0 20 20"
                    aria-hidden
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
                    fill="currentColor"
                  >
                    <path d="M7 4.5 13.5 10 7 15.5V4.5Z" />
                  </svg>
                </button>
              ) : (
                <span className="h-6 w-6 shrink-0" aria-hidden />
              )}
              <Link
                href={`/visit/${state.slug}`}
                className="text-sm text-[#e8d48b]/90 underline decoration-[#c9a227]/35 underline-offset-4 transition hover:decoration-[#e8d48b]/70"
              >
                {state.name}
              </Link>
            </div>

            {hasChildren && open ? (
              <div id={`destinations-${state.slug}`} className="pb-4 pl-8">
                <PlaceGroup heading="Counties" links={state.counties} />
                <PlaceGroup heading="Cities / Towns" links={state.cities} />
              </div>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
