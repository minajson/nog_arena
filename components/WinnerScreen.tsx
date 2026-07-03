"use client";

import { useEffect } from "react";
import { Trophy } from "lucide-react";
import Logo from "./Logo";
import ConfettiCelebration from "./ConfettiCelebration";
import Scoreboard from "./Scoreboard";
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
    <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-8 text-center">
      <ConfettiCelebration active />
      <Logo className="h-20 w-auto sm:h-28" />
      <Trophy size={64} className="text-nog-gold-500" />
      <div>
        <h2 className="text-4xl font-black text-nog-black sm:text-5xl">
          {tie ? "It's a tie!" : `Congratulations, ${winners[0]?.name}!`}
        </h2>
        <p className="mt-2 text-xl font-semibold text-nog-black/60">
          {tie
            ? `${winners.map((w) => w.name).join(" & ")} tied for first place!`
            : subtitle ?? "Great round!"}
        </p>
      </div>

      <div className="w-full">
        <Scoreboard players={players} title="Final Results" />
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={onPlayAgain}
          className="rounded-2xl bg-nog-green-700 px-8 py-4 text-xl font-black text-white hover:bg-nog-green-800 cursor-pointer"
        >
          Play Again
        </button>
        <button
          onClick={onExitMenu}
          className="rounded-2xl border-2 border-nog-black/15 px-8 py-4 text-xl font-black text-nog-black/70 hover:border-nog-green-600 hover:text-nog-green-700 cursor-pointer"
        >
          Back to Menu
        </button>
      </div>
    </div>
  );
}
