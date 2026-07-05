"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Disc3, PartyPopper, RotateCcw, Sparkles } from "lucide-react";
import GameTopBar from "@/components/GameTopBar";
import SpinWheel from "@/components/SpinWheel";
import ConfettiCelebration from "@/components/ConfettiCelebration";
import GameIntro3D from "@/components/GameIntro3D";
import AnimatedNOGBackground from "@/components/AnimatedNOGBackground";
import VideoBackdrop from "@/components/VideoBackdrop";
import BurstEffect from "@/components/BurstEffect";
import { useSpinChallenges, useSettings } from "@/lib/store";
import { shuffleArray } from "@/lib/shuffle";
import { playSound, playLoopingSound, stopSound } from "@/lib/sound";
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
  const [landedIndex, setLandedIndex] = useState<number | null>(null);
  const [celebrate, setCelebrate] = useState(false);

  const landed = landedIndex !== null ? wheel[landedIndex] : null;

  function spin() {
    if (spinning || wheel.length === 0) return;
    setLandedIndex(null);
    setCelebrate(false);
    setSpinning(true);
    playLoopingSound("spin", { volume: 0.22, rate: 1.1 });
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
      stopSound("spin");
      setLandedIndex(index);
      setSpinning(false);
      playSound(wheel[index].type === "blank" ? "blank" : "buzz");
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
      <div className="relative mx-auto flex w-[95vw] max-w-300 flex-col items-center gap-8 pb-12">
        <VideoBackdrop src="/videos/oil-gas-loop.mp4" opacityClassName="opacity-10" />
        <p className="max-w-lg text-center text-lg font-semibold text-nog-black/60 lg:max-w-xl lg:text-xl">
          Click Spin, let the wheel decide, and bring the energy!
        </p>

        <div className="relative">
          <BurstEffect active={celebrate} color="gold" label="Awesome!" />
          <SpinWheel
            colors={wheel.map((_, i) => WHEEL_COLORS[i % WHEEL_COLORS.length])}
            rotation={rotation}
            onSpinEnd={() => {}}
          />
        </div>

        <motion.button
          onClick={spin}
          disabled={spinning}
          whileHover={!spinning ? { scale: 1.03 } : undefined}
          whileTap={!spinning ? { scale: 0.97 } : undefined}
          className="btn-shine flex items-center gap-3 rounded-2xl bg-nog-green-700 px-10 py-5 text-2xl font-black text-white shadow-lg hover:bg-nog-green-800 hover:shadow-[0_10px_30px_-8px_rgba(15,148,85,0.6)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-[background-color,box-shadow] lg:px-14 lg:py-7 lg:text-3xl"
        >
          <Sparkles size={26} className="lg:size-8" /> {spinning ? "Spinning..." : "Spin"}
        </motion.button>

        <AnimatePresence mode="wait">
          {landed && !spinning && (
            <motion.div
              key={landed.id}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8 }}
              className="w-full rounded-3xl border-2 border-nog-black/10 bg-white p-8 text-center shadow-xl lg:p-10"
            >
              <span className="rounded-full bg-nog-gold-500/15 px-4 py-1 text-sm font-bold uppercase tracking-wide text-nog-gold-700 lg:px-5 lg:py-1.5 lg:text-base">
                {TYPE_LABEL[landed.type]}
              </span>

              {landed.type === "blank" ? (
                <>
                  <p className="mt-4 text-2xl font-black text-nog-black lg:text-3xl">
                    Oh oh&hellip; empty slot! Do you want to try again?
                  </p>
                  <p className="mt-2 text-lg font-semibold text-nog-black/50 lg:text-xl">{landed.text}</p>
                  <button
                    onClick={spin}
                    className="mt-6 flex items-center gap-2 mx-auto rounded-2xl border-2 border-nog-green-600 px-8 py-4 text-xl font-black text-nog-green-700 hover:bg-nog-green-600/10 cursor-pointer lg:px-10 lg:py-5 lg:text-2xl"
                  >
                    <RotateCcw size={22} className="lg:size-7" /> Try Again
                  </button>
                </>
              ) : (
                <>
                  <p className="mt-4 text-2xl font-black leading-snug text-nog-black lg:text-3xl">{landed.text}</p>
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
          )}
        </AnimatePresence>
      </div>
      )}
    </main>
  );
}
