"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion } from "framer-motion";
import { Crown } from "lucide-react";
import type { PlayerResult } from "@/lib/scoring";
import { rankPlayers } from "@/lib/scoring";

interface ScoreboardProps {
  players: PlayerResult[];
  title?: string;
  /** Tighter paddings/type for sidebars on screens that must fit 100vh. */
  compact?: boolean;
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

function ScoreRow({ player, rank, compact }: { player: PlayerResult; rank: number; compact?: boolean }) {
  const animatedScore = useAnimatedNumber(player.score);

  return (
    <motion.li
      layout
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.05 }}
      className={`flex items-center justify-between border-2 ${
        compact ? "rounded-xl px-4 py-2.5" : "rounded-2xl px-5 py-4 lg:px-6 lg:py-5"
      } ${RANK_STYLES[rank] ?? "bg-white border-nog-black/10 text-nog-black/60"}`}
    >
      <div className={`flex items-center ${compact ? "gap-2" : "gap-3"}`}>
        {rank === 0 && (
          <motion.span
            animate={{ rotate: [0, -8, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1 }}
          >
            <Crown size={compact ? 18 : 22} className={compact ? "text-nog-gold-600" : "text-nog-gold-600 lg:size-7"} />
          </motion.span>
        )}
        <span className={compact ? "text-base font-bold" : "text-xl font-bold lg:text-2xl"}>
          {rank + 1}. {player.name}
        </span>
      </div>
      <div className={`flex items-center text-right ${compact ? "gap-2.5" : "gap-4"}`}>
        <span className={compact ? "text-xs font-semibold opacity-70" : "text-sm font-semibold opacity-70 lg:text-base"}>
          {player.correct}/{player.total} correct
        </span>
        <span className={`font-black tabular-nums ${compact ? "text-xl" : "text-2xl lg:text-3xl"}`}>{animatedScore}</span>
      </div>
    </motion.li>
  );
}

export default function Scoreboard({ players, title = "Scoreboard", compact = false }: ScoreboardProps) {
  const ranked = rankPlayers(players);

  return (
    <div
      className={`w-full border-2 border-nog-black/10 bg-white shadow-md ${
        compact ? "rounded-2xl p-4" : "rounded-3xl p-6 lg:p-8"
      }`}
    >
      <h3
        className={`font-black uppercase tracking-wide text-nog-black/70 ${
          compact ? "mb-2.5 text-sm" : "mb-4 text-xl lg:text-2xl"
        }`}
      >
        {title}
      </h3>
      <ul className={`flex flex-col ${compact ? "gap-2" : "gap-3"}`}>
        {ranked.map((player, i) => (
          <ScoreRow key={player.name} player={player} rank={i} compact={compact} />
        ))}
      </ul>
    </div>
  );
}
