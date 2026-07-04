"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Play, SkipForward, Sparkles } from "lucide-react";
import AnimatedNOGBackground from "./AnimatedNOGBackground";
import VideoBackdrop from "./VideoBackdrop";
import GameIntroVideo from "./GameIntroVideo";
import { useVideoAvailable } from "@/lib/videoAvailability";

interface GameIntro3DProps {
  title: string;
  icon: LucideIcon;
  objective: string;
  players: string;
  timer: string;
  howToPlay: string[];
  scoring: string[];
  onContinue: () => void;
}

export default function GameIntro3D({
  title,
  icon: Icon,
  objective,
  players,
  timer,
  howToPlay,
  scoring,
  onContinue,
}: GameIntro3DProps) {
  const introVideoAvailable = useVideoAvailable("game-intro.mp4");
  const [videoDone, setVideoDone] = useState(false);

  if (introVideoAvailable === null) return null;

  if (introVideoAvailable && !videoDone) {
    return <GameIntroVideo src="/videos/game-intro.mp4" onDone={() => setVideoDone(true)} />;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-white px-4 py-12">
      <AnimatedNOGBackground variant="subtle" />
      <VideoBackdrop src="/videos/oil-gas-loop.mp4" opacityClassName="opacity-10" />
      <button
        onClick={onContinue}
        className="absolute top-6 right-6 z-10 flex items-center gap-2 rounded-full border-2 border-nog-black/10 px-5 py-3 text-base font-bold text-nog-black/50 hover:border-nog-green-600 hover:text-nog-green-700 cursor-pointer"
      >
        Skip Intro <SkipForward size={18} />
      </button>

      <motion.div
        initial={{ opacity: 0, y: 28, rotateX: 10 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        whileHover={{ rotateX: -2, rotateY: 2, scale: 1.005 }}
        style={{ perspective: 1200, transformStyle: "preserve-3d" }}
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl border-2 border-nog-black/10 bg-white p-10 pt-14 shadow-[0_35px_70px_-20px_rgba(10,10,10,0.35)]"
      >
        <div className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-nog-green-600 via-nog-gold-500 to-nog-green-600 animate-shimmer-text" />

        <div className="absolute -top-11 left-1/2 -translate-x-1/2">
          <div className="animate-logo-float animate-glow-pulse flex h-24 w-24 items-center justify-center rounded-3xl bg-nog-green-800 text-nog-gold-400 shadow-2xl ring-4 ring-white">
            <Icon size={44} strokeWidth={2.25} />
          </div>
        </div>

        <span className="mx-auto flex w-fit items-center gap-1.5 rounded-full bg-nog-gold-500/15 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-nog-gold-700">
          <Sparkles size={13} /> Get Ready
        </span>

        <h2 className="mt-3 text-center text-4xl font-black tracking-tight text-nog-black sm:text-5xl">
          {title}
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-center text-lg font-semibold text-nog-black/60">
          {objective}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <InfoPill label="Players" value={players} />
          <InfoPill label="Timer" value={timer} />
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border-2 border-nog-black/10 p-5">
            <h3 className="mb-3 text-sm font-black uppercase tracking-wide text-nog-green-700">
              How to Play
            </h3>
            <ul className="flex flex-col gap-2">
              {howToPlay.map((line, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.06 }}
                  className="flex gap-2 text-sm font-semibold text-nog-black/70"
                >
                  <span className="mt-0.5 text-nog-green-600">●</span> {line}
                </motion.li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border-2 border-nog-black/10 p-5">
            <h3 className="mb-3 text-sm font-black uppercase tracking-wide text-nog-gold-700">
              Scoring
            </h3>
            <ul className="flex flex-col gap-2">
              {scoring.map((line, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.06 }}
                  className="flex gap-2 text-sm font-semibold text-nog-black/70"
                >
                  <span className="mt-0.5 text-nog-gold-600">●</span> {line}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        <motion.button
          onClick={onContinue}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-shine mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-nog-green-700 py-4 text-xl font-black text-white shadow-lg hover:bg-nog-green-800 hover:shadow-[0_10px_30px_-8px_rgba(15,148,85,0.6)] cursor-pointer transition-[background-color,box-shadow]"
        >
          <Play size={22} /> Continue
        </motion.button>
      </motion.div>
    </div>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-nog-black/5 px-4 py-3 text-center">
      <p className="text-xs font-bold uppercase tracking-wide text-nog-black/40">{label}</p>
      <p className="mt-1 text-base font-black text-nog-black">{value}</p>
    </div>
  );
}
