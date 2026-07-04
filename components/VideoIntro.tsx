"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play, Volume2, VolumeX } from "lucide-react";
import Logo from "./Logo";
import { useVideoAvailable, type VideoName } from "@/lib/videoAvailability";

interface VideoIntroProps {
  src: string;
  label: string;
  onEnd: () => void;
  enterLabel?: string;
  /** "cover" fills the screen edge-to-edge (crops slightly); "contain" always shows
   * the full frame letterboxed. Attract-screen video defaults to "cover" so it never
   * looks small and centered. */
  fit?: "cover" | "contain";
}

const DEFAULT_VOLUME = 0.8;

export default function VideoIntro({ src, label, onEnd, enterLabel = "Enter NOG Arena", fit = "cover" }: VideoIntroProps) {
  const filename = (src.split("/").pop() ?? "") as VideoName;
  const available = useVideoAvailable(filename);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(DEFAULT_VOLUME);

  // Chromium only grants unmuted playback when muted/volume/play() are set
  // synchronously inside the click handler itself — deferring even to a
  // useEffect on the next tick loses the "transient activation" and the
  // browser silently forces it back to muted. So the <video> stays mounted
  // (muted) the whole time, and this handler mutates the live element directly.
  function startExperience() {
    setStarted(true);
    setMuted(false);
    const video = videoRef.current;
    if (video) {
      video.muted = false;
      video.volume = DEFAULT_VOLUME;
      video.play().catch(() => {});
    }
  }

  function toggleMute() {
    setMuted((prev) => {
      const next = !prev;
      if (videoRef.current) videoRef.current.muted = next;
      return next;
    });
  }

  function changeVolume(next: number) {
    setVolume(next);
    if (videoRef.current) videoRef.current.volume = next;
    if (next > 0 && muted) toggleMute();
  }

  if (available === null) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-hidden bg-nog-black"
    >
      {available && (
        <video
          ref={videoRef}
          src={src}
          autoPlay
          loop
          muted={muted}
          playsInline
          className={`absolute inset-0 h-full w-full ${fit === "contain" ? "object-contain" : "object-cover"}`}
        />
      )}

      {available && started && (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-linear-to-t from-black/70 to-transparent"
          />

          <div className="absolute top-6 right-6 flex items-center gap-3 rounded-full bg-black/30 px-4 py-2 backdrop-blur-sm">
            <button
              onClick={toggleMute}
              aria-label={muted ? "Unmute" : "Mute"}
              className="flex h-9 w-9 items-center justify-center rounded-full text-white hover:bg-white/10 cursor-pointer"
            >
              {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={muted ? 0 : volume}
              onChange={(e) => changeVolume(Number(e.target.value))}
              aria-label="Volume"
              className="h-1.5 w-24 cursor-pointer accent-nog-gold-500"
            />
          </div>

          <div className="absolute inset-x-0 bottom-10 flex justify-center px-4">
            <button
              onClick={onEnd}
              className="btn-shine flex items-center gap-2 rounded-2xl bg-nog-green-700 px-8 py-4 text-xl font-black text-white shadow-lg hover:bg-nog-green-800 cursor-pointer transition-colors"
            >
              {enterLabel} <ArrowRight size={22} />
            </button>
          </div>
        </>
      )}

      {!started && (
        <div
          className={`absolute inset-0 flex items-center justify-center px-4 ${available ? "bg-nog-black/60 backdrop-blur-sm" : ""}`}
        >
          <motion.div
            initial={{ opacity: 0, y: 28, rotateX: 10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ perspective: 1200, transformStyle: "preserve-3d" }}
            aria-label={label}
            className="flex w-full max-w-xl flex-col items-center gap-6 rounded-3xl border-2 border-nog-black/10 bg-white p-12 text-center shadow-[0_35px_70px_-20px_rgba(10,10,10,0.5)]"
          >
            <Logo className="h-20 w-auto animate-logo-float" />
            <div>
              <p className="text-3xl font-black tracking-tight text-nog-black">
                NOG <span className="text-nog-green-700">ARENA</span>
              </p>
              <p className="mt-2 text-base font-semibold text-nog-black/60">
                Nigeria Oil &amp; Gas Conference
              </p>
            </div>
            <button
              onClick={available ? startExperience : onEnd}
              className="btn-shine flex items-center gap-2 rounded-2xl bg-nog-green-700 px-8 py-4 text-xl font-black text-white shadow-lg hover:bg-nog-green-800 cursor-pointer transition-colors"
            >
              <Play size={22} /> {available ? "Start Experience" : enterLabel}
            </button>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
