"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Disc3, PartyPopper, RotateCcw } from "lucide-react";
import GameTopBar from "@/components/GameTopBar";
import SpinWheel from "@/components/SpinWheel";
import ConfettiCelebration from "@/components/ConfettiCelebration";
import GameIntro3D from "@/components/GameIntro3D";
import AnimatedNOGBackground from "@/components/AnimatedNOGBackground";
import VideoBackdrop from "@/components/VideoBackdrop";
import BurstEffect from "@/components/BurstEffect";
import {
  useSpinChallenges,
  useSettings,
  useUsedSpinChallengeIds,
  getUsedSpinChallengeSnapshot,
  markSpinChallengeUsed,
  resetUsedSpinChallenges,
} from "@/lib/store";
import { shuffleArray } from "@/lib/shuffle";
import { playSound, startSpinWhoosh, stopSpinWhoosh } from "@/lib/sound";
import { speak, VOICE_LINES } from "@/lib/speech";
import type { SpinChallenge } from "@/data/spinChallenges";

const WHEEL_COLORS = [
  "var(--nog-green-700)",
  "var(--nog-gold-500)",
  "var(--nog-green-500)",
  "var(--nog-gold-600)",
  "var(--nog-green-800)",
];

const TYPE_LABEL: Record<SpinChallenge["type"], string> = {
  question: "Question",
  task: "Fun Task",
  blank: "Mystery Slot",
};

