"use client";

import { motion } from "framer-motion";

interface SpinWheelProps {
  colors: string[];
  rotation: number;
  className?: string;
  onSpinEnd?: () => void;
  /** When provided, the center hub becomes the SPIN button. */
  onSpin?: () => void;
  spinning?: boolean;
}

/* Static carnival bulbs sitting on the gold rim (they don't rotate with the wheel). */
const BULB_COUNT = 16;
const BULBS = Array.from({ length: BULB_COUNT }, (_, i) => {
  const angle = (i * 2 * Math.PI) / BULB_COUNT;
  return {
    left: `${50 + 47.5 * Math.sin(angle)}%`,
    top: `${50 - 47.5 * Math.cos(angle)}%`,
    delay: `${(i % 2) * 0.55}s`,
  };
});

/* Ease with a slight overshoot past the landing angle (~0.3% of the total sweep)
 * so the wheel "bounces" back onto its result. Total duration stays 3.8s to match
 * the reveal timing in the page. */
const SPIN_EASE: [number, number, number, number] = [0.12, 0.8, 0.22, 1.01];

export default function SpinWheel({
  colors,
  rotation,
  className = "h-80 w-80 sm:h-105 sm:w-105 lg:h-135 lg:w-135 xl:h-155 xl:w-155 2xl:h-175 2xl:w-175",
  onSpinEnd,
  onSpin,
  spinning = false,
}: SpinWheelProps) {
  const n = colors.length;
  const slice = n > 0 ? 360 / n : 360;
  const gradient = colors.map((c, i) => `${c} ${i * slice}deg ${(i + 1) * slice}deg`).join(", ");

  return (
    <div className={`relative mx-auto ${className}`} style={{ perspective: 1400 }}>
      {/* depth shadow grounding the wheel */}
      <div
        aria-hidden
        className="absolute -bottom-8 left-1/2 h-[10%] w-[82%] -translate-x-1/2 rounded-full bg-black/30 blur-2xl"
      />

      {/* fixed gold pointer */}
      <div className="absolute left-1/2 -top-4 z-20 -translate-x-1/2 sm:-top-5 xl:-top-6">
        <svg
          viewBox="0 0 60 74"
          className="h-14 w-11 drop-shadow-[0_6px_10px_rgba(10,10,10,0.45)] sm:h-18 sm:w-14 xl:h-22 xl:w-17"
        >
          <defs>
            <linearGradient id="wheel-pointer" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f7dd88" />
              <stop offset="0.45" stopColor="#e0b83c" />
              <stop offset="1" stopColor="#a9791f" />
            </linearGradient>
          </defs>
          <path d="M30 72 L5 20 Q30 2 55 20 Z" fill="url(#wheel-pointer)" stroke="#8a6216" strokeWidth="2.5" />
          <circle cx="30" cy="19" r="6.5" fill="#fff6d8" opacity="0.95" />
        </svg>
      </div>

      <div
        className="h-full w-full"
        style={{ transform: "rotateX(14deg)", transformStyle: "preserve-3d" }}
      >
        {/* metallic gold outer rim */}
        <div
          className="absolute inset-0 rounded-full p-[4.5%] shadow-[0_30px_60px_-12px_rgba(10,10,10,0.55),inset_0_2px_3px_rgba(255,255,255,0.6),inset_0_-3px_6px_rgba(90,60,10,0.55)]"
          style={{
            background:
              "conic-gradient(from 210deg, #a9791f, #f2cf5c 12%, #c99a2e 25%, #8a6216 38%, #e0b83c 52%, #f7dd88 62%, #a9791f 75%, #e0b83c 88%, #a9791f)",
          }}
        >
          {/* rotating glossy segment disc */}
          <motion.div
            animate={{ rotate: rotation }}
            transition={{ duration: 3.8, ease: SPIN_EASE }}
            onAnimationComplete={onSpinEnd}
            className="h-full w-full rounded-full border-4 border-[#8a6216]/70"
            style={{ background: `conic-gradient(${gradient})` }}
          />

          {/* glossy top light sweep */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-[4.5%] rounded-full"
            style={{
              background:
                "radial-gradient(ellipse at 50% 16%, rgba(255,255,255,0.42), rgba(255,255,255,0.08) 42%, transparent 60%)",
            }}
          />
          {/* inner glow + recessed edge */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-[4.5%] rounded-full shadow-[inset_0_0_48px_rgba(20,173,99,0.35),inset_0_0_14px_rgba(10,10,10,0.5)]"
          />

          {/* carnival bulbs on the rim */}
          {BULBS.map((b, i) => (
            <span
              key={i}
              aria-hidden
              className="animate-bulb-blink absolute h-[2.8%] w-[2.8%] rounded-full bg-[#fff3c4]"
              style={{ left: b.left, top: b.top, transform: "translate(-50%,-50%)", animationDelay: b.delay }}
            />
          ))}
        </div>

        {/* bold central SPIN hub */}
        {onSpin ? (
          <motion.button
            onClick={onSpin}
            disabled={spinning}
            whileHover={!spinning ? { scale: 1.06 } : undefined}
            whileTap={!spinning ? { scale: 0.94 } : undefined}
            style={{ transform: "translateZ(30px)" }}
            className={`absolute inset-0 z-10 m-auto flex h-26 w-26 items-center justify-center rounded-full border-4 border-[#8a6216] text-2xl font-black tracking-widest text-nog-green-950 shadow-[0_10px_24px_rgba(10,10,10,0.5),inset_0_2px_2px_rgba(255,255,255,0.7),inset_0_-4px_8px_rgba(138,98,22,0.6)] sm:h-34 sm:w-34 sm:text-3xl xl:h-40 xl:w-40 xl:text-4xl ${
              spinning ? "cursor-not-allowed opacity-80" : "cta-pulse cursor-pointer"
            }`}
          >
            <span
              aria-hidden
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 50% 28%, #f7dd88, #e0b83c 55%, #c99a2e 80%, #a9791f)",
              }}
            />
            <span className="relative">{spinning ? "…" : "SPIN"}</span>
          </motion.button>
        ) : (
          <div
            style={{ transform: "translateZ(30px)" }}
            className="absolute inset-0 m-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-nog-black text-base font-black text-nog-gold-400 shadow-lg sm:h-28 sm:w-28 sm:text-xl xl:h-32 xl:w-32 xl:text-2xl"
          >
            NOG
          </div>
        )}
      </div>
    </div>
  );
}
