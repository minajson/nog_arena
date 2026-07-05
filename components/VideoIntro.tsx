"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play, Volume2, VolumeX } from "lucide-react";
import Logo from "./Logo";
import IndustrialAmbience from "./IndustrialAmbience";
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

/** Cinematic attract screen: the opening video plays full-screen (muted — browsers
 * only allow sound after a user gesture) the moment the page loads or refreshes,
 * with the big "Enter NOG Arena" button over it. Unmuting via the speaker control
 * is itself the gesture that unlocks audio. */
export default function VideoIntro({ src, label, onEnd, enterLabel = "Enter NOG Arena", fit = "cover" }: VideoIntroProps) {
  const filename = (src.split("/").pop() ?? "") as VideoName;
  const available = useVideoAvailable(filename);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(DEFAULT_VOLUME);

  // Chromium only grants unmuted playback when muted/volume/play() are mutated
  // synchronously inside the click handler itself, so these handlers write to the
  // live element directly instead of waiting on an effect.
  function toggleMute() {
    setMuted((prev) => {
      const next = !prev;
      const video = videoRef.current;
      if (video) {
        video.muted = next;
        if (!next) {
          video.volume = volume;
          video.play().catch(() => {});
        }
      }
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
      aria-label={label}
      className="fixed inset-0 z-50 overflow-hidden bg-nog-black"
    >
      {available ? (
        <>
          <video
            ref={videoRef}
            src={src}
            autoPlay
            loop
            muted={muted}
            playsInline
            className={`absolute inset-0 h-full w-full ${fit === "contain" ? "object-contain" : "object-cover"}`}
          />

          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-linear-to-t from-black/75 to-transparent"
          />

          <div className="absolute top-6 right-6 flex items-center gap-3 rounded-full bg-black/35 px-4 py-2 backdrop-blur-sm">
            <button
              onClick={toggleMute}
              aria-label={muted ? "Unmute" : "Mute"}
              className="flex h-10 w-10 items-center justify-center rounded-full text-white hover:bg-white/10 cursor-pointer"
            >
              {muted ? <VolumeX size={22} /> : <Volume2 size={22} />}
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
            {muted && (
              <span className="hidden pr-1 text-xs font-bold uppercase tracking-widest text-white/70 sm:block">
                Tap for sound
              </span>
            )}
          </div>

          <div className="absolute inset-x-0 bottom-12 flex flex-col items-center gap-4 px-4">
            <div className="relative">
              <div
                aria-hidden
                className="animate-cta-glow absolute -inset-3 rounded-3xl bg-nog-green-500/40 blur-2xl"
              />
              <button
                onClick={onEnd}
                className="btn-shine cta-pulse relative flex items-center gap-3 rounded-2xl bg-nog-green-600 px-12 py-6 text-2xl font-black text-white shadow-xl hover:bg-nog-green-700 cursor-pointer transition-colors sm:px-16 sm:py-7 sm:text-3xl"
              >
                {enterLabel} <ArrowRight className="sm:size-8" size={26} />
              </button>
            </div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-white/50 sm:text-base">
              Tap to Begin
            </p>
          </div>
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center px-4">
          {/* animated fallback when no opening video exists */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(4,36,26,0.55)_100%)]"
          />
          <IndustrialAmbience tone="onDark" />

          <motion.div
            initial={{ opacity: 0, y: 28, rotateX: 10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ perspective: 1200, transformStyle: "preserve-3d" }}
            className="relative z-10 flex w-[92vw] max-w-3xl flex-col items-center gap-7 rounded-[2.5rem] border border-white/20 bg-white/10 p-10 text-center shadow-[0_45px_90px_-25px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:gap-9 sm:p-16"
          >
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-1.5 rounded-t-[2.5rem] bg-linear-to-r from-nog-green-500 via-nog-gold-400 to-nog-green-500 animate-shimmer-text"
            />
            <Logo className="h-28 w-auto animate-logo-float sm:h-40" />
            <div>
              <p className="text-5xl font-black tracking-tight text-white drop-shadow-lg sm:text-7xl">
                NOG <span className="text-nog-green-500">ARENA</span>
              </p>
              <p className="mx-auto mt-4 flex w-fit items-center gap-2 rounded-full bg-nog-gold-500/20 px-6 py-2 text-sm font-black uppercase tracking-widest text-nog-gold-400 sm:text-base">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-nog-gold-400" />
                Nigeria Oil &amp; Gas Conference
              </p>
            </div>
            <div className="relative">
              <div
                aria-hidden
                className="animate-cta-glow absolute -inset-3 rounded-3xl bg-nog-green-500/40 blur-2xl"
              />
              <button
                onClick={onEnd}
                className="btn-shine cta-pulse relative flex items-center gap-3 rounded-2xl bg-nog-green-600 px-14 py-6 text-2xl font-black text-white shadow-xl hover:bg-nog-green-700 cursor-pointer transition-colors sm:px-20 sm:py-8 sm:text-4xl"
              >
                <Play className="sm:size-10" size={28} /> {enterLabel}
              </button>
            </div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-white/50 sm:text-base">
              Tap to Begin
            </p>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
