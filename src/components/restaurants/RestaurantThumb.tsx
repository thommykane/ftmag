import Image from "next/image";

const PLACEHOLDER = "https://placehold.co/75x75/1a0a0c/c9a227/png?font=montserrat&text=·";

export function RestaurantThumb({ url }: { url: string }) {
  const src = url?.trim() || PLACEHOLDER;
  if (src.startsWith("data:")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- data URLs
      <img
        src={src}
        alt=""
        width={75}
        height={75}
        className="h-[75px] w-[75px] shrink-0 rounded border border-[#c9a227]/30 object-cover"
      />
    );
  }
  return (
    <Image
      src={src}
      alt=""
      width={75}
      height={75}
      className="h-[75px] w-[75px] shrink-0 rounded border border-[#c9a227]/30 object-cover"
      unoptimized={src.includes("placehold.co")}
    />
  );
}