export default function SpinAndSparkPage() {
  const allChallenges = useSpinChallenges();
  const settings = useSettings();
  const [phase, setPhase] = useState<"intro" | "playing">("intro");
  const [wheel] = useState<SpinChallenge[]>(() => {
    const enabled = allChallenges.filter((c) => c.enabled);
    const count = Math.min(settings.spinNumberOfChallenges, enabled.length) || enabled.length;
    return shuffleArray(enabled).slice(0, Math.max(count, 1));
  });
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [landedChallenge, setLandedChallenge] = useState<SpinChallenge | null>(null);
  const [celebrate, setCelebrate] = useState(false);

  // Every landed challenge is remembered for the whole event so it never comes
  // up twice, until a facilitator resets the pool.
  const usedIds = useUsedSpinChallengeIds();

  function resetPool() {
    resetUsedSpinChallenges();
    setLandedChallenge(null);
  }

  function remainingChallenges() {
    const used = new Set(getUsedSpinChallengeSnapshot());
    return allChallenges.filter((c) => c.enabled && c.type !== "blank" && !used.has(c.id));
  }

  const landed = landedChallenge;
  const exhausted = allChallenges.every(
    (c) => !c.enabled || c.type === "blank" || usedIds.includes(c.id)
  );

  function spin() {
    if (spinning || wheel.length === 0) return;
    if (remainingChallenges().length === 0) {
      setLandedChallenge(null);
      return;
    }
    setLandedChallenge(null);
    setCelebrate(false);
    setSpinning(true);
    startSpinWhoosh(3.9);
    const index = Math.floor(Math.random() * wheel.length);
    const slice = 360 / wheel.length;
    const targetOffset = (360 - (index * slice + slice / 2) + 360) % 360;
    const extraSpins = 5 + Math.floor(Math.random() * 3);

    setRotation((prev) => {
      const prevMod = ((prev % 360) + 360) % 360;
      let delta = targetOffset - prevMod;
      if (delta < 0) delta += 360;
      return prev + extraSpins * 360 + delta;
    });

    setTimeout(() => {
      stopSpinWhoosh();
      const landedSlice = wheel[index];
      let result = landedSlice;
      if (landedSlice.type !== "blank") {
        // The wheel slices are just colors — swap in an unused challenge if
        // this slice's challenge has already been played this event.
        const used = new Set(getUsedSpinChallengeSnapshot());
        const pool = remainingChallenges();
        if (pool.length > 0) {
          result =
            landedSlice.enabled && !used.has(landedSlice.id)
              ? landedSlice
              : pool[Math.floor(Math.random() * pool.length)];
        }
        markSpinChallengeUsed(result.id);
      }
      setLandedChallenge(result);
      setSpinning(false);
      playSound("spinStop", { volume: 0.7, rate: 0.45 });
      playSound(result.type === "blank" ? "blank" : "buzz");
    }, 3900);
  }

  function markComplete() {
    playSound("celebration");
    speak(VOICE_LINES.correct);
    setCelebrate(true);
    setTimeout(() => setCelebrate(false), 3000);
  }

  return (
    <main className="relative bg-white px-4 py-3 lg:px-6 lg:py-4">
      <AnimatedNOGBackground />
      {phase === "intro" && (
        <GameIntro3D
          title="Spin & Spark"
          icon={Disc3}
          objective="Spin the wheel for a random challenge — funny dares, emoji riddles, impressions and guess-the-thing games. Pure entertainment."
          players="Whole Room"
          timer="No timer — facilitator paced"
          howToPlay={[
            "Hit SPIN and let the wheel decide your challenge.",
            "Expect dares, accents, dances, riddles — anything for a laugh.",
            "Every challenge appears only once per event — no repeats!",
            "Landing on a blank mystery slot? Just spin again.",
          ]}
          scoring={["No points here — just energy, laughs, and participation!"]}
          onContinue={() => setPhase("playing")}
        />
      )}

      {phase !== "intro" && <GameTopBar title="Spin & Spark" />}
      {celebrate && <ConfettiCelebration active durationMs={3000} />}

      {phase === "playing" && (
      <div className="relative mx-auto flex w-full max-w-400 flex-col items-center gap-6 pb-8">
        <VideoBackdrop src="/videos/oil-gas-loop.mp4" opacityClassName="opacity-10" />
        {exhausted ? (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 240, damping: 20 }}
            className="relative mt-10 w-full max-w-3xl overflow-hidden rounded-[2rem] border-2 border-nog-gold-500/40 bg-white p-12 text-center shadow-[0_35px_70px_-20px_rgba(10,10,10,0.35)] lg:p-16"
          >
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-nog-green-600 via-nog-gold-500 to-nog-green-600 animate-shimmer-text"
            />
            <p className="text-7xl">🎉</p>
            <p className="mt-5 text-4xl font-black text-nog-black lg:text-5xl">
              Every challenge has been completed!
            </p>
            <p className="mt-4 text-xl font-semibold text-nog-black/60 lg:text-2xl">
              Come back later for another round.
            </p>
            <button
              onClick={resetPool}
              className="mx-auto mt-9 flex items-center gap-2 rounded-full border-2 border-nog-black/15 px-7 py-3.5 text-lg font-bold text-nog-black/50 hover:border-nog-green-600 hover:text-nog-green-700 cursor-pointer transition-colors"
            >
              <RotateCcw size={20} /> Reset Challenges (Facilitator)
            </button>
          </motion.div>
        ) : (
          <>
            <p className="max-w-xl text-center text-xl font-semibold text-nog-black/60 lg:max-w-2xl lg:text-2xl">
              Click Spin, let the wheel decide, and bring the energy!
            </p>

            <div className="relative pt-2">
              <BurstEffect active={celebrate} color="gold" label="Awesome!" />
              <SpinWheel
                colors={wheel.map((_, i) => WHEEL_COLORS[i % WHEEL_COLORS.length])}
                rotation={rotation}
                onSpinEnd={() => {}}
                onSpin={spin}
                spinning={spinning}
              />
            </div>

            <p className="text-lg font-bold uppercase tracking-[0.25em] text-nog-black/40 lg:text-xl">
              {spinning ? "Spinning…" : "Hit SPIN in the center"}
            </p>
          </>
        )}

        <AnimatePresence>
          {landed && !spinning && (
            <motion.div
              key="result-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLandedChallenge(null)}
              className="fixed inset-0 z-40 flex items-center justify-center bg-nog-black/50 p-4 backdrop-blur-[2px]"
            >
            <motion.div
              key={landed.id}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 40, scale: 0.8, rotate: -2 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, y: -14, scale: 0.92 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="relative w-full max-w-4xl overflow-hidden rounded-[2rem] border-2 border-nog-gold-500/40 bg-white p-9 text-center shadow-[0_45px_90px_-20px_rgba(10,10,10,0.6)] lg:p-12"
            >
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-nog-green-600 via-nog-gold-500 to-nog-green-600 animate-shimmer-text"
              />
              <span className="rounded-full bg-nog-gold-500/15 px-5 py-1.5 text-base font-bold uppercase tracking-wide text-nog-gold-700 lg:px-6 lg:py-2 lg:text-lg">
                {TYPE_LABEL[landed.type]}
              </span>

              {landed.type === "blank" ? (
                <>
                  <p className="mt-5 text-3xl font-black text-nog-black lg:text-4xl">
                    Oh oh&hellip; empty slot! Do you want to try again?
                  </p>
                  <p className="mt-2 text-xl font-semibold text-nog-black/50 lg:text-2xl">{landed.text}</p>
                  <button
                    onClick={spin}
                    className="mt-6 flex items-center gap-2 mx-auto rounded-2xl border-2 border-nog-green-600 px-8 py-4 text-xl font-black text-nog-green-700 hover:bg-nog-green-600/10 cursor-pointer lg:px-10 lg:py-5 lg:text-2xl"
                  >
                    <RotateCcw size={22} className="lg:size-7" /> Try Again
                  </button>
                </>
              ) : (
                <>
                  <p className="mt-5 text-3xl font-black leading-snug text-nog-black lg:text-4xl">{landed.text}</p>
                  <div className="mt-6 flex flex-wrap justify-center gap-4">
                    <button
                      onClick={markComplete}
                      className="flex items-center gap-2 rounded-2xl bg-nog-gold-500 px-8 py-4 text-xl font-black text-nog-black hover:bg-nog-gold-600 cursor-pointer lg:px-10 lg:py-5 lg:text-2xl"
                    >
                      <PartyPopper size={22} className="lg:size-7" /> Celebrate!
                    </button>
                    <button
                      onClick={spin}
                      className="flex items-center gap-2 rounded-2xl border-2 border-nog-black/15 px-8 py-4 text-xl font-black text-nog-black/70 hover:border-nog-green-600 hover:text-nog-green-700 cursor-pointer lg:px-10 lg:py-5 lg:text-2xl"
                    >
                      <RotateCcw size={22} className="lg:size-7" /> Spin Again
                    </button>
                  </div>
                </>
              )}
            </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      )}
    </main>
  );
}
