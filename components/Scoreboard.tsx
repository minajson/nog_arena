"use client";

import { motion } from "framer-motion";
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

export default function Scoreboard({ players, title = "Scoreboard" }: ScoreboardProps) {
  const ranked = rankPlayers(players);

  return (
    <div className="w-full rounded-3xl border-2 border-nog-black/10 bg-white p-6 shadow-md">
      <h3 className="mb-4 text-xl font-black uppercase tracking-wide text-nog-black/70">
        {title}
      </h3>
      <ul className="flex flex-col gap-3">
        {ranked.map((player, i) => (
          <motion.li
            key={player.name}
            layout
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`flex items-center justify-between rounded-2xl border-2 px-5 py-4 ${
              RANK_STYLES[i] ?? "bg-white border-nog-black/10 text-nog-black/60"
            }`}
          >
            <div className="flex items-center gap-3">
              {i === 0 && <Crown size={22} className="text-nog-gold-600" />}
              <span className="text-xl font-bold">{i + 1}. {player.name}</span>
            </div>
            <div className="flex items-center gap-4 text-right">
              <span className="text-sm font-semibold opacity-70">
                {player.correct}/{player.total} correct
              </span>
              <span className="text-2xl font-black tabular-nums">{player.score}</span>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
