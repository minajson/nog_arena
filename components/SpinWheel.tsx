"use client";

import { motion } from "framer-motion";

interface SpinWheelProps {
  colors: string[];
  rotation: number;
  className?: string;
  onSpinEnd?: () => void;
}

export default function SpinWheel({
  colors,
  rotation,
  className = "h-80 w-80 sm:h-105 sm:w-105 lg:h-130 lg:w-130 xl:h-150 xl:w-150 2xl:h-170 2xl:w-170",
  onSpinEnd,
}: SpinWheelProps) {
  const n = colors.length;
  const slice = n > 0 ? 360 / n : 360;
  const gradient = colors.map((c, i) => `${c} ${i * slice}deg ${(i + 1) * slice}deg`).join(", ");

  return (
    <div className={`relative mx-auto ${className}`} style={{ perspective: 1400 }}>
      <div className="absolute left-1/2 -top-6 z-10 -translate-x-1/2 sm:-top-8 xl:-top-10">
        <div className="h-0 w-0 border-l-20 border-r-20 border-t-38 border-l-transparent border-r-transparent border-t-nog-black drop-shadow-lg sm:border-l-26 sm:border-r-26 sm:border-t-48 xl:border-l-32 xl:border-r-32 xl:border-t-58" />
      </div>
      <div
        className="h-full w-full rounded-full"
        style={{ transform: "rotateX(18deg)", transformStyle: "preserve-3d" }}
      >
        <motion.div
          animate={{ rotate: rotation }}
          transition={{ duration: 3.8, ease: [0.1, 0.75, 0.15, 1] }}
          onAnimationComplete={onSpinEnd}
          className="h-full w-full rounded-full border-6 border-nog-black shadow-[0_35px_60px_-15px_rgba(10,10,10,0.5)] sm:border-8"
          style={{ background: `conic-gradient(${gradient})` }}
        />
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(ellipse at 50% 20%, rgba(255,255,255,0.35), transparent 60%)",
          }}
        />
      </div>
      <div
        style={{ transform: "translateZ(30px)" }}
        className="absolute inset-0 m-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-nog-black text-base font-black text-nog-gold-400 shadow-lg sm:h-28 sm:w-28 sm:text-xl xl:h-32 xl:w-32 xl:text-2xl"
      >
        NOG
      </div>
    </div>
  );
}
