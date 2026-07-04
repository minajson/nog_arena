"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Settings, Zap, Disc3, Layers, Search, Gauge } from "lucide-react";
import AnimatedGameCard from "@/components/AnimatedGameCard";
import AnimatedNOGBackground from "@/components/AnimatedNOGBackground";
import VideoIntro from "@/components/VideoIntro";
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

export default function HomePage() {
  const { backgroundVideoEnabled } = useSettings();
  // No persistence on purpose — the attract screen is meant to run every time
  // the app loads or the page is refreshed, per the conference-booth kiosk flow.
  const [showOpening, setShowOpening] = useState(true);

  function dismissOpening() {
    setShowOpening(false);
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-hidden bg-white px-6 py-12">
      <AnimatedNOGBackground variant="hero" />

      {backgroundVideoEnabled && <VideoBackdrop src="/videos/oil-gas-loop.mp4" />}

      <AnimatePresence>
        {showOpening && (
          <VideoIntro
            key="opening-video"
            src="/videos/opening-video.mp4"
            label="Opening Video"
            onEnd={dismissOpening}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center"
      >
        <Logo className="mb-4 h-28 w-auto sm:h-40" priority />
        <span className="animate-glow-pulse flex items-center gap-2 rounded-full bg-nog-gold-500/15 px-5 py-2 text-sm font-bold uppercase tracking-widest text-nog-gold-700">
          <span className="h-1.5 w-1.5 rounded-full bg-nog-gold-600" />
          Nigeria Oil &amp; Gas Conference
        </span>
        <div className="relative mt-6">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 scale-150 rounded-full bg-linear-to-r from-nog-green-500/15 via-nog-gold-500/15 to-nog-green-500/15 blur-3xl"
          />
          <h1 className="text-6xl font-black tracking-tight text-nog-black sm:text-7xl">
            NOG <span className="text-nog-green-700">ARENA</span>
          </h1>
        </div>
        <p className="mt-4 flex max-w-xl flex-wrap items-center justify-center gap-x-2 text-xl font-black text-nog-black/70">
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
        className="relative mt-16 text-4xl font-black tracking-tight text-nog-black sm:text-5xl"
      >
        <span className="animate-shimmer-text bg-linear-to-r from-nog-green-700 via-nog-gold-500 to-nog-green-700 bg-clip-text text-transparent">
          Choose Your Game
        </span>
      </motion.h2>

      <div className="mt-8 grid w-[95vw] max-w-350 grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
        {GAMES.map((game, i) => (
          <AnimatedGameCard key={game.id} game={game} icon={GAME_ICONS[game.id]} index={i} />
        ))}
      </div>

      <Link
        href="/admin"
        className="mt-16 flex items-center gap-2 rounded-full border-2 border-nog-black/10 px-5 py-3 text-base font-bold text-nog-black/50 transition-all hover:-translate-y-0.5 hover:border-nog-green-600 hover:text-nog-green-700 hover:shadow-md"
      >
        <Settings size={18} /> Admin Settings
      </Link>
    </main>
  );
}
