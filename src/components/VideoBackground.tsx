"use client";

import { useEffect, useRef } from "react";

/** Full-viewport looping MP4 from /public/background.mp4 */
export function VideoBackground() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    void v.play().catch(() => {
      /* muted autoplay usually succeeds */
    });
  }, []);

  return (
    <div className="ftmag-bg" aria-hidden>
      <video
        ref={ref}
        className="ftmag-bg__video"
        src="/background.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />
    </div>
  );
}
