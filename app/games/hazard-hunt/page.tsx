"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Lightbulb, Search } from "lucide-react";
import GameTopBar from "@/components/GameTopBar";
import PlayerSetup from "@/components/PlayerSetup";
import Timer from "@/components/Timer";
import Scoreboard from "@/components/Scoreboard";
import WinnerScreen from "@/components/WinnerScreen";
import GameIntro3D from "@/components/GameIntro3D";
import HazardScene from "@/components/HazardScene";
import { useHazards, useSettings } from "@/lib/store";
import { shuffleArray } from "@/lib/shuffle";
import { playSound } from "@/lib/sound";
import { decoySpots, DIFFICULTY_SETTINGS, type Hazard, type DecoySpot, type HazardDifficulty } from "@/data/hazards";
import type { PlayerResult } from "@/lib/scoring";

const CORRECT_POINTS = 10;
const WRONG_POINTS = -5;
const HINT_COST = 5;
const COMPLETION_BONUS = 25;

type Phase = "intro" | "setup" | "playing" | "turn-end" | "results";

const DIFFICULTY_LABELS: Record<HazardDifficulty, string> = { easy: "Easy", medium: "Medium", hard: "Hard" };

export default function HazardHuntPage() {
  const router = useRouter();
  const allHazards = useHazards();
  const settings = useSettings();
  const [phase, setPhase] = useState<Phase>("intro");
  const [difficulty, setDifficulty] = useState<HazardDifficulty>("easy");
  const [players, setPlayers] = useState<string[]>(["", ""]);
  const [results, setResults] = useState<PlayerResult[]>([]);
  const [playerIndex, setPlayerIndex] = useState(0);
  const [activeHazards, setActiveHazards] = useState<Hazard[]>([]);
  const [activeDecoys, setActiveDecoys] = useState<DecoySpot[]>([]);
  const [found, setFound] = useState<Set<string>>(new Set());
  const [turnActive, setTurnActive] = useState(false);
  const [turnKey, setTurnKey] = useState(0);
  const [endMessage, setEndMessage] = useState("");
  const [banner, setBanner] = useState<string | null>(null);
  const [hintHazardId, setHintHazardId] = useState<string | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);

  function pickHazardSet() {
    const config = DIFFICULTY_SETTINGS[difficulty];
    const enabled = allHazards.filter((h) => h.enabled);
    const count = Math.min(config.hazardCount, enabled.length);
    const hazards = shuffleArray(enabled).slice(0, count);
    const decoys = shuffleArray(decoySpots).slice(0, config.decoyCount);
    return { hazards, decoys };
  }

  function setupTurn(hazards: Hazard[], decoys: DecoySpot[]) {
    setFound(new Set());
    setTurnActive(true);
    setTurnKey((k) => k + 1);
    setEndMessage("");
    setBanner(null);
    setHintHazardId(null);
    setHintsUsed(0);
    setActiveHazards(hazards);
    setActiveDecoys(decoys);
  }

  function startGame(names: string[]) {
    const { hazards, decoys } = pickHazardSet();
    setPlayers(names);
    setResults(names.map((name) => ({ name, score: 0, correct: 0, total: 0 })));
    setPlayerIndex(0);
    setPhase("playing");
    setupTurn(hazards, decoys);
  }

  function addScore(delta: number, wasCorrect: boolean, countAttempt = true) {
    setResults((prev) =>
      prev.map((p, i) =>
        i === playerIndex
          ? {
              ...p,
              score: p.score + delta,
              correct: p.correct + (wasCorrect ? 1 : 0),
              total: p.total + (countAttempt ? 1 : 0),
            }
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

  function handleHazardClick(id: string) {
    if (!turnActive || found.has(id)) return;
    const hazard = activeHazards.find((h) => h.id === id);
    if (!hazard) return;
    playSound("correct");
    const nextFound = new Set(found).add(id);
    setFound(nextFound);
    addScore(CORRECT_POINTS, true);
    setBanner(hazard.explanation);
    if (hintHazardId === id) setHintHazardId(null);

    if (nextFound.size === activeHazards.length) {
      playSound("celebration");
      finishTurn(COMPLETION_BONUS, `All hazards found! Bonus +${COMPLETION_BONUS}`);
    }
  }

  function handleWrongClick() {
    if (!turnActive) return;
    playSound("wrong");
    addScore(WRONG_POINTS, false);
    setBanner("Not a hazard — look again!");
  }

  function useHint() {
    if (!turnActive || hintHazardId) return;
    const remaining = activeHazards.filter((h) => !found.has(h.id));
    if (remaining.length === 0) return;
    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    playSound("hint");
    addScore(-HINT_COST, false, false);
    setHintsUsed((n) => n + 1);
    setHintHazardId(pick.id);
    setBanner(`Hint used (-${HINT_COST} pts) — look closely near the glowing spot.`);
    setTimeout(() => setHintHazardId((cur) => (cur === pick.id ? null : cur)), 3000);
  }

  function nextPlayerOrResults() {
    if (playerIndex === 0) {
      const { hazards, decoys } = pickHazardSet();
      setPlayerIndex(1);
      setPhase("playing");
      setupTurn(hazards, decoys);
    } else {
      setPhase("results");
    }
  }

  function exitToMenu() {
    router.push("/");
  }

  return (
    <main className="relative min-h-screen bg-white px-6 py-8">
      {phase === "intro" && (
        <GameIntro3D
          title="Hazard Hunt"
          icon={Search}
          objective="Scan the worksite scene and click every hidden safety hazard before time runs out."
          players="2 Players (turns)"
          timer={`${settings.hazardTimePerPlayer}s per player`}
          howToPlay={[
            "Hazards are hidden in the scene — hover or tap to find them, they won't be obvious.",
            "Watch out for decoy spots that look risky but are actually safe.",
            "Choose a difficulty: Easy (10 hazards), Medium (12, some decoys), Hard (15, subtle hazards + more decoys).",
            "Stuck? Use a hint for a small point cost.",
          ]}
          scoring={[
            `Correct hazard: +${CORRECT_POINTS} points.`,
            `Wrong or decoy click: ${WRONG_POINTS} points.`,
            `Hint used: -${HINT_COST} points.`,
            `Find every hazard for a +${COMPLETION_BONUS} bonus.`,
          ]}
          onContinue={() => setPhase("setup")}
        />
      )}

      {phase !== "intro" && <GameTopBar title="Hazard Hunt" />}

      {phase === "setup" && (
        <div className="mx-auto flex max-w-lg flex-col gap-6">
          <div className="rounded-3xl border-2 border-nog-black/10 p-6 shadow-sm">
            <h3 className="mb-4 text-center text-lg font-black text-nog-black">Choose Difficulty</h3>
            <div className="grid grid-cols-3 gap-3">
              {(Object.keys(DIFFICULTY_SETTINGS) as HazardDifficulty[]).map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`rounded-2xl border-2 px-3 py-4 text-center font-black cursor-pointer transition-colors ${
                    difficulty === level
                      ? "border-nog-green-600 bg-nog-green-600/10 text-nog-green-800"
                      : "border-nog-black/15 text-nog-black/60 hover:border-nog-green-500"
                  }`}
                >
                  <span className="block text-base">{DIFFICULTY_LABELS[level]}</span>
                  <span className="mt-1 block text-xs font-semibold text-nog-black/40">
                    {DIFFICULTY_SETTINGS[level].hazardCount} hazards
                  </span>
                </button>
              ))}
            </div>
          </div>
          <PlayerSetup onStart={startGame} fixedCount={2} />
        </div>
      )}

      {phase === "playing" && (
        <div className="mx-auto flex max-w-4xl flex-col gap-6">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="rounded-full bg-nog-gold-500/20 px-5 py-2 text-lg font-black text-nog-gold-700">
              {players[playerIndex]}&apos;s Turn — Found {found.size}/{activeHazards.length}
            </span>
            <button
              onClick={useHint}
              disabled={!!hintHazardId}
              className="flex items-center gap-2 rounded-full border-2 border-nog-gold-500 px-4 py-2 text-sm font-black text-nog-gold-700 hover:bg-nog-gold-500/10 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Lightbulb size={16} /> Hint (-{HINT_COST})
            </button>
          </div>

          <Timer
            key={turnKey}
            duration={settings.hazardTimePerPlayer}
            isRunning={turnActive}
            onExpire={() => finishTurn(0, "Time's up!")}
            warningThreshold={settings.hazardWarningThreshold}
          />

          <HazardScene
            hazards={activeHazards}
            decoys={activeDecoys}
            found={found}
            hintHazardId={hintHazardId}
            mildClues={DIFFICULTY_SETTINGS[difficulty].mildClues}
            onHazardClick={handleHazardClick}
            onDecoyClick={handleWrongClick}
            onBackgroundMiss={handleWrongClick}
          />

          <AnimatePresence mode="wait">
            {banner && (
              <motion.p
                key={banner}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl bg-nog-black/5 px-6 py-3 text-center text-lg font-bold text-nog-black/70"
              >
                {banner}
              </motion.p>
            )}
          </AnimatePresence>

          <Scoreboard players={results} title="Live Scores" />
        </div>
      )}

      {phase === "turn-end" && (
        <div className="mx-auto flex max-w-lg flex-col items-center gap-6 text-center">
          <p className="text-3xl font-black text-nog-black">{endMessage}</p>
          <p className="text-lg font-semibold text-nog-black/60">
            {players[playerIndex]} found {found.size} of {activeHazards.length} hazards
            {hintsUsed > 0 ? ` using ${hintsUsed} hint${hintsUsed === 1 ? "" : "s"}` : ""}.
          </p>
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
          game="Hazard Hunt"
          players={results}
          subtitle="Great eye for safety hazards."
          onPlayAgain={() => setPhase("setup")}
          onExitMenu={exitToMenu}
        />
      )}
    </main>
  );
}
