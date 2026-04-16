import Image from "next/image";
import Link from "next/link";
import type { DestinationCity } from "@/types/stateDestination";

export function CityCard({
  city,
  stateSlug,
}: {
  city: DestinationCity;
  stateSlug: string;
}) {
  const href = `/visit/${stateSlug}/city/${city.slug}`;
  const img =
    city.imageUrl ??
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80";

  return (
    <Link
      href={href}
      className="group ftmag-panel flex flex-col overflow-hidden rounded-xl transition duration-300 hover:-translate-y-1 hover:border-[#c9a227]/45"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={img}
          alt=""
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.04]"
          sizes="(max-width:768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <h3 className="absolute bottom-3 left-3 text-lg font-semibold tracking-wide text-white drop-shadow-md">
          {city.name}
        </h3>
      </div>
      <p className="p-4 text-sm leading-relaxed text-white/75">{city.shortDescription}</p>
    </Link>
  );
}
