"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import type { GameMeta } from "@/data/games";

interface GameCardProps {
  game: GameMeta;
  icon: LucideIcon;
  index: number;
}

export default function GameCard({ game, icon: Icon, index }: GameCardProps) {
  const router = useRouter();

  return (
    <motion.button
      onClick={() => router.push(game.path)}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.97 }}
      className="group relative flex flex-col items-start gap-4 rounded-3xl border-2 border-nog-black/10 bg-white p-8 text-left shadow-md hover:border-nog-green-600 hover:shadow-xl transition-all cursor-pointer"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-nog-green-800 text-nog-gold-400 group-hover:bg-nog-green-700 transition-colors">
        <Icon size={32} strokeWidth={2.25} />
      </div>
      <div>
        <h3 className="text-2xl font-black text-nog-black">{game.name}</h3>
        <p className="mt-1 text-base font-medium text-nog-black/60">{game.tagline}</p>
      </div>
      <span className="mt-auto text-lg font-bold text-nog-green-700 group-hover:text-nog-green-800">
        Play Now →
      </span>
    </motion.button>
  );
}
