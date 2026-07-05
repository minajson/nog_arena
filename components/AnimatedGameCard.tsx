"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import type { GameMeta } from "@/data/games";

interface AnimatedGameCardProps {
  game: GameMeta;
  icon: LucideIcon;
  index: number;
}

const TILT_RANGE = 20;

export default function AnimatedGameCard({ game, icon: Icon, index }: AnimatedGameCardProps) {
  const router = useRouter();
  const ref = useRef<HTMLButtonElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springConfig = { stiffness: 220, damping: 20 };
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [TILT_RANGE, -TILT_RANGE]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-TILT_RANGE, TILT_RANGE]), springConfig);

  function handleMouseMove(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }

  function resetTilt() {
    mouseX.set(0.5);
    mouseY.set(0.5);
  }

  return (
    <div className="group relative">
      <div
        aria-hidden
        className="absolute -inset-1 rounded-4xl bg-linear-to-br from-nog-green-500/40 via-nog-gold-500/40 to-nog-green-500/40 opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-100"
      />
      <motion.button
        ref={ref}
        onClick={() => router.push(game.path)}
        onMouseMove={handleMouseMove}
        onMouseLeave={resetTilt}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.06, duration: 0.35 }}
        whileHover={{ scale: 1.06, z: 40 }}
        whileTap={{ scale: 0.97 }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1000 }}
        className="btn-shine group/card relative flex h-full w-full flex-col items-start gap-4 overflow-hidden rounded-3xl border-2 border-nog-black/10 bg-white p-7 text-left shadow-[0_18px_40px_-14px_rgba(10,10,10,0.3)] hover:border-nog-green-600 hover:shadow-[0_30px_70px_-15px_rgba(15,148,85,0.4)] transition-[border-color,box-shadow] cursor-pointer 2xl:p-8"
      >
        <motion.span
          aria-hidden
          animate={{ y: [0, -6, 0], opacity: [0.15, 0.35, 0.15] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-4 right-4 text-nog-green-600"
          style={{ transform: "translateZ(50px)" }}
        >
          <Icon size={16} strokeWidth={2} />
        </motion.span>

        <div
          style={{ transform: "translateZ(40px)" }}
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-nog-green-800 text-nog-gold-400 shadow-lg shadow-nog-green-900/20 transition-colors group-hover/card:bg-nog-green-700 2xl:h-20 2xl:w-20"
        >
          <Icon size={32} strokeWidth={2.25} className="2xl:size-10" />
        </div>
        <div style={{ transform: "translateZ(24px)" }}>
          <h3 className="text-2xl font-black text-nog-black 2xl:text-3xl">{game.name}</h3>
          <p className="mt-1.5 text-base font-medium text-nog-black/60 2xl:text-lg">{game.tagline}</p>
        </div>
        <span
          style={{ transform: "translateZ(16px)" }}
          className="mt-auto flex items-center gap-1.5 pt-2 text-lg font-bold text-nog-green-700 group-hover/card:text-nog-green-800 2xl:text-xl"
        >
          Play Now
          <span className="inline-block transition-transform group-hover/card:translate-x-1.5">→</span>
        </span>

        <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 shadow-[0_0_0_3px_rgba(224,184,60,0.4)] transition-opacity group-hover/card:opacity-100" />
      </motion.button>
    </div>
  );
}
