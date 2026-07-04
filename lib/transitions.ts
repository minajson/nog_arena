import type { Variants } from "framer-motion";

/** Named phase-transition presets shared across game pages so switching between
 * intro / setup / playing / results always feels like a deliberate scene change. */
export const PHASE_VARIANTS: Record<"slide" | "fade" | "zoom" | "bounce", Variants> = {
  slide: {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" } },
    exit: { opacity: 0, x: -40, transition: { duration: 0.25, ease: "easeIn" } },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  },
  zoom: {
    initial: { opacity: 0, scale: 0.92 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: "easeOut" } },
    exit: { opacity: 0, scale: 1.05, transition: { duration: 0.2 } },
  },
  bounce: {
    initial: { opacity: 0, y: 30, scale: 0.9 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 260, damping: 18 },
    },
    exit: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2 } },
  },
};
