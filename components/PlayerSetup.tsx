"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Play } from "lucide-react";

interface PlayerSetupProps {
  onStart: (players: string[]) => void;
  maxPlayers?: number;
  fixedCount?: number;
}

export default function PlayerSetup({ onStart, maxPlayers = 6, fixedCount }: PlayerSetupProps) {
  const [names, setNames] = useState<string[]>(() =>
    fixedCount ? Array.from({ length: fixedCount }, () => "") : [""]
  );

  function updateName(index: number, value: string) {
    setNames((prev) => prev.map((n, i) => (i === index ? value : n)));
  }

  function addPlayer() {
    if (names.length >= maxPlayers) return;
    setNames((prev) => [...prev, ""]);
  }

  function removePlayer(index: number) {
    setNames((prev) => prev.filter((_, i) => i !== index));
  }

  const validNames = names.map((n) => n.trim()).filter(Boolean);
  const canStart = fixedCount ? validNames.length === fixedCount : validNames.length >= 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="relative mx-auto w-full max-w-xl rounded-3xl border-2 border-nog-black/10 bg-white p-8 shadow-md lg:p-10"
    >
      <h2 className="mb-1 text-3xl font-black text-nog-black lg:text-4xl">Who&apos;s Playing?</h2>
      <p className="mb-6 text-base font-medium text-nog-black/60 lg:text-lg">
        Enter player or team names to begin.
      </p>

      <div className="flex flex-col gap-3">
        <AnimatePresence initial={false}>
          {names.map((name, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2"
            >
              <input
                value={name}
                onChange={(e) => updateName(i, e.target.value)}
                placeholder={`Player ${i + 1} name`}
                maxLength={24}
                className="flex-1 rounded-xl border-2 border-nog-black/15 px-4 py-3 text-lg font-semibold outline-none focus:border-nog-green-600"
              />
              {!fixedCount && names.length > 1 && (
                <button
                  onClick={() => removePlayer(i)}
                  aria-label="Remove player"
                  className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-nog-black/10 text-nog-black/50 hover:border-red-500 hover:text-red-600 cursor-pointer"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {!fixedCount && (
        <button
          onClick={addPlayer}
          disabled={names.length >= maxPlayers}
          className="mt-4 flex items-center gap-2 text-base font-bold text-nog-green-700 hover:text-nog-green-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <Plus size={20} /> Add Player
        </button>
      )}

      <motion.button
        onClick={() => onStart(validNames)}
        disabled={!canStart}
        whileHover={canStart ? { scale: 1.02 } : undefined}
        whileTap={canStart ? { scale: 0.98 } : undefined}
        className="btn-shine mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-nog-green-700 py-4 text-xl font-black text-white shadow-lg hover:bg-nog-green-800 hover:shadow-[0_10px_30px_-8px_rgba(15,148,85,0.6)] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-[background-color,box-shadow]"
      >
        <Play size={24} /> Start Game
      </motion.button>
    </motion.div>
  );
}
