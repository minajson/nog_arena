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
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-white px-4 py-4 lg:py-5">
      <AnimatedNOGBackground variant="subtle" />
      <VideoBackdrop
        src="/videos/oil-gas-loop.mp4"
        opacityClassName="opacity-25"
        overlayClassName="bg-white/65"
      />
      <button
        onClick={onContinue}
        className="absolute top-6 right-6 z-10 flex items-center gap-2 rounded-full border-2 border-nog-black/10 bg-white/80 px-6 py-3.5 text-lg font-bold text-nog-black/50 backdrop-blur-sm hover:border-nog-green-600 hover:text-nog-green-700 cursor-pointer"
      >
        Skip Intro <SkipForward size={20} />
      </button>

      <motion.div
        initial={{ opacity: 0, y: 28, rotateX: 10 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        whileHover={{ rotateX: -1, rotateY: 1, scale: 1.002 }}
        style={{ perspective: 1200, transformStyle: "preserve-3d" }}
        className="relative my-auto w-[94vw] max-w-6xl overflow-hidden rounded-[2.5rem] border-2 border-nog-black/10 bg-white/95 p-7 pt-16 shadow-[0_35px_70px_-20px_rgba(10,10,10,0.35)] backdrop-blur-sm sm:px-10 sm:py-8 sm:pt-16 lg:px-11"
      >
        <div className="absolute inset-x-0 top-0 h-2 bg-linear-to-r from-nog-green-600 via-nog-gold-500 to-nog-green-600 animate-shimmer-text" />

        <div className="absolute top-4 left-1/2 -translate-x-1/2">
          <div className="animate-logo-float animate-glow-pulse flex h-18 w-18 items-center justify-center rounded-3xl bg-nog-green-800 text-nog-gold-400 shadow-2xl ring-4 ring-white lg:h-20 lg:w-20">
            <Icon size={36} strokeWidth={2.25} className="lg:size-10" />
          </div>
        </div>

        <div className="mt-9">
          <span className="mx-auto flex w-fit items-center gap-2 rounded-full bg-nog-gold-500/15 px-5 py-1.5 text-sm font-black uppercase tracking-widest text-nog-gold-700">
            <Sparkles size={15} /> Get Ready
          </span>

          <h2 className="mt-2 text-center text-4xl font-black tracking-tight text-nog-black sm:text-5xl xl:text-6xl">
            {title}
          </h2>
          <p className="mx-auto mt-2 max-w-4xl text-center text-lg font-semibold leading-snug text-nog-black/65 lg:text-xl">
            {objective}
          </p>
        </div>

        <div className="mx-auto mt-4 grid max-w-3xl grid-cols-2 gap-5">
          <InfoPill label="Players" value={players} />
          <InfoPill label="Timer" value={timer} />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2 lg:gap-6">
          <div className="rounded-3xl border-2 border-nog-green-600/20 bg-nog-green-600/[0.04] p-5 lg:p-6">
            <h3 className="mb-3 text-lg font-black uppercase tracking-wide text-nog-green-700 lg:text-xl">
              How to Play
            </h3>
            <ul className="flex flex-col gap-2.5">
              {howToPlay.map((line, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.06 }}
                  className="flex items-start gap-3 text-base font-semibold leading-snug text-nog-black/75 lg:text-lg"
                >
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-nog-green-700 text-sm font-black text-white">
                    {i + 1}
                  </span>
                  {line}
                </motion.li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border-2 border-nog-gold-500/30 bg-nog-gold-500/[0.06] p-5 lg:p-6">
            <h3 className="mb-3 text-lg font-black uppercase tracking-wide text-nog-gold-700 lg:text-xl">
              Scoring
            </h3>
            <ul className="flex flex-col gap-2.5">
              {scoring.map((line, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.06 }}
                  className="flex items-start gap-3 text-base font-semibold leading-snug text-nog-black/75 lg:text-lg"
                >
                  <span className="mt-1.5 h-3 w-3 shrink-0 rounded-full bg-nog-gold-500" />
                  {line}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative mx-auto mt-5 max-w-3xl">
          <div
            aria-hidden
            className="animate-cta-glow absolute -inset-2 rounded-3xl bg-nog-green-500/25 blur-xl"
          />
          <motion.button
            onClick={onContinue}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-shine cta-pulse relative flex w-full items-center justify-center gap-3 rounded-2xl bg-nog-green-700 py-4.5 text-2xl font-black text-white shadow-lg hover:bg-nog-green-800 hover:shadow-[0_10px_30px_-8px_rgba(15,148,85,0.6)] cursor-pointer transition-[background-color,box-shadow] lg:py-5"
          >
            <Play size={28} /> Continue
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-nog-black/5 px-5 py-2.5 text-center lg:px-6 lg:py-3">
      <p className="text-sm font-bold uppercase tracking-wide text-nog-black/40">{label}</p>
      <p className="mt-1 text-lg font-black text-nog-black lg:text-xl">{value}</p>
    </div>
  );
}
