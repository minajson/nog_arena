"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Film, SkipForward, Play } from "lucide-react";

interface VideoIntroProps {
  src: string;
  label: string;
  onEnd: () => void;
  variant?: "overlay" | "background";
  muted?: boolean;
}

export default function VideoIntro({
  src,
  label,
  onEnd,
  variant = "overlay",
  muted = false,
}: VideoIntroProps) {
  const [failed, setFailed] = useState(false);

  if (variant === "background") {
    if (failed) return null;
    return (
      <video
        src={src}
        autoPlay
        muted
        loop
        playsInline
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
        <div className="mx-4 flex w-full max-w-xl flex-col items-center gap-6 rounded-3xl border-4 border-dashed border-white/30 bg-white/5 p-12 text-center">
          <Film size={56} className="text-nog-gold-400" />
          <div>
            <p className="text-2xl font-black text-white">Video Placeholder</p>
            <p className="mt-2 text-base font-medium text-white/60">{label}</p>
            <p className="mt-1 text-sm text-white/40">{src}</p>
          </div>
          <button
            onClick={onEnd}
            className="flex items-center gap-2 rounded-2xl bg-nog-green-600 px-8 py-4 text-xl font-black text-white hover:bg-nog-green-700 cursor-pointer"
          >
            <Play size={22} /> Continue
          </button>
        </div>
      ) : (
        <video
          src={src}
          autoPlay
          muted={muted}
          playsInline
          onEnded={onEnd}
          onError={() => setFailed(true)}
          className="max-h-full max-w-full"
        />
      )}
    </motion.div>
  );
}
