"use client";

import { useVideoAvailable, type VideoName } from "@/lib/videoAvailability";

interface VideoBackdropProps {
  src: string;
  /** Tailwind opacity class — keep low so it never competes with foreground text. */
  opacityClassName?: string;
  /** Optional translucent wash rendered above the video (e.g. "bg-white/50") so the
   * page keeps its white, readable feel instead of looking like a raw video player. */
  overlayClassName?: string;
}

/** A muted, looped, low-opacity ambient video layer. Renders nothing (letting the
 * animated fallback background show through) if the file doesn't exist — checked
 * server-side first, so a missing file never causes a browser 404. */
export default function VideoBackdrop({ src, opacityClassName = "opacity-15", overlayClassName }: VideoBackdropProps) {
  const filename = (src.split("/").pop() ?? "") as VideoName;
  const available = useVideoAvailable(filename);

  if (!available) return null;

  return (
    <>
      <video
        src={src}
        autoPlay
        muted
        loop
        playsInline
        className={`pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover ${opacityClassName}`}
      />
      {overlayClassName && <div aria-hidden className={`pointer-events-none absolute inset-0 -z-10 ${overlayClassName}`} />}
    </>
  );
}
