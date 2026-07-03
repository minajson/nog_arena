"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Check, X as XIcon } from "lucide-react";
import GameTopBar from "@/components/GameTopBar";
import PlayerSetup from "@/components/PlayerSetup";
import Timer from "@/components/Timer";
import Scoreboard from "@/components/Scoreboard";
import WinnerScreen from "@/components/WinnerScreen";
import VideoIntro from "@/components/VideoIntro";
import { useScenarios, useSettings } from "@/lib/store";
import { shuffleArray } from "@/lib/shuffle";
import { playSound } from "@/lib/sound";
import type { Scenario } from "@/data/scenarios";
import type { PlayerResult } from "@/lib/scoring";

type Phase = "intro" | "setup" | "playing" | "turn-end" | "results";

function buildOptions(scenario: Scenario): string[] {
  return shuffleArray([scenario.correctResponse, ...scenario.wrongOptions]);
}

export default function PressurePointPage() {
  const router = useRouter();
  const allScenarios = useScenarios();
  const settings = useSettings();
  const [phase, setPhase] = useState<Phase>("intro");
  const [players, setPlayers] = useState<string[]>(["", ""]);
  const [results, setResults] = useState<PlayerResult[]>([]);
  const [playerIndex, setPlayerIndex] = useState(0);
  const [queue, setQueue] = useState<Scenario[]>([]);
  const [scenarioPos, setScenarioPos] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [turnActive, setTurnActive] = useState(false);
  const [turnKey, setTurnKey] = useState(0);
  const [feedback, setFeedback] = useState<{ correct: boolean; text: string } | null>(null);
  const [locked, setLocked] = useState(false);
  const [endMessage, setEndMessage] = useState("");
  const timeLeftRef = useRef(settings.pressureTimePerPlayer);
  const scenarioStartRef = useRef(settings.pressureTimePerPlayer);

  function setupTurn() {
    const enabled = allScenarios.filter((s) => s.enabled);
    const count = Math.min(settings.pressureNumberOfScenarios, enabled.length) || enabled.length;
    const picked = shuffleArray(enabled).slice(0, Math.max(count, 1));
    setQueue(picked);
    setScenarioPos(0);
    setOptions(picked.length ? buildOptions(picked[0]) : []);
    setFeedback(null);
    setLocked(false);
    setTurnActive(true);
    setTurnKey((k) => k + 1);
    timeLeftRef.current = settings.pressureTimePerPlayer;
    scenarioStartRef.current = settings.pressureTimePerPlayer;
    setEndMessage("");
  }

  function startGame(names: string[]) {
    setPlayers(names);
    setResults(names.map((name) => ({ name, score: 0, correct: 0, total: 0 })));
    setPlayerIndex(0);
    setPhase("playing");
    setupTurn();
  }

  const currentScenario = queue[scenarioPos];

  function finishTurn(message: string) {
    setTurnActive(false);
    setEndMessage(message);
    setPhase("turn-end");
  }

  function advanceScenario() {
    const nextPos = scenarioPos + 1;
    if (nextPos >= queue.length) {
      finishTurn("Scenarios complete!");
      return;
    }
    setScenarioPos(nextPos);
    setOptions(buildOptions(queue[nextPos]));
    setFeedback(null);
    setLocked(false);
    scenarioStartRef.current = timeLeftRef.current;
  }

  function chooseOption(option: string) {
    if (!turnActive || locked || !currentScenario) return;
    setLocked(true);
    const isCorrect = option === currentScenario.correctResponse;
    const reaction = Math.max(0, scenarioStartRef.current - timeLeftRef.current);
    const points = isCorrect ? Math.max(5, 20 - reaction * 2) : 0;

    setResults((prev) =>
      prev.map((p, i) =>
        i === playerIndex
          ? { ...p, total: p.total + 1, correct: p.correct + (isCorrect ? 1 : 0), score: p.score + points }
          : p
      )
    );

    if (isCorrect) {
      playSound("correct");
      setFeedback({ correct: true, text: `Correct! +${points} pts` });
    } else {
      playSound("wrong");
      setFeedback({ correct: false, text: `Best response: ${currentScenario.correctResponse}` });
    }
    setTimeout(advanceScenario, 1800);
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
          <VideoIntro key="intro" src="/videos/game-intro.mp4" label="Pressure Point Intro" onEnd={() => setPhase("setup")} />
        )}
      </AnimatePresence>

      {phase !== "intro" && <GameTopBar title="Pressure Point" />}

      {phase === "setup" && (
        <div className="mx-auto max-w-lg">
          <PlayerSetup onStart={startGame} fixedCount={2} />
        </div>
      )}

      {phase === "playing" && currentScenario && (
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          <span className="mx-auto rounded-full bg-nog-gold-500/20 px-5 py-2 text-lg font-black text-nog-gold-700">
            {players[playerIndex]}&apos;s Turn — Scenario {scenarioPos + 1} of {queue.length}
          </span>

          <Timer
            key={turnKey}
            duration={settings.pressureTimePerPlayer}
            isRunning={turnActive}
            onExpire={() => finishTurn("Time's up!")}
            onTick={(t) => (timeLeftRef.current = t)}
            warningThreshold={settings.pressureWarningThreshold}
          />

          <div className="flex items-start gap-4 rounded-3xl border-2 border-red-500/30 bg-red-500/5 p-8 shadow-md">
            <AlertTriangle className="mt-1 shrink-0 text-red-600" size={32} />
            <p className="text-2xl font-black leading-snug text-nog-black">{currentScenario.prompt}</p>
          </div>

          <AnimatePresence mode="wait">
            {feedback ? (
              <motion.div
                key="feedback"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex items-center gap-3 rounded-2xl px-6 py-4 text-lg font-bold ${
                  feedback.correct ? "bg-nog-green-600/10 text-nog-green-800" : "bg-red-500/10 text-red-700"
                }`}
              >
                {feedback.correct ? <Check size={24} /> : <XIcon size={24} />}
                {feedback.text}
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => chooseOption(opt)}
                    disabled={locked}
                    className="rounded-2xl border-2 border-nog-black/15 bg-white px-6 py-5 text-left text-lg font-bold text-nog-black hover:border-nog-green-600 disabled:cursor-default cursor-pointer transition-colors"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </AnimatePresence>

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
          game="Pressure Point"
          players={results}
          subtitle="Sharp thinking under pressure."
          onPlayAgain={() => setPhase("setup")}
          onExitMenu={exitToMenu}
        />
      )}
    </main>
  );
}
