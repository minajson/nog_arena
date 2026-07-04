"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Fuel,
  Factory,
  Minus,
  CornerDownRight,
  CircleDot,
  Fan,
  Database,
  Gauge,
  Cog,
  Link2,
  ArrowRight,
  ArrowDown,
  Layers,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import GameTopBar from "@/components/GameTopBar";
import PlayerSetup from "@/components/PlayerSetup";
import Timer from "@/components/Timer";
import Scoreboard from "@/components/Scoreboard";
import WinnerScreen from "@/components/WinnerScreen";
import GameIntro3D from "@/components/GameIntro3D";
import ConfettiCelebration from "@/components/ConfettiCelebration";
import { usePipelineSequence, useSettings } from "@/lib/store";
import { shuffleArray } from "@/lib/shuffle";
import { playSound } from "@/lib/sound";
import { PIPELINE_PIECE_LABELS, PIPELINE_SCORING, type PipelinePieceType } from "@/data/pipelineData";
import type { PlayerResult } from "@/lib/scoring";

const PIECE_ICONS: Record<PipelinePieceType, LucideIcon> = {
  "straight-pipe": Minus,
  "elbow-pipe": CornerDownRight,
  valve: CircleDot,
  pump: Fan,
  "storage-tank": Database,
  "pressure-gauge": Gauge,
  compressor: Cog,
  "final-connector": Link2,
};

type Phase = "intro" | "setup" | "playing" | "turn-end" | "results";
interface Tile {
  id: string;
  type: PipelinePieceType;
}
interface Breakdown {
  correctCount: number;
  wrongCount: number;
  completionBonus: number;
  timeBonus: number;
  completed: boolean;
}

