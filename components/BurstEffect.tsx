"use client";

import { AnimatePresence, motion } from "framer-motion";

interface BurstEffectProps {
  active: boolean;
  color?: "green" | "gold" | "red";
  label?: string;
}

const COLOR_MAP = {
  green: { ring: "border-nog-green-600", glow: "rgba(15,148,85,0.45)", text: "text-nog-green-700" },
  gold: { ring: "border-nog-gold-500", glow: "rgba(224,184,60,0.5)", text: "text-nog-gold-700" },
  red: { ring: "border-red-500", glow: "rgba(239,68,68,0.4)", text: "text-red-600" },
} as const;

const PARTICLE_COUNT = 10;

/** A short radiating ring + particle pop, used to punctuate correct answers, hazard finds, and completions. */
export default function BurstEffect({ active, color = "green", label }: BurstEffectProps) {
  const palette = COLOR_MAP[color];

  return (
    <AnimatePresence>
      {active && (
        <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center">
          {[0, 1].map((ring) => (
            <motion.div
              key={ring}
              initial={{ opacity: 0.6, scale: 0.3 }}
              animate={{ opacity: 0, scale: 2.2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, delay: ring * 0.12, ease: "easeOut" }}
              className={`absolute h-32 w-32 rounded-full border-4 ${palette.ring}`}
            />
          ))}

          {Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
            const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
            return (
              <motion.span
                key={i}
                initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                animate={{
                  opacity: 0,
                  x: Math.cos(angle) * 90,
                  y: Math.sin(angle) * 90,
                  scale: 0.4,
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute h-3 w-3 rounded-full"
                style={{ background: palette.glow }}
              />
            );
          })}

          {label && (
            <motion.span
              initial={{ opacity: 0, y: 6, scale: 0.8 }}
              animate={{ opacity: 1, y: -18, scale: 1.1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={`absolute text-2xl font-black drop-shadow-sm ${palette.text}`}
            >
              {label}
            </motion.span>
          )}
        </div>
      )}
    </AnimatePresence>
  );
}
