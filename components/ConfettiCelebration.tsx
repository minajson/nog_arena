"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Confetti from "react-confetti";

function subscribeResize(callback: () => void) {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}

interface ConfettiCelebrationProps {
  active: boolean;
  durationMs?: number;
}

export default function ConfettiCelebration({ active, durationMs = 8000 }: ConfettiCelebrationProps) {
  const width = useSyncExternalStore(subscribeResize, () => window.innerWidth, () => 0);
  const height = useSyncExternalStore(subscribeResize, () => window.innerHeight, () => 0);
  const [recycle, setRecycle] = useState(true);

  useEffect(() => {
    if (!active) return;
    const timeout = setTimeout(() => setRecycle(false), durationMs);
    return () => clearTimeout(timeout);
  }, [active, durationMs]);

  if (!active || width === 0) return null;

  return (
    <Confetti
      width={width}
      height={height}
      recycle={recycle}
      numberOfPieces={recycle ? 250 : 0}
      gravity={0.25}
      colors={["#14ad63", "#e0b83c", "#0a5c3a", "#f2cf5c", "#0a0a0a"]}
      className="pointer-events-none fixed inset-0 z-50"
    />
  );
}