const emptyBreakdown: Breakdown = { correctCount: 0, wrongCount: 0, completionBonus: 0, timeBonus: 0, completed: false };

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
  const [glowSlot, setGlowSlot] = useState<number | null>(null);
  const [flowing, setFlowing] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [breakdown, setBreakdown] = useState<Breakdown>(emptyBreakdown);

  function setupTurn() {
    setSlots(sequence.map(() => null));
    setTray(shuffleArray(sequence.map((type, i) => ({ id: `${i}-${type}`, type }))));
    setSelectedTile(null);
    setTurnActive(true);
    setTurnKey((k) => k + 1);
    setEndMessage("");
    setBreakdown(emptyBreakdown);
    setFlowing(false);
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

  function finishTurn(finalBreakdown: Breakdown, message: string) {
    setBreakdown(finalBreakdown);
    setTurnActive(false);
    setEndMessage(message);
    setPhase("turn-end");
    if (finalBreakdown.completed) setCelebrating(true);
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
      setGlowSlot(slotIndex);
      setTimeout(() => setGlowSlot((cur) => (cur === slotIndex ? null : cur)), 600);
      const nextBreakdown = { ...breakdown, correctCount: breakdown.correctCount + 1 };
      setBreakdown(nextBreakdown);

      if (nextSlots.every((s) => s !== null)) {
        const completionBonus = PIPELINE_SCORING.completionBonus;
        const timeBonus = timeLeft * PIPELINE_SCORING.timeBonusPerSecond;
        addScore(completionBonus + timeBonus, false);
        playSound("celebration");
        setFlowing(true);
        setTurnActive(false);
        setTimeout(() => {
          finishTurn(
            { ...nextBreakdown, completionBonus, timeBonus, completed: true },
            "Pipeline Restored!"
          );
        }, 1300);
      }
    } else {
      playSound("wrong");
      addScore(PIPELINE_SCORING.wrongPiece, false);
      setSelectedTile(null);
      setShakeSlot(slotIndex);
      setTimeout(() => setShakeSlot(null), 400);
      setBreakdown((prev) => ({ ...prev, wrongCount: prev.wrongCount + 1 }));
    }
  }

  function nextPlayerOrResults() {
    setCelebrating(false);
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

  function renderSlot(i: number) {
    const filled = slots[i];
    const Icon = filled ? PIECE_ICONS[filled] : null;
    const isGlowing = glowSlot === i;
    const isFlowLit = flowing && filled !== null;
    return (
      <motion.button
        key={i}
        onClick={() => placePiece(i)}
        animate={
          shakeSlot === i
            ? { x: [0, -8, 8, -8, 8, 0] }
            : isGlowing || isFlowLit
              ? { scale: [1, 1.15, 1] }
              : { x: 0, scale: 1 }
        }
        transition={isFlowLit ? { delay: i * 0.05, duration: 0.4 } : undefined}
        className={`flex h-14 w-14 shrink-0 flex-col items-center justify-center gap-1 rounded-2xl border-2 text-[9px] font-bold cursor-pointer sm:h-[4.5rem] sm:w-[4.5rem] sm:text-[11px] ${
          filled
            ? `border-nog-green-600 bg-nog-green-600/10 text-nog-green-800 ${isGlowing || isFlowLit ? "shadow-[0_0_0_6px_rgba(15,148,85,0.25)]" : ""}`
            : "border-dashed border-nog-black/20 text-nog-black/30 hover:border-nog-green-500"
        }`}
      >
        {Icon ? <Icon size={18} className="sm:hidden" /> : <span className="text-base sm:hidden">?</span>}
        {Icon ? <Icon size={24} className="hidden sm:block" /> : <span className="hidden text-xl sm:block">?</span>}
        <span className="leading-none">{filled ? PIPELINE_PIECE_LABELS[filled] : i + 1}</span>
      </motion.button>
    );
  }

  const totalTurnScore =
    breakdown.correctCount * PIPELINE_SCORING.correctPiece +
    breakdown.wrongCount * PIPELINE_SCORING.wrongPiece +
    breakdown.completionBonus +
    breakdown.timeBonus;

  return (
    <main className="relative min-h-screen bg-white px-6 py-8">
      {phase === "intro" && (
        <GameIntro3D
          title="Pipeline Puzzle"
          icon={Layers}
          objective="Repair the broken pipeline route by placing pieces in the correct order, from the Oil Well all the way to the Processing Facility."
          players="2 Players (turns)"
          timer={`${settings.pipelineTimePerPlayer}s per player`}
          howToPlay={[
            "Tap a piece from the tray, then tap the slot you want to place it in.",
            "The 15-slot route snakes across 4 rows — follow the arrows.",
            "Wrong placements bounce back to the tray so you can try again.",
            "Complete the full route before time runs out for a big bonus.",
          ]}
          scoring={[
            `Correct piece: +${PIPELINE_SCORING.correctPiece} points.`,
            `Wrong placement: ${PIPELINE_SCORING.wrongPiece} points.`,
            `Completed route bonus: +${PIPELINE_SCORING.completionBonus} points.`,
            `Time bonus: +${PIPELINE_SCORING.timeBonusPerSecond} point per second remaining.`,
          ]}
          onContinue={() => setPhase("setup")}
        />
      )}

      {phase !== "intro" && <GameTopBar title="Pipeline Puzzle" />}

      {phase === "setup" && (
        <div className="mx-auto max-w-lg">
          <PlayerSetup onStart={startGame} fixedCount={2} />
        </div>
      )}

      {phase === "playing" && (
        <div className="mx-auto flex max-w-5xl flex-col gap-6">
          <h2 className="text-center text-3xl font-black text-nog-black">Pipeline Puzzle</h2>
          <span className="mx-auto rounded-full bg-nog-gold-500/20 px-5 py-2 text-lg font-black text-nog-gold-700">
            {players[playerIndex]}&apos;s Turn
          </span>

          <Timer
            key={turnKey}
            duration={settings.pipelineTimePerPlayer}
            isRunning={turnActive}
            onExpire={() => finishTurn({ ...breakdown, completionBonus: 0, timeBonus: 0, completed: false }, "Time's up!")}
            onTick={setTimeLeft}
            warningThreshold={settings.pipelineWarningThreshold}
          />

          <div className="flex flex-col items-center gap-1 rounded-3xl border-2 border-nog-black/10 bg-white p-4 shadow-md sm:gap-2 sm:p-6">
            <div className="flex items-center justify-center gap-1 sm:gap-2">
              <PipelineNode icon={Fuel} label="Oil Well" />
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-1 sm:gap-2">
                  <ArrowRight className="text-nog-black/20" size={14} />
                  {renderSlot(i)}
                </div>
              ))}
            </div>

            <div className="flex w-full justify-end pr-4 sm:pr-8">
              <ArrowDown className="text-nog-black/20" size={18} />
            </div>

            <div className="flex flex-row-reverse items-center justify-center gap-1 sm:gap-2">
              {[4, 5, 6, 7].map((i) => (
                <div key={i} className="flex flex-row-reverse items-center gap-1 sm:gap-2">
                  <ArrowRight className="rotate-180 text-nog-black/20" size={14} />
                  {renderSlot(i)}
                </div>
              ))}
            </div>

            <div className="flex w-full justify-start pl-4 sm:pl-8">
              <ArrowDown className="text-nog-black/20" size={18} />
            </div>

            <div className="flex items-center justify-center gap-1 sm:gap-2">
              {[8, 9, 10, 11].map((i) => (
                <div key={i} className="flex items-center gap-1 sm:gap-2">
                  {i !== 8 && <ArrowRight className="text-nog-black/20" size={14} />}
                  {renderSlot(i)}
                </div>
              ))}
            </div>

            <div className="flex w-full justify-end pr-4 sm:pr-8">
              <ArrowDown className="text-nog-black/20" size={18} />
            </div>

            <div className="flex flex-row-reverse items-center justify-center gap-1 sm:gap-2">
              <PipelineNode icon={Factory} label="Processing Facility" />
              {[12, 13, 14].map((i) => (
                <div key={i} className="flex flex-row-reverse items-center gap-1 sm:gap-2">
                  <ArrowRight className="rotate-180 text-nog-black/20" size={14} />
                  {renderSlot(i)}
                </div>
              ))}
            </div>
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
        <div className="relative mx-auto flex max-w-lg flex-col items-center gap-6 text-center">
          {celebrating && <ConfettiCelebration active durationMs={3000} />}
          <p className="text-3xl font-black text-nog-black">{endMessage}</p>

          <div className="w-full rounded-3xl border-2 border-nog-black/10 p-6 text-left shadow-sm">
            <h3 className="mb-3 text-center text-lg font-black uppercase tracking-wide text-nog-black/60">
              Score Breakdown
            </h3>
            <div className="flex flex-col gap-2 text-base font-semibold text-nog-black/70">
              <div className="flex justify-between">
                <span>Correct pieces ({breakdown.correctCount} × {PIPELINE_SCORING.correctPiece})</span>
                <span className="font-black text-nog-green-700">
                  +{breakdown.correctCount * PIPELINE_SCORING.correctPiece}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Wrong placements ({breakdown.wrongCount} × {PIPELINE_SCORING.wrongPiece})</span>
                <span className="font-black text-red-600">
                  {breakdown.wrongCount * PIPELINE_SCORING.wrongPiece}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Completion bonus</span>
                <span className="font-black text-nog-gold-600">+{breakdown.completionBonus}</span>
              </div>
              <div className="flex justify-between">
                <span>Time bonus</span>
                <span className="font-black text-nog-gold-600">+{breakdown.timeBonus}</span>
              </div>
              <div className="mt-2 flex justify-between border-t-2 border-nog-black/10 pt-2 text-xl">
                <span className="font-black text-nog-black">Turn Total</span>
                <span className="font-black text-nog-black">{totalTurnScore}</span>
              </div>
            </div>
          </div>

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
    <div className="flex shrink-0 flex-col items-center gap-1">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-nog-green-800 text-nog-gold-400 sm:h-[4.5rem] sm:w-[4.5rem]">
        <Icon size={22} className="sm:hidden" />
        <Icon size={30} className="hidden sm:block" />
      </div>
      <span className="max-w-20 text-center text-[10px] font-bold text-nog-black/70 sm:text-xs">{label}</span>
    </div>
  );
}
