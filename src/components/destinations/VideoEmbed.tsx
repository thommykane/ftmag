function parseVideo(url: string): { type: "youtube" | "vimeo"; id: string } | null {
  const yt =
    url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s?#]+)/)?.[1] ??
    url.match(/youtube\.com\/embed\/([^&\s?#]+)/)?.[1];
  if (yt) return { type: "youtube", id: yt };

  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)?.[1];
  if (vm) return { type: "vimeo", id: vm };

  return null;
}

export function VideoEmbed({ url, title }: { url: string; title: string }) {
  const parsed = parseVideo(url);
  if (!parsed) return null;

  const src =
    parsed.type === "youtube"
      ? `https://www.youtube-nocookie.com/embed/${parsed.id}?rel=0`
      : `https://player.vimeo.com/video/${parsed.id}`;

  return (
    <div className="ftmag-panel overflow-hidden rounded-xl border border-[#c9a227]/20 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
      <div className="relative aspect-video w-full bg-black">
        <iframe
          title={title}
          src={src}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  );
}
