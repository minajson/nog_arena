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
  className = "h-80 w-80 sm:h-105 sm:w-105 lg:h-130 lg:w-130",
  onSpinEnd,
}: SpinWheelProps) {
  const n = colors.length;
  const slice = n > 0 ? 360 / n : 360;
  const gradient = colors.map((c, i) => `${c} ${i * slice}deg ${(i + 1) * slice}deg`).join(", ");

  return (
    <div className={`relative mx-auto ${className}`}>
      <div className="absolute left-1/2 -top-6 z-10 -translate-x-1/2 sm:-top-8">
        <div className="h-0 w-0 border-l-20 border-r-20 border-t-38 border-l-transparent border-r-transparent border-t-nog-black drop-shadow-lg sm:border-l-26 sm:border-r-26 sm:border-t-48" />
      </div>
      <motion.div
        animate={{ rotate: rotation }}
        transition={{ duration: 3.2, ease: [0.17, 0.67, 0.32, 1] }}
        onAnimationComplete={onSpinEnd}
        className="h-full w-full rounded-full border-6 border-nog-black shadow-2xl sm:border-8"
        style={{ background: `conic-gradient(${gradient})` }}
      />
      <div className="absolute inset-0 m-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-nog-black text-base font-black text-nog-gold-400 shadow-lg sm:h-28 sm:w-28 sm:text-xl">
        NOG
      </div>
    </div>
  );
}
