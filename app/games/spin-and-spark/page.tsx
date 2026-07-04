"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Disc3, PartyPopper, RotateCcw, Sparkles } from "lucide-react";
import GameTopBar from "@/components/GameTopBar";
import SpinWheel from "@/components/SpinWheel";
import ConfettiCelebration from "@/components/ConfettiCelebration";
import GameIntro3D from "@/components/GameIntro3D";
import { useSpinChallenges, useSettings } from "@/lib/store";
import { shuffleArray } from "@/lib/shuffle";
import { playSound } from "@/lib/sound";
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
  const [landedIndex, setLandedIndex] = useState<number | null>(null);
  const [celebrate, setCelebrate] = useState(false);

  const landed = landedIndex !== null ? wheel[landedIndex] : null;

  function spin() {
    if (spinning || wheel.length === 0) return;
    setLandedIndex(null);
    setCelebrate(false);
    setSpinning(true);
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
      setLandedIndex(index);
      setSpinning(false);
      playSound(wheel[index].type === "blank" ? "blank" : "buzz");
    }, 3300);
  }

  function markComplete() {
    playSound("celebration");
    setCelebrate(true);
    setTimeout(() => setCelebrate(false), 3000);
  }

  return (
    <main className="relative min-h-screen bg-white px-6 py-8">
      {phase === "intro" && (
        <GameIntro3D
          title="Spin & Spark"
          icon={Disc3}
          objective="Spin the wheel for a random challenge — trivia questions, fun tasks, or a mystery blank slot."
          players="Whole Room"
          timer="No timer — facilitator paced"
          howToPlay={[
            "Click Spin and let the wheel decide your challenge.",
            "Questions test energy sector knowledge, tasks are just for fun.",
            "Landing on a blank mystery slot? Just spin again.",
            "The facilitator judges when a task is completed.",
          ]}
          scoring={["No points here — just energy, laughs, and participation!"]}
          onContinue={() => setPhase("playing")}
        />
      )}

      {phase !== "intro" && <GameTopBar title="Spin & Spark" />}
      {celebrate && <ConfettiCelebration active durationMs={3000} />}

      {phase === "playing" && (
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-8 pb-12">
        <p className="max-w-lg text-center text-lg font-semibold text-nog-black/60">
          Click Spin, let the wheel decide, and bring the energy!
        </p>

        <SpinWheel
          colors={wheel.map((_, i) => WHEEL_COLORS[i % WHEEL_COLORS.length])}
          rotation={rotation}
          onSpinEnd={() => {}}
        />

        <button
          onClick={spin}
          disabled={spinning}
          className="flex items-center gap-3 rounded-2xl bg-nog-green-700 px-10 py-5 text-2xl font-black text-white shadow-lg hover:bg-nog-green-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          <Sparkles size={26} /> {spinning ? "Spinning..." : "Spin"}
        </button>

        <AnimatePresence mode="wait">
          {landed && !spinning && (
            <motion.div
              key={landed.id}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8 }}
              className="w-full rounded-3xl border-2 border-nog-black/10 bg-white p-8 text-center shadow-xl"
            >
              <span className="rounded-full bg-nog-gold-500/15 px-4 py-1 text-sm font-bold uppercase tracking-wide text-nog-gold-700">
                {TYPE_LABEL[landed.type]}
              </span>

              {landed.type === "blank" ? (
                <>
                  <p className="mt-4 text-2xl font-black text-nog-black">
                    Oh oh&hellip; empty slot! Do you want to try again?
                  </p>
                  <p className="mt-2 text-lg font-semibold text-nog-black/50">{landed.text}</p>
                  <button
                    onClick={spin}
                    className="mt-6 flex items-center gap-2 mx-auto rounded-2xl border-2 border-nog-green-600 px-8 py-4 text-xl font-black text-nog-green-700 hover:bg-nog-green-600/10 cursor-pointer"
                  >
                    <RotateCcw size={22} /> Try Again
                  </button>
                </>
              ) : (
                <>
                  <p className="mt-4 text-2xl font-black leading-snug text-nog-black">{landed.text}</p>
                  <div className="mt-6 flex flex-wrap justify-center gap-4">
                    <button
                      onClick={markComplete}
                      className="flex items-center gap-2 rounded-2xl bg-nog-gold-500 px-8 py-4 text-xl font-black text-nog-black hover:bg-nog-gold-600 cursor-pointer"
                    >
                      <PartyPopper size={22} /> Celebrate!
                    </button>
                    <button
                      onClick={spin}
                      className="flex items-center gap-2 rounded-2xl border-2 border-nog-black/15 px-8 py-4 text-xl font-black text-nog-black/70 hover:border-nog-green-600 hover:text-nog-green-700 cursor-pointer"
                    >
                      <RotateCcw size={22} /> Spin Again
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      )}
    </main>
  );
}
