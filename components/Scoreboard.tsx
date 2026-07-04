"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion } from "framer-motion";
import { Crown } from "lucide-react";
import type { PlayerResult } from "@/lib/scoring";
import { rankPlayers } from "@/lib/scoring";

interface ScoreboardProps {
  players: PlayerResult[];
  title?: string;
}

const RANK_STYLES = [
  "bg-nog-gold-500/20 border-nog-gold-500 text-nog-gold-700",
  "bg-nog-black/5 border-nog-black/20 text-nog-black/70",
  "bg-nog-green-600/10 border-nog-green-600/40 text-nog-green-800",
];

function useAnimatedNumber(value: number) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    const controls = animate(prevRef.current, value, {
      duration: 0.5,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    prevRef.current = value;
    return () => controls.stop();
  }, [value]);

  return display;
}

function ScoreRow({ player, rank }: { player: PlayerResult; rank: number }) {
  const animatedScore = useAnimatedNumber(player.score);

  return (
    <motion.li
      layout
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.05 }}
      className={`flex items-center justify-between rounded-2xl border-2 px-5 py-4 lg:px-6 lg:py-5 ${
        RANK_STYLES[rank] ?? "bg-white border-nog-black/10 text-nog-black/60"
      }`}
    >
      <div className="flex items-center gap-3">
        {rank === 0 && (
          <motion.span
            animate={{ rotate: [0, -8, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1 }}
          >
            <Crown size={22} className="text-nog-gold-600 lg:size-7" />
          </motion.span>
        )}
        <span className="text-xl font-bold lg:text-2xl">{rank + 1}. {player.name}</span>
      </div>
      <div className="flex items-center gap-4 text-right">
        <span className="text-sm font-semibold opacity-70 lg:text-base">
          {player.correct}/{player.total} correct
        </span>
        <span className="text-2xl font-black tabular-nums lg:text-3xl">{animatedScore}</span>
      </div>
    </motion.li>
  );
}

export default function Scoreboard({ players, title = "Scoreboard" }: ScoreboardProps) {
  const ranked = rankPlayers(players);

  return (
    <div className="w-full rounded-3xl border-2 border-nog-black/10 bg-white p-6 shadow-md lg:p-8">
      <h3 className="mb-4 text-xl font-black uppercase tracking-wide text-nog-black/70 lg:text-2xl">
        {title}
      </h3>
      <ul className="flex flex-col gap-3">
        {ranked.map((player, i) => (
          <ScoreRow key={player.name} player={player} rank={i} />
        ))}
      </ul>
    </div>
  );
}
