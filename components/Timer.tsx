"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { motion } from "framer-motion";
import { playSound } from "@/lib/sound";
import { speak, VOICE_LINES } from "@/lib/speech";

interface TimerProps {
  duration: number;
  isRunning: boolean;
  onExpire: () => void;
  onTick?: (secondsLeft: number) => void;
  warningThreshold?: number;
  /** Single-row layout (number + bar inline) for screens that must fit 100vh. */
  compact?: boolean;
}

const CRITICAL_THRESHOLD = 5;
const TICKING_THRESHOLD = 10;

/**
 * Mount a fresh instance per turn via `key` on the caller (e.g. key={`${questionIndex}-${playerIndex}`})
 * so the countdown resets cleanly instead of syncing state from a changing prop.
 *
 * The interval effect only ever computes the next number; side effects (sounds,
 * onTick/onExpire callbacks) live in `handleTick`, a useEffectEvent so it always
 * sees the latest props without needing to be an effect dependency itself.
 */
export default function Timer({
  duration,
  isRunning,
  onExpire,
  onTick,
  warningThreshold = 15,
  compact = false,
}: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const warnedRef = useRef(false);
  const expiredRef = useRef(false);

  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning]);

  const handleTick = useEffectEvent((secondsLeft: number) => {
    onTick?.(secondsLeft);
    // Urgency ticking through the final stretch — quicker and louder in the last 5s.
    if (isRunning && secondsLeft <= TICKING_THRESHOLD && secondsLeft > 0) {
      const critical = secondsLeft <= CRITICAL_THRESHOLD;
      playSound("tickSoft", { volume: critical ? 0.55 : 0.3, rate: critical ? 1.3 : 1 });
    }
    if (secondsLeft <= warningThreshold && secondsLeft > 0 && !warnedRef.current) {
      warnedRef.current = true;
      playSound("warning");
      speak(VOICE_LINES.hurryUp);
    }
    if (secondsLeft <= 0 && !expiredRef.current) {
      expiredRef.current = true;
      playSound("buzzerEnd");
      onExpire();
    }
  });

  useEffect(() => {
    handleTick(timeLeft);
  }, [timeLeft]);

  const isCritical = timeLeft <= CRITICAL_THRESHOLD;
  const isWarning = timeLeft <= warningThreshold;
  const pct = Math.max(0, Math.min(100, (timeLeft / duration) * 100));

  const barColor = isCritical ? "bg-red-600" : isWarning ? "bg-nog-gold-500" : "bg-nog-green-600";
  const textColor = isCritical ? "text-red-600" : isWarning ? "text-nog-gold-600" : "text-nog-green-800";

  if (compact) {
    return (
      <motion.div
        animate={isCritical ? { scale: [1, 1.015, 1] } : { scale: 1 }}
        transition={isCritical ? { duration: 0.6, repeat: Infinity } : undefined}
        className="flex w-full items-center gap-4"
      >
        <motion.span
          key={timeLeft}
          initial={{ scale: isCritical ? 1.4 : isWarning ? 1.2 : 1 }}
          animate={{ scale: 1 }}
          className={`w-16 shrink-0 text-right text-3xl font-black tabular-nums lg:w-20 lg:text-4xl ${textColor} ${isCritical ? "drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]" : ""}`}
        >
          {timeLeft}s
        </motion.span>
        <div
          className={`h-3 flex-1 rounded-full bg-nog-black/10 overflow-hidden lg:h-3.5 ${
            isCritical ? "shadow-[0_0_0_4px_rgba(220,38,38,0.2)]" : isWarning ? "shadow-[0_0_0_3px_rgba(224,184,60,0.2)]" : ""
          }`}
        >
          <motion.div
            animate={{ width: `${pct}%` }}
            transition={{ ease: "linear", duration: 0.3 }}
            className={`h-full rounded-full ${barColor} ${isCritical ? "animate-pulse" : ""}`}
          />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      animate={isCritical ? { scale: [1, 1.015, 1] } : { scale: 1 }}
      transition={isCritical ? { duration: 0.6, repeat: Infinity } : undefined}
      className="w-full"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-lg font-bold text-nog-black/60 uppercase tracking-wide lg:text-xl">
          Time Left
        </span>
        <motion.span
          key={timeLeft}
          initial={{ scale: isCritical ? 1.5 : isWarning ? 1.3 : 1 }}
          animate={{ scale: 1 }}
          className={`text-4xl font-black tabular-nums lg:text-5xl xl:text-6xl ${textColor} ${isCritical ? "drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]" : ""}`}
        >
          {timeLeft}s
        </motion.span>
      </div>
      <div
        className={`h-4 w-full rounded-full bg-nog-black/10 overflow-hidden lg:h-5 ${
          isCritical ? "shadow-[0_0_0_4px_rgba(220,38,38,0.2)]" : isWarning ? "shadow-[0_0_0_3px_rgba(224,184,60,0.2)]" : ""
        }`}
      >
        <motion.div
          animate={{ width: `${pct}%` }}
          transition={{ ease: "linear", duration: 0.3 }}
          className={`h-full rounded-full ${barColor} ${isCritical ? "animate-pulse" : ""}`}
        />
      </div>
    </motion.div>
  );
}
