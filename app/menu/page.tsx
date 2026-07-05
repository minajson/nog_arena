"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Settings, Zap, Disc3, Layers, Search, Gauge } from "lucide-react";
import AnimatedGameCard from "@/components/AnimatedGameCard";
import AnimatedNOGBackground from "@/components/AnimatedNOGBackground";
import IndustrialAmbience from "@/components/IndustrialAmbience";
import VideoBackdrop from "@/components/VideoBackdrop";
import Logo from "@/components/Logo";
import { GAMES } from "@/data/games";
import { useSettings } from "@/lib/store";

const GAME_ICONS = {
  "buzz-and-drill": Zap,
  "spin-and-spark": Disc3,
  "pipeline-puzzle": Layers,
  "hazard-hunt": Search,
  "pressure-point": Gauge,
} as const;

export default function MenuPage() {
  const { backgroundVideoEnabled } = useSettings();

  return (
    <main className="relative flex min-h-[calc(100svh-4rem)] flex-col bg-white px-6 py-4">
      <AnimatedNOGBackground variant="hero" />
      <IndustrialAmbience tone="onLight" />

      {backgroundVideoEnabled && (
        <VideoBackdrop src="/videos/oil-gas-loop.mp4" opacityClassName="opacity-20" overlayClassName="bg-white/50" />
      )}

      <div className="relative z-10 mx-auto my-auto flex w-full flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center"
        >
          <Logo className="mb-3 h-20 w-auto sm:h-24" priority />
          <span className="animate-glow-pulse flex items-center gap-2 rounded-full bg-nog-gold-500/15 px-6 py-2 text-base font-bold uppercase tracking-widest text-nog-gold-700">
            <span className="h-2 w-2 rounded-full bg-nog-gold-600" />
            Nigeria Oil &amp; Gas Conference
          </span>
          <p className="mt-3 flex max-w-2xl flex-wrap items-center justify-center gap-x-3 text-2xl font-black text-nog-black/70">
            {["Step", "up.", "Compete.", "Win."].map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.15, duration: 0.4 }}
                className={i === 3 ? "text-nog-green-700" : undefined}
              >
                {word}
              </motion.span>
            ))}
          </p>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
          className="mt-5 text-4xl font-black tracking-tight text-nog-black sm:text-5xl"
        >
          <span className="animate-shimmer-text bg-linear-to-r from-nog-green-700 via-nog-gold-500 to-nog-green-700 bg-clip-text text-transparent">
            Choose Your Game
          </span>
        </motion.h2>

        <div className="mt-6 grid w-[95vw] max-w-400 grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {GAMES.map((game, i) => (
            <AnimatedGameCard key={game.id} game={game} icon={GAME_ICONS[game.id]} index={i} />
          ))}
        </div>

        <Link
          href="/admin"
          className="mt-6 flex items-center gap-2 rounded-full border-2 border-nog-black/10 bg-white/70 px-6 py-3 text-lg font-bold text-nog-black/50 transition-all hover:-translate-y-0.5 hover:border-nog-green-600 hover:text-nog-green-700 hover:shadow-md"
        >
          <Settings size={20} /> Admin Settings
        </Link>
      </div>
    </main>
  );
}
