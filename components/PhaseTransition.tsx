"use client";

import { motion } from "framer-motion";
import { PHASE_VARIANTS } from "@/lib/transitions";

interface PhaseTransitionProps {
  phaseKey: string;
  variant?: keyof typeof PHASE_VARIANTS;
  className?: string;
  children: React.ReactNode;
}

/** Wrap each phase block in a game page with this (inside an <AnimatePresence mode="wait">)
 * to get a consistent animated scene change between intro / setup / playing / results. */
export default function PhaseTransition({ phaseKey, variant = "slide", className, children }: PhaseTransitionProps) {
  return (
    <motion.div
      key={phaseKey}
      variants={PHASE_VARIANTS[variant]}
      initial="initial"
      animate="animate"
      exit="exit"
      className={className}
    >
      {children}
    </motion.div>
  );
}
