"use client";

import { useEffect } from "react";
import Scoreboard from "./Scoreboard";
import WinnerCelebration from "./WinnerCelebration";
import VideoBackdrop from "./VideoBackdrop";
import { decideWinner, type PlayerResult } from "@/lib/scoring";
import { playSound } from "@/lib/sound";
import { addLeaderboardEntry } from "@/lib/store";

interface WinnerScreenProps {
  game: string;
  players: PlayerResult[];
  subtitle?: string;
  onPlayAgain: () => void;
  onExitMenu: () => void;
}

export default function WinnerScreen({ game, players, subtitle, onPlayAgain, onExitMenu }: WinnerScreenProps) {
  const { winners, tie } = decideWinner(players);

  useEffect(() => {
    playSound("winner");
    const id = setTimeout(() => playSound("celebration"), 400);
    addLeaderboardEntry({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      game,
      winner: tie ? winners.map((w) => w.name).join(" & ") : winners[0]?.name ?? "",
      score: winners[0]?.score ?? 0,
      tie,
      timestamp: Date.now(),
    });
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative flex flex-col items-center gap-8 py-2">
      <VideoBackdrop src="/videos/oil-gas-loop.mp4" opacityClassName="opacity-10" />
      <WinnerCelebration
        winnerNames={winners.map((w) => w.name)}
        tie={tie}
        subtitle={subtitle}
        onPlayAgain={onPlayAgain}
        onExitMenu={onExitMenu}
      />
      <div className="w-[92vw] max-w-3xl">
        <Scoreboard players={players} title="Final Results" />
      </div>
    </div>
  );
}
