"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { SkipForward, Play } from "lucide-react";
import Logo from "./Logo";

interface VideoIntroProps {
  src: string;
  label: string;
  onEnd: () => void;
  variant?: "overlay" | "background";
  muted?: boolean;
}

/** Videos may 404 or simply never fire `error` reliably across browsers, so a
 * short watchdog timeout backs up the error handler — otherwise a missing
 * file can leave the fullscreen overlay stuck forever with nothing to click. */
const LOAD_TIMEOUT_MS = 2500;

export default function VideoIntro({
  src,
  label,
  onEnd,
  variant = "overlay",
  muted = false,
}: VideoIntroProps) {
  const [failed, setFailed] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!startedRef.current) setFailed(true);
    }, LOAD_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [src]);

  function markStarted() {
    startedRef.current = true;
  }

  if (variant === "background") {
    if (failed) return null;
    return (
      <video
        src={src}
        autoPlay
        muted
        loop
        playsInline
        onLoadedData={markStarted}
        onError={() => setFailed(true)}
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover opacity-15"
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-nog-black"
    >
      <button
        onClick={onEnd}
        className="absolute top-6 right-6 z-10 flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 text-lg font-bold text-white hover:bg-white/20 cursor-pointer"
      >
        Skip <SkipForward size={20} />
      </button>

      {failed ? (
        <motion.div
          initial={{ opacity: 0, y: 28, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          whileHover={{ rotateX: -2, rotateY: 2, scale: 1.005 }}
          style={{ perspective: 1200, transformStyle: "preserve-3d" }}
          aria-label={label}
          className="mx-4 flex w-full max-w-xl flex-col items-center gap-6 rounded-3xl border-2 border-nog-black/10 bg-white p-12 text-center shadow-[0_35px_70px_-20px_rgba(10,10,10,0.5)]"
        >
          <Logo className="h-20 w-auto" />
          <div>
            <p className="text-3xl font-black tracking-tight text-nog-black">
              NOG <span className="text-nog-green-700">ARENA</span>
            </p>
            <p className="mt-2 text-base font-semibold text-nog-black/60">
              Nigeria Oil &amp; Gas Conference
            </p>
          </div>
          <button
            onClick={onEnd}
            className="flex items-center gap-2 rounded-2xl bg-nog-green-700 px-8 py-4 text-xl font-black text-white shadow-lg hover:bg-nog-green-800 cursor-pointer transition-colors"
          >
            <Play size={22} /> Continue
          </button>
        </motion.div>
      ) : (
        <video
          src={src}
          autoPlay
          muted={muted}
          playsInline
          onEnded={onEnd}
          onPlaying={markStarted}
          onError={() => setFailed(true)}
          className="max-h-full max-w-full"
        />
      )}
    </motion.div>
  );
}
