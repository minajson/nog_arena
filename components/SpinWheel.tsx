"use client";

import { motion } from "framer-motion";

interface SpinWheelProps {
  colors: string[];
  rotation: number;
  size?: number;
  onSpinEnd?: () => void;
}

export default function SpinWheel({ colors, rotation, size = 320, onSpinEnd }: SpinWheelProps) {
  const n = colors.length;
  const slice = n > 0 ? 360 / n : 360;
  const gradient = colors.map((c, i) => `${c} ${i * slice}deg ${(i + 1) * slice}deg`).join(", ");

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <div className="absolute left-1/2 -top-5 z-10 -translate-x-1/2">
        <div className="h-0 w-0 border-l-[16px] border-r-[16px] border-t-[30px] border-l-transparent border-r-transparent border-t-nog-black drop-shadow-lg" />
      </div>
      <motion.div
        animate={{ rotate: rotation }}
        transition={{ duration: 3.2, ease: [0.17, 0.67, 0.32, 1] }}
        onAnimationComplete={onSpinEnd}
        className="h-full w-full rounded-full border-[6px] border-nog-black shadow-2xl"
        style={{ background: `conic-gradient(${gradient})` }}
      />
      <div className="absolute inset-0 m-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-nog-black text-base font-black text-nog-gold-400 shadow-lg">
        NOG
      </div>
    </div>
  );
}
