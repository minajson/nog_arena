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
import AnimatedNOGBackground from "@/components/AnimatedNOGBackground";
import VideoBackdrop from "@/components/VideoBackdrop";
import BurstEffect from "@/components/BurstEffect";
import { usePipelineSequence, useSettings } from "@/lib/store";
import { shuffleArray } from "@/lib/shuffle";
import { playSound } from "@/lib/sound";
import { speak, VOICE_LINES } from "@/lib/speech";
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
  const [restoredBurst, setRestoredBurst] = useState(false);

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
    speak(VOICE_LINES.gameStart);
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
      playSound("lockIn", { volume: 0.8, rate: 0.5 });
      speak(VOICE_LINES.correct);
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
        setRestoredBurst(true);
        setTurnActive(false);
        setTimeout(() => setRestoredBurst(false), 1300);
        setTimeout(() => {
          finishTurn(
            { ...nextBreakdown, completionBonus, timeBonus, completed: true },
            "Pipeline Restored!"
          );
        }, 1300);
      }
    } else {
      playSound("wrong");
      speak(VOICE_LINES.wrong);
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
    router.push("/menu");
  }

  function renderSlot(i: number) {
    const filled = slots[i];
    const Icon = filled ? PIECE_ICONS[filled] : null;
    const isGlowing = glowSlot === i;
    const isFlowLit = flowing && filled !== null;
    const isShaking = shakeSlot === i;
    return (
      <motion.button
        key={i}
        onClick={() => placePiece(i)}
        animate={
          isShaking
            ? { x: [0, -8, 8, -8, 8, 0] }
            : isGlowing || isFlowLit
              ? { scale: [1, 1.15, 1] }
              : { x: 0, scale: 1 }
        }
        transition={isFlowLit ? { delay: i * 0.05, duration: 0.4 } : undefined}
        className={`flex h-[min(5.5rem,9.2svh)] w-[min(5.5rem,9.2svh)] shrink-0 flex-col items-center justify-center gap-1 rounded-2xl border-2 text-[9px] font-bold cursor-pointer sm:text-[11px] lg:gap-1.5 lg:text-sm ${
          filled
            ? `bg-linear-to-b from-nog-green-500 via-nog-green-700 to-nog-green-900 text-white ${
                isGlowing || isFlowLit
                  ? "border-nog-green-400 shadow-[0_0_0_5px_rgba(20,173,99,0.35),0_0_26px_rgba(52,240,140,0.85),inset_0_1px_0_rgba(255,255,255,0.35)]"
                  : "border-nog-green-500/60 shadow-[0_5px_10px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.35)]"
              }`
            : isShaking
              ? "border-red-500 bg-red-500/25 text-red-200 shadow-[0_0_22px_rgba(239,68,68,0.65),inset_0_3px_9px_rgba(0,0,0,0.5)]"
              : "border-[#4a524e] bg-black/45 text-white/40 shadow-[inset_0_3px_9px_rgba(0,0,0,0.75),inset_0_-1px_0_rgba(255,255,255,0.07)] hover:border-nog-green-500/80 hover:text-nog-green-400"
        }`}
      >
        {Icon ? (
          <Icon className="size-4.5 sm:size-6 lg:size-7" />
        ) : (
          <span className="text-base sm:text-lg lg:text-xl">?</span>
        )}
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
    <main
      className={`relative bg-white px-4 lg:px-6 ${
        phase === "playing"
          ? "flex h-[calc(100svh-4rem)] flex-col overflow-hidden py-2"
          : "py-3 lg:py-4"
      }`}
    >
      <AnimatedNOGBackground />
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
        <div className="relative mx-auto w-[92vw] max-w-2xl py-4">
          <VideoBackdrop src="/videos/oil-gas-loop.mp4" opacityClassName="opacity-10" />
          <PlayerSetup onStart={startGame} fixedCount={2} />
        </div>
      )}

      {phase === "playing" && (
        <div className="mx-auto flex min-h-0 w-full max-w-400 flex-1 flex-col gap-2 lg:gap-2.5">
          <div className="flex items-center gap-4 lg:gap-6">
            <span className="shrink-0 rounded-full bg-nog-gold-500/20 px-5 py-1.5 text-lg font-black text-nog-gold-700 lg:px-7 lg:text-xl">
              {players[playerIndex]}&apos;s Turn
            </span>
            <Timer
              key={turnKey}
              compact
              duration={settings.pipelineTimePerPlayer}
              isRunning={turnActive}
              onExpire={() => finishTurn({ ...breakdown, completionBonus: 0, timeBonus: 0, completed: false }, "Time's up!")}
              onTick={setTimeLeft}
              warningThreshold={settings.pipelineWarningThreshold}
            />
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-3 lg:flex-row lg:items-stretch lg:gap-4 xl:gap-6">
            <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center gap-1 overflow-hidden rounded-3xl border-2 border-[#454d49] bg-linear-to-br from-[#333a37] via-[#232927] to-[#161a18] p-3 shadow-[0_25px_50px_-12px_rgba(10,10,10,0.55),inset_0_1px_0_rgba(255,255,255,0.09)] sm:gap-1.5 lg:p-4">
              {/* brushed-metal texture */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(115deg, rgba(255,255,255,0.55) 0px, transparent 1px, transparent 3px)",
                }}
              />
              {/* corner screws */}
              {["top-3 left-3", "top-3 right-3", "bottom-3 left-3", "bottom-3 right-3"].map((pos) => (
                <span
                  key={pos}
                  aria-hidden
                  className={`absolute ${pos} h-3 w-3 rounded-full bg-linear-to-br from-[#9aa39e] to-[#3a403d] shadow-[inset_0_1px_2px_rgba(255,255,255,0.5),0_1px_2px_rgba(0,0,0,0.6)]`}
                />
              ))}
              <BurstEffect active={restoredBurst} color="gold" label="Pipeline Restored!" />
              <div className="flex items-center justify-center gap-1 sm:gap-2 lg:gap-2">
                <PipelineNode icon={Fuel} label="Oil Well" />
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-1 sm:gap-2 lg:gap-2">
                    <ArrowRight className="text-nog-gold-500/60 lg:size-5" size={14} />
                    {renderSlot(i)}
                  </div>
                ))}
              </div>

              <div className="flex w-full justify-end pr-4 sm:pr-8">
                <ArrowDown className="text-nog-gold-500/60 lg:size-5" size={18} />
              </div>

              <div className="flex flex-row-reverse items-center justify-center gap-1 sm:gap-2 lg:gap-2">
                {[4, 5, 6, 7].map((i) => (
                  <div key={i} className="flex flex-row-reverse items-center gap-1 sm:gap-2 lg:gap-2">
                    <ArrowRight className="rotate-180 text-nog-gold-500/60 lg:size-5" size={14} />
                    {renderSlot(i)}
                  </div>
                ))}
              </div>

              <div className="flex w-full justify-start pl-4 sm:pl-8">
                <ArrowDown className="text-nog-gold-500/60 lg:size-5" size={18} />
              </div>

              <div className="flex items-center justify-center gap-1 sm:gap-2 lg:gap-2">
                {[8, 9, 10, 11].map((i) => (
                  <div key={i} className="flex items-center gap-1 sm:gap-2 lg:gap-2">
                    {i !== 8 && <ArrowRight className="text-nog-gold-500/60 lg:size-5" size={14} />}
                    {renderSlot(i)}
                  </div>
                ))}
              </div>

              <div className="flex w-full justify-end pr-4 sm:pr-8">
                <ArrowDown className="text-nog-gold-500/60 lg:size-5" size={18} />
              </div>

              <div className="flex flex-row-reverse items-center justify-center gap-1 sm:gap-2 lg:gap-2">
                <PipelineNode icon={Factory} label="Processing Facility" />
                {[12, 13, 14].map((i) => (
                  <div key={i} className="flex flex-row-reverse items-center gap-1 sm:gap-2 lg:gap-2">
                    <ArrowRight className="rotate-180 text-nog-gold-500/60 lg:size-5" size={14} />
                    {renderSlot(i)}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex min-h-0 flex-col gap-2.5 lg:w-76 lg:shrink-0 xl:w-88 2xl:w-100">
              <div className="flex min-h-0 flex-1 flex-col rounded-3xl border-2 border-nog-black/10 bg-white p-3 shadow-md xl:p-4">
                <p className="mb-2 text-center text-xs font-bold uppercase tracking-wide text-nog-black/50 xl:text-sm">
                  Tap a piece, then tap the slot to place it
                </p>
                <div className="nog-scrollbar grid min-h-0 grid-cols-3 content-start gap-2 overflow-y-auto sm:grid-cols-4 lg:grid-cols-3">
                  {tray.map((tile) => {
                    const Icon = PIECE_ICONS[tile.type];
                    const isSelected = selectedTile === tile.id;
                    return (
                      <button
                        key={tile.id}
                        onClick={() => setSelectedTile(isSelected ? null : tile.id)}
                        className={`flex min-h-16 flex-col items-center justify-center gap-1 rounded-2xl border-2 px-2 py-2 text-xs font-bold cursor-pointer transition-all xl:min-h-18 xl:text-sm ${
                          isSelected
                            ? "border-nog-gold-500 bg-linear-to-b from-nog-gold-400/35 to-nog-gold-500/20 text-nog-gold-700 ring-4 ring-nog-gold-500/30 shadow-[0_4px_10px_rgba(224,184,60,0.35)]"
                            : "border-[#c3cbc7] bg-linear-to-b from-white via-[#eef1ef] to-[#d3d9d6] text-nog-black/75 shadow-[0_3px_6px_rgba(10,10,10,0.18),inset_0_1px_0_rgba(255,255,255,0.9)] hover:-translate-y-0.5 hover:border-nog-green-600"
                        }`}
                      >
                        <Icon className="size-5 xl:size-6" />
                        {PIPELINE_PIECE_LABELS[tile.type]}
                      </button>
                    );
                  })}
                  {tray.length === 0 && (
                    <p className="col-span-full text-lg font-semibold text-nog-black/40">All pieces placed!</p>
                  )}
                </div>
              </div>

              <Scoreboard players={results} title="Live Scores" compact />
            </div>
          </div>
        </div>
      )}

      {phase === "turn-end" && (
        <div className="relative mx-auto flex w-[92vw] max-w-2xl flex-col items-center gap-6 py-4 text-center">
          {celebrating && <ConfettiCelebration active durationMs={3000} />}
          <p className="text-4xl font-black text-nog-black lg:text-5xl">{endMessage}</p>

          <div className="w-full rounded-3xl border-2 border-nog-black/10 bg-white p-7 text-left shadow-sm lg:p-9">
            <h3 className="mb-4 text-center text-xl font-black uppercase tracking-wide text-nog-black/60 lg:text-2xl">
              Score Breakdown
            </h3>
            <div className="flex flex-col gap-3 text-lg font-semibold text-nog-black/70 lg:text-xl">
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
              <div className="mt-2 flex justify-between border-t-2 border-nog-black/10 pt-3 text-2xl lg:text-3xl">
                <span className="font-black text-nog-black">Turn Total</span>
                <span className="font-black text-nog-black">{totalTurnScore}</span>
              </div>
            </div>
          </div>

          <Scoreboard players={results} title="Scores So Far" />
          <button
            onClick={nextPlayerOrResults}
            className="btn-shine cta-pulse rounded-2xl bg-nog-green-700 px-12 py-5 text-2xl font-black text-white hover:bg-nog-green-800 cursor-pointer"
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
    <div className="flex shrink-0 flex-col items-center gap-1 lg:gap-1.5">
      <div className="flex h-[min(5.5rem,9.2svh)] w-[min(5.5rem,9.2svh)] items-center justify-center rounded-2xl border border-nog-green-500/40 bg-linear-to-b from-nog-green-600 via-nog-green-800 to-nog-green-950 text-nog-gold-400 shadow-[0_5px_0_#04241a,0_9px_16px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.3)]">
        <Icon className="size-5.5 drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)] sm:size-7.5 lg:size-8" />
      </div>
      <span className="max-w-20 text-center text-[10px] font-bold text-white/75 sm:text-xs lg:max-w-24 lg:text-sm">
        {label}
      </span>
    </div>
  );
}
