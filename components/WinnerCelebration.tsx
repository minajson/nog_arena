"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { PartyPopper, Play, Home } from "lucide-react";
import Logo from "./Logo";
import ConfettiCelebration from "./ConfettiCelebration";
import BurstEffect from "./BurstEffect";
import { speak, VOICE_LINES } from "@/lib/speech";
import { useVideoAvailable } from "@/lib/videoAvailability";

interface WinnerCelebrationProps {
  winnerNames: string[];
  tie: boolean;
  subtitle?: string;
  onPlayAgain: () => void;
  onExitMenu: () => void;
}

const CELEBRATION_VIDEO_SRC = "/videos/celebration.mp4";

export default function WinnerCelebration({
  winnerNames,
  tie,
  subtitle,
  onPlayAgain,
  onExitMenu,
}: WinnerCelebrationProps) {
  const videoAvailable = useVideoAvailable("celebration.mp4");

  useEffect(() => {
    speak(tie ? VOICE_LINES.tie : VOICE_LINES.winner(winnerNames[0] ?? "Champion"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-8 text-center">
      <ConfettiCelebration active />
      <BurstEffect active color="gold" />

      <Logo className="h-24 w-auto sm:h-32" />

      {videoAvailable && (
        <video
          src={CELEBRATION_VIDEO_SRC}
          autoPlay
          muted
          loop
          playsInline
          className="max-h-80 w-full rounded-3xl object-contain"
        />
      )}

      {videoAvailable === false && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -4 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
          className="flex h-28 w-28 items-center justify-center rounded-full bg-linear-to-br from-nog-gold-400 via-nog-gold-500 to-nog-gold-700 shadow-[0_0_40px_rgba(224,184,60,0.6)]"
        >
          <motion.div
            animate={{ rotate: [0, 12, -12, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.6 }}
          >
            <PartyPopper size={52} className="text-white" />
          </motion.div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-5xl font-black tracking-tight text-nog-black sm:text-6xl">
          {tie ? (
            "It's a Tie!"
          ) : (
            <>
              Congratulations,{" "}
              <span className="text-nog-green-700">{winnerNames[0]}</span>!
            </>
          )}
        </h2>
        <p className="mt-3 text-xl font-semibold text-nog-black/60">
          {tie ? `${winnerNames.join(" & ")} tied for first place!` : subtitle ?? "You are a winner!"}
        </p>
      </motion.div>

      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={onPlayAgain}
          className="btn-shine flex items-center gap-2 rounded-2xl bg-nog-green-700 px-8 py-4 text-xl font-black text-white shadow-lg hover:bg-nog-green-800 hover:shadow-[0_10px_30px_-8px_rgba(15,148,85,0.6)] cursor-pointer transition-[background-color,box-shadow]"
        >
          <Play size={22} /> Play Again
        </button>
        <button
          onClick={onExitMenu}
          className="flex items-center gap-2 rounded-2xl border-2 border-nog-black/15 px-8 py-4 text-xl font-black text-nog-black/70 hover:border-nog-green-600 hover:text-nog-green-700 cursor-pointer transition-colors"
        >
          <Home size={22} /> Back to Menu
        </button>
      </div>
    </div>
  );
}
