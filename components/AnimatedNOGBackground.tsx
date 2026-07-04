"use client";

import { motion } from "framer-motion";
import { Flame, Droplet, Gauge, TriangleAlert } from "lucide-react";

interface AnimatedNOGBackgroundProps {
  /** "hero" is busier (landing page); "subtle" is a lighter dose for in-game screens. */
  variant?: "hero" | "subtle";
}

const FLOAT_ICONS_HERO = [
  { Icon: Flame, top: "12%", left: "8%", size: 34, delay: 0, color: "var(--nog-gold-500)" },
  { Icon: Droplet, top: "68%", left: "6%", size: 28, delay: 0.6, color: "var(--nog-green-600)" },
  { Icon: Gauge, top: "20%", left: "88%", size: 30, delay: 1.1, color: "var(--nog-gold-600)" },
  { Icon: Droplet, top: "78%", left: "92%", size: 24, delay: 0.3, color: "var(--nog-green-500)" },
  { Icon: TriangleAlert, top: "48%", left: "4%", size: 22, delay: 1.4, color: "var(--nog-gold-500)" },
  { Icon: TriangleAlert, top: "8%", left: "55%", size: 18, delay: 0.9, color: "var(--nog-green-600)" },
];

const FLOAT_ICONS_SUBTLE = [
  { Icon: Flame, top: "15%", left: "92%", size: 24, delay: 0, color: "var(--nog-gold-500)" },
  { Icon: Droplet, top: "80%", left: "5%", size: 22, delay: 0.8, color: "var(--nog-green-600)" },
];

const PARTICLES = [
  { top: "18%", left: "22%", delay: 0 },
  { top: "32%", left: "72%", delay: 0.8 },
  { top: "60%", left: "38%", delay: 1.6 },
  { top: "75%", left: "60%", delay: 0.4 },
  { top: "44%", left: "12%", delay: 1.2 },
  { top: "10%", left: "80%", delay: 2 },
];

function RigSilhouette({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 140" className={className} fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="20" y1="140" x2="50" y2="10" />
      <line x1="80" y1="140" x2="50" y2="10" />
      <line x1="30" y1="100" x2="70" y2="100" />
      <line x1="35" y1="70" x2="65" y2="70" />
      <line x1="40" y1="40" x2="60" y2="40" />
      <line x1="50" y1="10" x2="50" y2="0" />
    </svg>
  );
}

function BarrelSilhouette({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 80" className={className} fill="currentColor">
      <rect x="4" y="4" width="52" height="72" rx="10" />
      <rect x="4" y="24" width="52" height="6" fill="white" opacity="0.25" />
      <rect x="4" y="50" width="52" height="6" fill="white" opacity="0.25" />
    </svg>
  );
}

function ValveSilhouette({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" className={className} fill="none" stroke="currentColor" strokeWidth="3">
      <circle cx="30" cy="30" r="14" />
      <line x1="30" y1="4" x2="30" y2="16" />
      <line x1="30" y1="44" x2="30" y2="56" />
      <line x1="4" y1="30" x2="16" y2="30" />
      <line x1="44" y1="30" x2="56" y2="30" />
    </svg>
  );
}

export default function AnimatedNOGBackground({ variant = "subtle" }: AnimatedNOGBackgroundProps) {
  const icons = variant === "hero" ? FLOAT_ICONS_HERO : FLOAT_ICONS_SUBTLE;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* soft gradient glows */}
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-nog-green-500/10 blur-3xl" />
      <div className="absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-nog-gold-500/10 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-nog-green-600/10 blur-3xl" />

      {/* dotted energy grid */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          color: "var(--nog-green-800)",
        }}
      />

      {/* faint pipeline curves + diagonal run + energy wave */}
      <svg
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full text-nog-green-700/8"
      >
        <path
          d="M -50 650 C 250 550, 350 750, 650 620 S 1050 480, 1250 560"
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          strokeDasharray="2 26"
        />
        <path
          d="M -50 120 C 200 220, 500 40, 800 160 S 1100 260, 1260 140"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeDasharray="2 22"
        />
        {/* diagonal pipeline run, bottom-left to top-right */}
        <line
          x1="-40"
          y1="840"
          x2="1240"
          y2="-40"
          stroke="currentColor"
          strokeWidth="14"
          strokeDasharray="3 30"
          className="text-nog-gold-600/6"
        />
        {/* energy wave */}
        <path
          d="M -50 460 Q 50 400 150 460 T 350 460 T 550 460 T 750 460 T 950 460 T 1250 460"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-nog-gold-500/8"
        />
      </svg>

      {variant === "hero" && (
        <>
          <RigSilhouette className="absolute bottom-0 left-[4%] h-40 w-28 text-nog-green-800/8 sm:h-56 sm:w-40" />
          <BarrelSilhouette className="absolute bottom-6 right-[8%] h-16 w-12 text-nog-gold-600/8 sm:h-24 sm:w-16" />
          <ValveSilhouette className="absolute top-[10%] right-[20%] h-14 w-14 text-nog-green-700/8 sm:h-20 sm:w-20" />

          {PARTICLES.map((p, i) => (
            <motion.span
              key={i}
              className="absolute h-1.5 w-1.5 rounded-full"
              style={{ top: p.top, left: p.left, background: i % 2 === 0 ? "var(--nog-green-500)" : "var(--nog-gold-500)" }}
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: [0, 0.1, 0], y: [-6, -26, -6] }}
              transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
            />
          ))}
        </>
      )}

      {icons.map(({ Icon, top, left, size, delay, color }, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ top, left, color }}
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0.04, 0.1, 0.04], y: [0, -16, 0] }}
          transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut", delay }}
        >
          <Icon size={size} strokeWidth={1.5} />
        </motion.div>
      ))}
    </div>
  );
}
