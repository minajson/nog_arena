"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import GameTopBar from "@/components/GameTopBar";
import PlayerSetup from "@/components/PlayerSetup";
import Timer from "@/components/Timer";
import Scoreboard from "@/components/Scoreboard";
import WinnerScreen from "@/components/WinnerScreen";
import VideoIntro from "@/components/VideoIntro";
import HazardScene from "@/components/HazardScene";
import { useHazards, useSettings } from "@/lib/store";
import { shuffleArray } from "@/lib/shuffle";
import { playSound } from "@/lib/sound";
import type { Hazard } from "@/data/hazards";
import type { PlayerResult } from "@/lib/scoring";

const CORRECT_POINTS = 10;
const WRONG_POINTS = -5;
const COMPLETION_BONUS = 25;

type Phase = "intro" | "setup" | "playing" | "turn-end" | "results";

export default function HazardHuntPage() {
  const router = useRouter();
  const allHazards = useHazards();
  const settings = useSettings();
  const [phase, setPhase] = useState<Phase>("intro");
  const [players, setPlayers] = useState<string[]>(["", ""]);
  const [results, setResults] = useState<PlayerResult[]>([]);
  const [playerIndex, setPlayerIndex] = useState(0);
  const [activeHazards, setActiveHazards] = useState<Hazard[]>([]);
  const [found, setFound] = useState<Set<string>>(new Set());
  const [missed, setMissed] = useState<Set<string>>(new Set());
  const [turnActive, setTurnActive] = useState(false);
  const [turnKey, setTurnKey] = useState(0);
  const [endMessage, setEndMessage] = useState("");
  const [banner, setBanner] = useState<string | null>(null);

  function pickHazardSet() {
    const enabled = allHazards.filter((h) => h.enabled);
    const count = Math.min(settings.hazardNumberOfHazards, enabled.length) || enabled.length;
    return shuffleArray(enabled).slice(0, Math.max(count, 1));
  }

  function setupTurn(set: Hazard[]) {
    setFound(new Set());
    setMissed(new Set());
    setTurnActive(true);
    setTurnKey((k) => k + 1);
    setEndMessage("");
    setBanner(null);
    setActiveHazards(set);
  }

  function startGame(names: string[]) {
    const set = pickHazardSet();
    setPlayers(names);
    setResults(names.map((name) => ({ name, score: 0, correct: 0, total: 0 })));
    setPlayerIndex(0);
    setPhase("playing");
    setupTurn(set);
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

  function finishTurn(bonus: number, message: string, finalFound: Set<string>) {
    if (bonus !== 0) {
      setResults((prev) => prev.map((p, i) => (i === playerIndex ? { ...p, score: p.score + bonus } : p)));
    }
    setMissed(new Set(activeHazards.filter((h) => !finalFound.has(h.id)).map((h) => h.id)));
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

    if (nextFound.size === activeHazards.length) {
      playSound("celebration");
      finishTurn(COMPLETION_BONUS, `All hazards found! Bonus +${COMPLETION_BONUS}`, nextFound);
    }
  }

  function handleBackgroundClick() {
    if (!turnActive) return;
    playSound("wrong");
    addScore(WRONG_POINTS, false);
    setBanner("Not a hazard — look again!");
  }

  function nextPlayerOrResults() {
    if (playerIndex === 0) {
      setPlayerIndex(1);
      setPhase("playing");
      setupTurn(activeHazards);
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
          <VideoIntro key="intro" src="/videos/game-intro.mp4" label="Hazard Hunt Intro" onEnd={() => setPhase("setup")} />
        )}
      </AnimatePresence>

      {phase !== "intro" && <GameTopBar title="Hazard Hunt" />}

      {phase === "setup" && (
        <div className="mx-auto max-w-lg">
          <PlayerSetup onStart={startGame} fixedCount={2} />
        </div>
      )}

      {phase === "playing" && (
        <div className="mx-auto flex max-w-4xl flex-col gap-6">
          <span className="mx-auto rounded-full bg-nog-gold-500/20 px-5 py-2 text-lg font-black text-nog-gold-700">
            {players[playerIndex]}&apos;s Turn — Found {found.size}/{activeHazards.length}
          </span>

          <Timer
            key={turnKey}
            duration={settings.hazardTimePerPlayer}
            isRunning={turnActive}
            onExpire={() => finishTurn(0, "Time's up!", found)}
            warningThreshold={settings.hazardWarningThreshold}
          />

          <HazardScene
            hazards={activeHazards}
            found={found}
            missed={missed}
            onHazardClick={handleHazardClick}
            onBackgroundClick={handleBackgroundClick}
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
            {players[playerIndex]} found {found.size} of {activeHazards.length} hazards.
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
