"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play, Volume2, VolumeX } from "lucide-react";

interface GameIntroVideoProps {
  src: string;
  onDone: () => void;
}

const VOLUME = 0.7;

/** The "get ready" intro clip. Autoplays muted (browsers block sound before a user
 * gesture), then a "Play Intro" tap unmutes and plays audio at VOLUME. The clip
 * loops so it never goes silent/black on its own — only Continue advances the
 * player, so audio is never cut early. */
export default function GameIntroVideo({ src, onDone }: GameIntroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(true);

  // Same rule as the opening attract video: muted/volume/play() must be set
  // synchronously inside the click handler to keep the browser's unmuted-playback
  // grant, so the <video> stays mounted (muted) throughout and this handler
  // mutates the live element directly rather than waiting on an effect.
  function startIntro() {
    setStarted(true);
    setMuted(false);
    const video = videoRef.current;
    if (video) {
      video.muted = false;
      video.volume = VOLUME;
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-hidden bg-nog-black"
    >
      <video
        ref={videoRef}
        src={src}
        autoPlay
        loop
        muted={muted}
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-linear-to-t from-black/70 to-transparent"
      />

      {started && (
        <div className="absolute top-6 right-6 flex items-center gap-3 rounded-full bg-black/30 px-4 py-2 backdrop-blur-sm">
          <button
            onClick={toggleMute}
            aria-label={muted ? "Unmute" : "Mute"}
            className="flex h-9 w-9 items-center justify-center rounded-full text-white hover:bg-white/10 cursor-pointer"
          >
            {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-10 flex justify-center px-4">
        <button
          onClick={started ? onDone : startIntro}
          className="btn-shine flex items-center gap-2 rounded-2xl bg-nog-green-700 px-8 py-4 text-xl font-black text-white shadow-lg hover:bg-nog-green-800 cursor-pointer transition-colors"
        >
          {started ? (
            <>
              Continue <ArrowRight size={22} />
            </>
          ) : (
            <>
              <Play size={22} /> Play Intro
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
