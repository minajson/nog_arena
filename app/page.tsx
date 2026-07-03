"use client";

import { useState } from "react";
import Link from "next/link";
import { Settings, Zap, Disc3, Layers, Search, Gauge } from "lucide-react";
import GameCard from "@/components/GameCard";
import VideoIntro from "@/components/VideoIntro";
import Logo from "@/components/Logo";
import { GAMES } from "@/data/games";
import { useSettings } from "@/lib/store";
import { useMountFlag } from "@/lib/useMountFlag";

const GAME_ICONS = {
  "buzz-and-drill": Zap,
  "spin-and-spark": Disc3,
  "pipeline-puzzle": Layers,
  "hazard-hunt": Search,
  "pressure-point": Gauge,
} as const;

const OPENING_SEEN_KEY = "nog-arena:seen-opening";

export default function HomePage() {
  const { backgroundVideoEnabled } = useSettings();
  const openingUnseen = useMountFlag(() => !sessionStorage.getItem(OPENING_SEEN_KEY));
  const [dismissed, setDismissed] = useState(false);
  const showOpening = openingUnseen && !dismissed;

  function dismissOpening() {
    sessionStorage.setItem(OPENING_SEEN_KEY, "1");
    setDismissed(true);
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-hidden bg-white px-6 py-12">
      {backgroundVideoEnabled && (
        <VideoIntro
          src="/videos/oil-gas-loop.mp4"
          label="Background loop"
          variant="background"
          onEnd={() => {}}
        />
      )}

      {showOpening && (
        <VideoIntro
          src="/videos/opening-video.mp4"
          label="Opening Video"
          onEnd={dismissOpening}
        />
      )}

      <div className="flex flex-col items-center text-center">
        <Logo className="mb-4 h-28 w-auto sm:h-40" priority />
        <span className="rounded-full bg-nog-gold-500/15 px-5 py-2 text-sm font-bold uppercase tracking-widest text-nog-gold-700">
          Nigeria Oil &amp; Gas Conference
        </span>
        <h1 className="mt-6 text-6xl font-black tracking-tight text-nog-black sm:text-7xl">
          NOG <span className="text-nog-green-700">ARENA</span>
        </h1>
        <p className="mt-4 max-w-xl text-xl font-semibold text-nog-black/60">
          Step up, take the challenge, and prove your energy sector know-how.
        </p>
      </div>

      <div className="mt-14 grid w-full max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {GAMES.map((game, i) => (
          <GameCard key={game.id} game={game} icon={GAME_ICONS[game.id]} index={i} />
        ))}
      </div>

      <Link
        href="/admin"
        className="mt-16 flex items-center gap-2 rounded-full border-2 border-nog-black/10 px-5 py-3 text-base font-bold text-nog-black/50 hover:border-nog-green-600 hover:text-nog-green-700 transition-colors"
      >
        <Settings size={18} /> Admin Settings
      </Link>
    </main>
  );
}
