"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Check, Gauge, X as XIcon } from "lucide-react";
import GameTopBar from "@/components/GameTopBar";
import PlayerSetup from "@/components/PlayerSetup";
import Timer from "@/components/Timer";
import Scoreboard from "@/components/Scoreboard";
import WinnerScreen from "@/components/WinnerScreen";
import GameIntro3D from "@/components/GameIntro3D";
import AnimatedNOGBackground from "@/components/AnimatedNOGBackground";
import VideoBackdrop from "@/components/VideoBackdrop";
import { useScenarios, useSettings } from "@/lib/store";
import { shuffleArray } from "@/lib/shuffle";
import { playSound } from "@/lib/sound";
import { speak, VOICE_LINES } from "@/lib/speech";
import type { Scenario, ScenarioBank } from "@/data/scenarios";
import type { PlayerResult } from "@/lib/scoring";

type Phase = "intro" | "setup" | "playing" | "turn-end" | "results";

const BANK_FOR_PLAYER: ScenarioBank[] = ["player1", "player2"];

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

  function setupTurn(forPlayerIndex: number) {
    const bank = BANK_FOR_PLAYER[forPlayerIndex];
    const enabled = allScenarios.filter((s) => s.enabled && s.bank === bank);
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
    setupTurn(0);
    speak(VOICE_LINES.gameStart);
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
    const speedBonus = Math.max(1, 5 - Math.floor(reaction));
    const points = isCorrect ? 10 + speedBonus : -5;

    setResults((prev) =>
      prev.map((p, i) =>
        i === playerIndex
          ? { ...p, total: p.total + 1, correct: p.correct + (isCorrect ? 1 : 0), score: p.score + points }
          : p
      )
    );

    if (isCorrect) {
      playSound("correct");
      speak(VOICE_LINES.correct);
      setFeedback({ correct: true, text: `Correct! +${points} pts (includes +${speedBonus} speed bonus)` });
    } else {
      playSound("wrong");
      speak(VOICE_LINES.wrong);
      setFeedback({ correct: false, text: `${points} pts — Best response: ${currentScenario.correctResponse}` });
    }
    setTimeout(advanceScenario, 1800);
  }

  function nextPlayerOrResults() {
    if (playerIndex === 0) {
      setPlayerIndex(1);
      setPhase("playing");
      setupTurn(1);
    } else {
      setPhase("results");
    }
  }

  function exitToMenu() {
    router.push("/");
  }

  const currentResult = results[playerIndex];
  const accuracy = currentResult && currentResult.total > 0 ? Math.round((currentResult.correct / currentResult.total) * 100) : 0;

  return (
    <main className="relative min-h-screen bg-white px-6 py-8">
      <AnimatedNOGBackground />
      {phase === "intro" && (
        <GameIntro3D
          title="Pressure Point"
          icon={Gauge}
          objective="Make the right emergency call, fast. Each player answers their own set of scenarios against the clock."
          players="2 Players (separate question sets)"
          timer={`${settings.pressureTimePerPlayer}s total per player`}
          howToPlay={[
            "Read the emergency scenario and pick the best first response.",
            "Answer as many scenarios as you can before your timer runs out.",
            "Player 1 and Player 2 get different but equally balanced question sets.",
            "Wrong answers reveal the correct response before moving on.",
          ]}
          scoring={[
            "Correct answer: +10 points.",
            "Speed bonus: +1 to +5 based on how fast you answer.",
            "Wrong answer: -5 points, with an explanation shown.",
            "End screen shows score, attempts, correct count, accuracy and the winner.",
          ]}
          onContinue={() => setPhase("setup")}
        />
      )}

      {phase !== "intro" && <GameTopBar title="Pressure Point" />}

      {phase === "setup" && (
        <div className="relative mx-auto max-w-xl">
          <VideoBackdrop src="/videos/oil-gas-loop.mp4" opacityClassName="opacity-10" />
          <PlayerSetup onStart={startGame} fixedCount={2} />
        </div>
      )}

      {phase === "playing" && currentScenario && (
        <div className="relative mx-auto flex w-[95vw] max-w-300 flex-col gap-6">
          <VideoBackdrop src="/videos/oil-gas-loop.mp4" opacityClassName="opacity-10" />
          <span className="mx-auto rounded-full bg-nog-gold-500/20 px-5 py-2 text-lg font-black text-nog-gold-700 lg:px-6 lg:py-3 lg:text-xl">
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

          <AnimatePresence mode="wait">
            <motion.div
              key={currentScenario.id}
              initial={{ opacity: 0, scale: 0.9, y: -12 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                boxShadow: [
                  "0 0 0 0 rgba(239,68,68,0.25)",
                  "0 0 0 8px rgba(239,68,68,0)",
                ],
              }}
              transition={{
                scale: { type: "spring", stiffness: 300, damping: 20 },
                boxShadow: { duration: 1.6, repeat: Infinity },
              }}
              className="flex items-start gap-4 rounded-3xl border-2 border-red-500/30 bg-red-500/5 p-8 lg:p-10"
            >
              <AlertTriangle className="mt-1 shrink-0 text-red-600 lg:size-10" size={32} />
              <p className="text-2xl font-black leading-snug text-nog-black lg:text-3xl xl:text-4xl">
                {currentScenario.prompt}
              </p>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {feedback ? (
              <motion.div
                key="feedback"
                initial={{ opacity: 0, y: -8, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: [1.05, 1] }}
                exit={{ opacity: 0 }}
                className={`flex items-center gap-3 rounded-2xl px-6 py-4 text-lg font-bold lg:px-8 lg:py-5 lg:text-xl ${
                  feedback.correct
                    ? "bg-nog-green-600/10 text-nog-green-800 shadow-[0_0_0_4px_rgba(15,148,85,0.15)]"
                    : "bg-red-500/10 text-red-700 shadow-[0_0_0_4px_rgba(239,68,68,0.15)]"
                }`}
              >
                {feedback.correct ? <Check size={24} className="lg:size-8" /> : <XIcon size={24} className="lg:size-8" />}
                {feedback.text}
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6">
                {options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => chooseOption(opt)}
                    disabled={locked}
                    className="rounded-2xl border-2 border-nog-black/15 bg-white px-6 py-5 text-left text-lg font-bold text-nog-black hover:border-nog-green-600 disabled:cursor-default cursor-pointer transition-colors lg:px-8 lg:py-7 lg:text-2xl"
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

      {phase === "turn-end" && currentResult && (
        <div className="mx-auto flex max-w-lg flex-col items-center gap-6 text-center">
          <p className="text-3xl font-black text-nog-black">{endMessage}</p>

          <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-4">
            <StatPill label="Score" value={`${currentResult.score}`} />
            <StatPill label="Attempted" value={`${currentResult.total}`} />
            <StatPill label="Correct" value={`${currentResult.correct}`} />
            <StatPill label="Accuracy" value={`${accuracy}%`} />
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

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-nog-black/5 px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-wide text-nog-black/40">{label}</p>
      <p className="mt-1 text-2xl font-black text-nog-black">{value}</p>
    </div>
  );
}
