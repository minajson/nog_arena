"use client";

import { useEffect, useState } from "react";

export type VideoName = "opening-video.mp4" | "game-intro.mp4" | "oil-gas-loop.mp4" | "celebration.mp4";

let cachedStatus: Promise<Record<string, boolean>> | null = null;

function fetchStatus(): Promise<Record<string, boolean>> {
  if (!cachedStatus) {
    cachedStatus = fetch("/api/video-status")
      .then((res) => (res.ok ? res.json() : {}))
      .catch(() => ({}));
  }
  return cachedStatus;
}

/** Returns null while checking, then whether the given /public/videos file actually
 * exists on the server — so callers never set a <video src> that would 404. */
export function useVideoAvailable(name: VideoName): boolean | null {
  const [available, setAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchStatus().then((status) => {
      if (!cancelled) setAvailable(!!status[name]);
    });
    return () => {
      cancelled = true;
    };
  }, [name]);

  return available;
}
