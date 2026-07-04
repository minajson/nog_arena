import { existsSync } from "fs";
import { join } from "path";
import { NextResponse } from "next/server";

const KNOWN_VIDEOS = [
  "opening-video.mp4",
  "game-intro.mp4",
  "oil-gas-loop.mp4",
  "celebration.mp4",
] as const;

/** Reports which of the known /public/videos files actually exist on disk, so
 * client components never point a <video> at a missing file (which would log
 * a 404 in the console — a plain onError handler can't prevent that). */
export async function GET() {
  const status: Record<string, boolean> = {};
  for (const name of KNOWN_VIDEOS) {
    status[name] = existsSync(join(process.cwd(), "public", "videos", name));
  }
  return NextResponse.json(status, { headers: { "Cache-Control": "no-store" } });
}
