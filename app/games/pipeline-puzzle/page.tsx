"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Fuel,
  Factory,
  Minus,
  CornerDownRight,
  CircleDot,
  Gauge,
  Database,
  ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import GameTopBar from "@/components/GameTopBar";
import PlayerSetup from "@/components/PlayerSetup";
import Timer from "@/components/Timer";
import Scoreboard from "@/components/Scoreboard";
import WinnerScreen from "@/components/WinnerScreen";
import VideoIntro from "@/components/VideoIntro";
import { usePipelineSequence, useSettings } from "@/lib/store";
import { shuffleArray } from "@/lib/shuffle";
import { playSound } from "@/lib/sound";
import { PIPELINE_PIECE_LABELS, PIPELINE_SCORING, type PipelinePieceType } from "@/data/pipelineData";
import type { PlayerResult } from "@/lib/scoring";

const PIECE_ICONS: Record<PipelinePieceType, LucideIcon> = {
  "straight-pipe": Minus,
  "elbow-pipe": CornerDownRight,
  valve: CircleDot,
  pump: Gauge,
  "storage-tank": Database,
};

type Phase = "intro" | "setup" | "playing" | "turn-end" | "results";
interface Tile {
  id: string;
  type: PipelinePieceType;
}

export default function PipelinePuzzlePage() {
  const router = useRouter();
  const sequence = usePipelineSequence();
  const settings = useSettings();
  const [phase, setPhase] = useState<Phase>("intro");
  const [players, setPlayers] = useState<string[]>(["", ""]);
  const [results, setResults] = useState<PlayerResult[]>([]);
  const [playerIndex, setPlayerIndex] = useState(0);
  const [slots, setSlots] = useState<(PipelinePieceType | null)[]>([]);
  const [tray, setTray] = useState<Tile[]>([]);
  const [selectedTile, setSelectedTile] = useState<string | null>(null);
  const [turnActive, setTurnActive] = useState(false);
  const [turnKey, setTurnKey] = useState(0);
  const [timeLeft, setTimeLeft] = useState(settings.pipelineTimePerPlayer);
  const [endMessage, setEndMessage] = useState("");
  const [shakeSlot, setShakeSlot] = useState<number | null>(null);

  function setupTurn() {
    setSlots(sequence.map(() => null));
    setTray(shuffleArray(sequence.map((type, i) => ({ id: `${i}-${type}`, type }))));
    setSelectedTile(null);
    setTurnActive(true);
    setTurnKey((k) => k + 1);
    setEndMessage("");
  }

  function startGame(names: string[]) {
    setPlayers(names);
    setResults(names.map((name) => ({ name, score: 0, correct: 0, total: 0 })));
    setPlayerIndex(0);
    setPhase("playing");
    setupTurn();
  }

  function addScore(delta: number, wasCorrect: boolean) {
    setResults((prev) =>
      prev.map((p, i) =>
        i === playerIndex
          ? { ...p, score: p.score + delta, correct: p.correct + (wasCorrect ? 1 : 0), total: p.total + 1 }
          : p
      )
    );
  }

  function finishTurn(bonus: number, message: string) {
    if (bonus !== 0) {
      setResults((prev) => prev.map((p, i) => (i === playerIndex ? { ...p, score: p.score + bonus } : p)));
    }
    setTurnActive(false);
    setEndMessage(message);
    setPhase("turn-end");
  }

  function placePiece(slotIndex: number) {
    if (!turnActive || slots[slotIndex] !== null || !selectedTile) return;
    const tile = tray.find((t) => t.id === selectedTile);
    if (!tile) return;

    if (tile.type === sequence[slotIndex]) {
      playSound("correct");
      const nextSlots = slots.map((s, i) => (i === slotIndex ? tile.type : s));
      setSlots(nextSlots);
      setTray((prev) => prev.filter((t) => t.id !== tile.id));
      setSelectedTile(null);
      addScore(PIPELINE_SCORING.correctPiece, true);

      if (nextSlots.every((s) => s !== null)) {
        const bonus = PIPELINE_SCORING.completionBonus + timeLeft * PIPELINE_SCORING.timeBonusPerSecond;
        playSound("celebration");
        finishTurn(bonus, `Route complete! Bonus +${bonus}`);
      }
    } else {
      playSound("wrong");
      addScore(PIPELINE_SCORING.wrongPiece, false);
      setSelectedTile(null);
      setShakeSlot(slotIndex);
      setTimeout(() => setShakeSlot(null), 400);
    }
  }

  function nextPlayerOrResults() {
    if (playerIndex === 0) {
      setPlayerIndex(1);
      setPhase("playing");
      setupTurn();
    } else {
      setPhase("results");
    }
  }

  function exitToMenu() {
    router.push("/");
  }

  return (
    <main className="relative min-h-screen bg-white px-6 py-8">
      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <VideoIntro key="intro" src="/videos/game-intro.mp4" label="Pipeline Puzzle Intro" onEnd={() => setPhase("setup")} />
        )}
      </AnimatePresence>

      {phase !== "intro" && <GameTopBar title="Pipeline Puzzle" />}

      {phase === "setup" && (
        <div className="mx-auto max-w-lg">
          <PlayerSetup onStart={startGame} fixedCount={2} />
        </div>
      )}

      {phase === "playing" && (
        <div className="mx-auto flex max-w-5xl flex-col gap-6">
          <span className="mx-auto rounded-full bg-nog-gold-500/20 px-5 py-2 text-lg font-black text-nog-gold-700">
            {players[playerIndex]}&apos;s Turn
          </span>

          <Timer
            key={turnKey}
            duration={settings.pipelineTimePerPlayer}
            isRunning={turnActive}
            onExpire={() => finishTurn(0, "Time's up!")}
            onTick={setTimeLeft}
            warningThreshold={settings.pipelineWarningThreshold}
          />

          <div className="flex flex-wrap items-center justify-center gap-1 rounded-3xl border-2 border-nog-black/10 bg-white p-4 shadow-md sm:gap-2 sm:p-6">
            <PipelineNode icon={Fuel} label="Oil Well" />
            {slots.map((filled, i) => {
              const Icon = filled ? PIECE_ICONS[filled] : null;
              return (
                <div key={i} className="flex items-center gap-1 sm:gap-2">
                  <ArrowRight className="text-nog-black/20" size={16} />
                  <motion.button
                    onClick={() => placePiece(i)}
                    animate={shakeSlot === i ? { x: [0, -8, 8, -8, 8, 0] } : { x: 0 }}
                    className={`flex h-14 w-14 flex-col items-center justify-center gap-1 rounded-2xl border-2 text-[10px] font-bold cursor-pointer sm:h-20 sm:w-20 sm:text-xs ${
                      filled
                        ? "border-nog-green-600 bg-nog-green-600/10 text-nog-green-800"
                        : "border-dashed border-nog-black/20 text-nog-black/30 hover:border-nog-green-500"
                    }`}
                  >
                    {Icon ? <Icon size={20} className="sm:hidden" /> : <span className="text-lg sm:hidden">?</span>}
                    {Icon ? <Icon size={26} className="hidden sm:block" /> : <span className="hidden text-2xl sm:block">?</span>}
                    <span className="leading-none">{filled ? PIPELINE_PIECE_LABELS[filled] : "Empty"}</span>
                  </motion.button>
                </div>
              );
            })}
            <ArrowRight className="text-nog-black/20" size={16} />
            <PipelineNode icon={Factory} label="Processing Facility" />
          </div>

          <div className="rounded-3xl border-2 border-nog-black/10 bg-white p-6 shadow-md">
            <p className="mb-3 text-center text-base font-bold uppercase tracking-wide text-nog-black/50">
              Tap a piece, then tap the slot to place it
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {tray.map((tile) => {
                const Icon = PIECE_ICONS[tile.type];
                const isSelected = selectedTile === tile.id;
                return (
                  <button
                    key={tile.id}
                    onClick={() => setSelectedTile(isSelected ? null : tile.id)}
                    className={`flex flex-col items-center gap-1 rounded-2xl border-2 px-5 py-4 text-sm font-bold cursor-pointer transition-colors ${
                      isSelected
                        ? "border-nog-gold-500 bg-nog-gold-500/15 text-nog-gold-700 ring-4 ring-nog-gold-500/30"
                        : "border-nog-black/15 text-nog-black/70 hover:border-nog-green-600"
                    }`}
                  >
                    <Icon size={28} />
                    {PIPELINE_PIECE_LABELS[tile.type]}
                  </button>
                );
              })}
              {tray.length === 0 && (
                <p className="text-lg font-semibold text-nog-black/40">All pieces placed!</p>
              )}
            </div>
          </div>

          <Scoreboard players={results} title="Live Scores" />
        </div>
      )}

      {phase === "turn-end" && (
        <div className="mx-auto flex max-w-lg flex-col items-center gap-6 text-center">
          <p className="text-3xl font-black text-nog-black">{endMessage}</p>
          <Scoreboard players={results} title="Scores So Far" />
          <button
            onClick={nextPlayerOrResults}
            className="rounded-2xl bg-nog-green-700 px-8 py-4 text-xl font-black text-white hover:bg-nog-green-800 cursor-pointer"
          >
            {playerIndex === 0 ? "Next Player" : "See Results"}
          </button>
        </div>
      )}

      {phase === "results" && (
        <WinnerScreen
          game="Pipeline Puzzle"
          players={results}
          subtitle="Great work repairing the pipeline route."
          onPlayAgain={() => setPhase("setup")}
          onExitMenu={exitToMenu}
        />
      )}
    </main>
  );
}

function PipelineNode({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-nog-green-800 text-nog-gold-400 sm:h-20 sm:w-20">
        <Icon size={22} className="sm:hidden" />
        <Icon size={32} className="hidden sm:block" />
      </div>
      <span className="max-w-20 text-center text-xs font-bold text-nog-black/70">{label}</span>
    </div>
  );
}
