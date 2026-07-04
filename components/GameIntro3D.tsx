"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Play, SkipForward } from "lucide-react";

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
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-white px-4 py-12">
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
        className="relative w-full max-w-2xl rounded-3xl border-2 border-nog-black/10 bg-white p-10 pt-14 shadow-[0_35px_70px_-20px_rgba(10,10,10,0.35)]"
      >
        <div className="absolute -top-11 left-1/2 -translate-x-1/2">
          <div className="animate-logo-float flex h-24 w-24 items-center justify-center rounded-3xl bg-nog-green-800 text-nog-gold-400 shadow-2xl ring-4 ring-white">
            <Icon size={44} strokeWidth={2.25} />
          </div>
        </div>

        <h2 className="mt-4 text-center text-4xl font-black tracking-tight text-nog-black sm:text-5xl">
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
                <li key={i} className="flex gap-2 text-sm font-semibold text-nog-black/70">
                  <span className="mt-0.5 text-nog-green-600">●</span> {line}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border-2 border-nog-black/10 p-5">
            <h3 className="mb-3 text-sm font-black uppercase tracking-wide text-nog-gold-700">
              Scoring
            </h3>
            <ul className="flex flex-col gap-2">
              {scoring.map((line, i) => (
                <li key={i} className="flex gap-2 text-sm font-semibold text-nog-black/70">
                  <span className="mt-0.5 text-nog-gold-600">●</span> {line}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <button
          onClick={onContinue}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-nog-green-700 py-4 text-xl font-black text-white shadow-lg hover:bg-nog-green-800 cursor-pointer transition-colors"
        >
          <Play size={22} /> Continue
        </button>
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
