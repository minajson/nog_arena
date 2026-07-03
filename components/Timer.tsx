"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { playSound } from "@/lib/sound";

interface TimerProps {
  duration: number;
  isRunning: boolean;
  onExpire: () => void;
  onTick?: (secondsLeft: number) => void;
  warningThreshold?: number;
}

/**
 * Mount a fresh instance per turn via `key` on the caller (e.g. key={`${questionIndex}-${playerIndex}`})
 * so the countdown resets cleanly instead of syncing state from a changing prop.
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
      setTimeLeft((prev) => {
        const next = prev - 1;
        if (next <= warningThreshold && next > 0 && !warnedRef.current) {
          warnedRef.current = true;
          playSound("warning");
        }
        if (next <= 0 && !expiredRef.current) {
          expiredRef.current = true;
          clearInterval(id);
          onExpire();
          onTick?.(0);
          return 0;
        }
        onTick?.(next);
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, warningThreshold, onExpire]);

  const isWarning = timeLeft <= warningThreshold;
  const pct = Math.max(0, Math.min(100, (timeLeft / duration) * 100));

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
          className={`text-4xl font-black tabular-nums ${
            isWarning ? "text-red-600" : "text-nog-green-800"
          }`}
        >
          {timeLeft}s
        </motion.span>
      </div>
      <div className="h-4 w-full rounded-full bg-nog-black/10 overflow-hidden">
        <motion.div
          animate={{ width: `${pct}%` }}
          transition={{ ease: "linear", duration: 0.3 }}
          className={`h-full rounded-full ${
            isWarning ? "bg-red-600 animate-pulse" : "bg-nog-green-600"
          }`}
        />
      </div>
    </div>
  );
}
