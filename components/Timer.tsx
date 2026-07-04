"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { motion } from "framer-motion";
import { playSound } from "@/lib/sound";

interface TimerProps {
  duration: number;
  isRunning: boolean;
  onExpire: () => void;
  onTick?: (secondsLeft: number) => void;
  warningThreshold?: number;
}

const CRITICAL_THRESHOLD = 5;

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
    if (secondsLeft <= warningThreshold && secondsLeft > 0 && !warnedRef.current) {
      warnedRef.current = true;
      playSound("warning");
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

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-lg font-bold text-nog-black/60 uppercase tracking-wide">
          Time Left
        </span>
        <motion.span
          key={timeLeft}
          initial={{ scale: isWarning ? 1.3 : 1 }}
          animate={{ scale: 1 }}
          className={`text-4xl font-black tabular-nums ${textColor}`}
        >
          {timeLeft}s
        </motion.span>
      </div>
      <div className="h-4 w-full rounded-full bg-nog-black/10 overflow-hidden">
        <motion.div
          animate={{ width: `${pct}%` }}
          transition={{ ease: "linear", duration: 0.3 }}
          className={`h-full rounded-full ${barColor} ${isCritical ? "animate-pulse" : ""}`}
        />
      </div>
    </div>
  );
}
