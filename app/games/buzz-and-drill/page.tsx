"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X as XIcon, Zap } from "lucide-react";
import Timer from "@/components/Timer";
import Scoreboard from "@/components/Scoreboard";
import PlayerSetup from "@/components/PlayerSetup";
import WinnerScreen from "@/components/WinnerScreen";
import GameIntro3D from "@/components/GameIntro3D";
import GameTopBar from "@/components/GameTopBar";
import AnimatedNOGBackground from "@/components/AnimatedNOGBackground";
import VideoBackdrop from "@/components/VideoBackdrop";
import BurstEffect from "@/components/BurstEffect";
import { useBuzzQuestions, useSettings } from "@/lib/store";
import { shuffleArray } from "@/lib/shuffle";
import { playSound } from "@/lib/sound";
import { speak, VOICE_LINES } from "@/lib/speech";
import type { PlayerResult } from "@/lib/scoring";
import type { BuzzQuestion } from "@/data/buzzQuestions";

type Phase = "intro" | "setup" | "playing" | "results";
type SubPhase = "buzz-select" | "answering" | "reveal";

export default function BuzzAndDrillPage() {
  const router = useRouter();
  const allQuestions = useBuzzQuestions();
  const settings = useSettings();
  const [phase, setPhase] = useState<Phase>("intro");
  const [quiz, setQuiz] = useState<BuzzQuestion[]>([]);
  const [players, setPlayers] = useState<string[]>(["", ""]);
  const [results, setResults] = useState<PlayerResult[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [subPhase, setSubPhase] = useState<SubPhase>("buzz-select");
  const [selected, setSelected] = useState<number | null>(null);
  const [attempted, setAttempted] = useState<Set<number>>(new Set());
  const [chosenOption, setChosenOption] = useState<number | null>(null);
  const [attemptKey, setAttemptKey] = useState(0);
  const [banner, setBanner] = useState<string | null>(null);
  const [burst, setBurst] = useState<{ color: "green" | "red"; key: number } | null>(null);
  const [shakeOption, setShakeOption] = useState<number | null>(null);

  function startGame(names: string[]) {
    const enabled = allQuestions.filter((q) => q.enabled);
    const count = Math.min(settings.buzzNumberOfQuestions, enabled.length);
    setQuiz(shuffleArray(enabled).slice(0, count));
    setPlayers(names);
    setResults(names.map((name) => ({ name, score: 0, correct: 0, total: 0 })));
    setQuestionIndex(0);
    setSubPhase("buzz-select");
    setSelected(null);
    setAttempted(new Set());
    setChosenOption(null);
    setBanner(null);
    setPhase("playing");
    speak(VOICE_LINES.gameStart);
  }

  const currentQuestion = quiz[questionIndex];
  const duration = settings.buzzTimePerQuestion;

  useEffect(() => {
    if (!burst) return;
    const id = setTimeout(() => setBurst(null), 700);
    return () => clearTimeout(id);
  }, [burst]);

  function pickBuzzer(playerIndex: number) {
    setSelected(playerIndex);
    setChosenOption(null);
    setSubPhase("answering");
    setAttemptKey((k) => k + 1);
    setBanner(null);
    playSound("buzz");
  }

  function goNextQuestion() {
    const isLast = questionIndex >= quiz.length - 1;
    if (isLast) {
      setPhase("results");
      return;
    }
    setQuestionIndex((q) => q + 1);
    setSubPhase("buzz-select");
    setSelected(null);
    setAttempted(new Set());
    setChosenOption(null);
    setBanner(null);
  }

  function commitAnswer(optionIndex: number | null) {
    if (subPhase !== "answering" || selected === null || !currentQuestion) return;
    setChosenOption(optionIndex);
    const isCorrect = optionIndex === currentQuestion.correctIndex;
    const playerIdx = selected;

    setResults((prev) =>
      prev.map((p, i) =>
        i === playerIdx
          ? {
              ...p,
              total: p.total + 1,
              correct: p.correct + (isCorrect ? 1 : 0),
              score: p.score + (isCorrect ? settings.buzzPointsPerCorrect : 0),
            }
          : p
      )
    );

    if (isCorrect) {
      playSound("correct");
      speak(VOICE_LINES.correct);
      setBurst({ color: "green", key: Date.now() });
      setBanner(`${players[playerIdx]} got it right! +${settings.buzzPointsPerCorrect}`);
      setSubPhase("reveal");
      setTimeout(goNextQuestion, 1600);
      return;
    }

    playSound("tryAgain");
    speak(VOICE_LINES.wrong);
    setBurst({ color: "red", key: Date.now() });
    if (optionIndex !== null) {
      setShakeOption(optionIndex);
      setTimeout(() => setShakeOption(null), 400);
    }
    const nextAttempted = new Set(attempted).add(playerIdx);
    setAttempted(nextAttempted);
    const otherIdx = playerIdx === 0 ? 1 : 0;

    if (!nextAttempted.has(otherIdx)) {
      setBanner(`Ooopsssyyy, try again! Over to ${players[otherIdx]}...`);
      setSubPhase("reveal");
      setTimeout(() => {
        setSelected(otherIdx);
        setChosenOption(null);
        setSubPhase("answering");
        setAttemptKey((k) => k + 1);
        setBanner(null);
      }, 1400);
    } else {
      setBanner(
        `Ooopsssyyy! The correct answer was: ${currentQuestion.options[currentQuestion.correctIndex]}`
      );
      setSubPhase("reveal");
      setTimeout(goNextQuestion, 2200);
    }
  }

  function exitToMenu() {
    router.push("/menu");
  }

  return (
    <main className="relative bg-white px-4 py-3 lg:px-6 lg:py-4">
      <AnimatedNOGBackground />
      {phase === "intro" && (
        <GameIntro3D
          title="Buzz and Drill"
          icon={Zap}
          objective="Answer fast, outscore your opponent in this head-to-head trivia buzzer round."
          players="2 Players"
          timer={`${settings.buzzTimePerQuestion}s per question`}
          howToPlay={[
            "The facilitator taps whichever player buzzed in first.",
            "Only that player gets to answer the question.",
            "A wrong answer passes the same question to the other player.",
            "If both players miss it, the correct answer is revealed and play moves on.",
          ]}
          scoring={[
            `Each correct answer is worth ${settings.buzzPointsPerCorrect} point${settings.buzzPointsPerCorrect === 1 ? "" : "s"}.`,
            "A wrong answer scores nothing.",
            "Most points after all questions wins.",
          ]}
          onContinue={() => setPhase("setup")}
        />
      )}

      {phase !== "intro" && <GameTopBar title="Buzz and Drill" />}

      {phase === "setup" && (
        <div className="relative mx-auto max-w-xl">
          <VideoBackdrop src="/videos/oil-gas-loop.mp4" opacityClassName="opacity-10" />
          <PlayerSetup onStart={startGame} fixedCount={2} />
        </div>
      )}

      {phase === "playing" && currentQuestion && (
        <div className="relative mx-auto flex w-[95vw] max-w-300 flex-col gap-6">
          <VideoBackdrop src="/videos/oil-gas-loop.mp4" opacityClassName="opacity-10" />
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-nog-black/5 px-4 py-2 text-base font-bold text-nog-black/60 lg:text-lg">
              Question {questionIndex + 1} of {quiz.length}
            </span>
          </div>

          <Timer
            key={attemptKey}
            duration={duration}
            isRunning={subPhase === "answering"}
            onExpire={() => commitAnswer(null)}
            warningThreshold={settings.buzzWarningThreshold}
          />

          <div className="relative">
            <BurstEffect
              active={!!burst}
              color={burst?.color === "red" ? "red" : "green"}
              label={burst?.color === "red" ? "Oops!" : "Correct!"}
            />
            <AnimatePresence mode="wait">
              <motion.div
                key={questionIndex}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="rounded-3xl border-2 border-nog-black/10 bg-white p-8 shadow-md lg:p-12"
              >
                <p className="text-3xl font-black leading-snug text-nog-black lg:text-4xl xl:text-5xl">
                  {currentQuestion.question}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            {banner && (
              <motion.div
                key={banner}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl bg-nog-gold-500/15 px-6 py-4 text-center text-xl font-black text-nog-gold-700"
              >
                {banner}
              </motion.div>
            )}
          </AnimatePresence>

          {subPhase === "buzz-select" && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6">
              {players.map((name, i) => (
                <button
                  key={i}
                  onClick={() => pickBuzzer(i)}
                  className="flex items-center justify-center gap-3 rounded-2xl border-2 border-nog-green-600 bg-nog-green-600/5 px-6 py-8 text-2xl font-black text-nog-green-800 hover:bg-nog-green-600/15 cursor-pointer transition-colors lg:py-12 lg:text-3xl"
                >
                  <Zap size={28} className="lg:size-9" /> {name} Buzzed First!
                </button>
              ))}
            </div>
          )}

          {subPhase !== "buzz-select" && (
            <>
              <motion.span
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(224,184,60,0.5)",
                    "0 0 0 10px rgba(224,184,60,0)",
                  ],
                }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="mx-auto rounded-full bg-nog-gold-500/20 px-5 py-2 text-lg font-black text-nog-gold-700 lg:px-6 lg:py-3 lg:text-xl"
              >
                {selected !== null ? players[selected] : ""}&apos;s Answer
              </motion.span>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6">
                {currentQuestion.options.map((opt, i) => {
                  const isCorrectOption = i === currentQuestion.correctIndex;
                  const isSelected = i === chosenOption;
                  const showFeedback = subPhase === "reveal";
                  let style = "border-nog-black/15 bg-white hover:border-nog-green-600";
                  if (showFeedback) {
                    if (isCorrectOption) style = "border-nog-green-600 bg-nog-green-600/10";
                    else if (isSelected) style = "border-red-500 bg-red-500/10";
                    else style = "border-nog-black/10 bg-white opacity-50";
                  }
                  return (
                    <motion.button
                      key={i}
                      onClick={() => commitAnswer(i)}
                      disabled={subPhase !== "answering"}
                      animate={shakeOption === i ? { x: [0, -8, 8, -8, 8, 0] } : { x: 0 }}
                      className={`flex items-center justify-between rounded-2xl border-2 px-6 py-5 text-left text-xl font-bold text-nog-black transition-colors cursor-pointer disabled:cursor-default lg:px-8 lg:py-7 lg:text-2xl ${style}`}
                    >
                      {opt}
                      {showFeedback && isCorrectOption && <Check className="text-nog-green-700 lg:size-8" size={26} />}
                      {showFeedback && isSelected && !isCorrectOption && <XIcon className="text-red-600 lg:size-8" size={26} />}
                    </motion.button>
                  );
                })}
              </div>
            </>
          )}

          <Scoreboard players={results} title="Live Scores" />
        </div>
      )}

      {phase === "results" && (
        <WinnerScreen
          game="Buzz and Drill"
          players={results}
          subtitle="Great round of Buzz and Drill."
          onPlayAgain={() => setPhase("setup")}
          onExitMenu={exitToMenu}
        />
      )}
    </main>
  );
}
