"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface GameIntroVideoProps {
  src: string;
  onDone: () => void;
}

/** A brief muted video moment shown before a game's rules card. Auto-advances when
 * the clip ends, or immediately if the player taps Continue. */
export default function GameIntroVideo({ src, onDone }: GameIntroVideoProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-hidden bg-nog-black"
    >
      <video
        src={src}
        autoPlay
        muted
        playsInline
        onEnded={onDone}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-linear-to-t from-black/70 to-transparent"
      />
      <div className="absolute inset-x-0 bottom-10 flex justify-center px-4">
        <button
          onClick={onDone}
          className="btn-shine flex items-center gap-2 rounded-2xl bg-nog-green-700 px-8 py-4 text-xl font-black text-white shadow-lg hover:bg-nog-green-800 cursor-pointer transition-colors"
        >
          Continue <ArrowRight size={22} />
        </button>
      </div>
    </motion.div>
  );
}
