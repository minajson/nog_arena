"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface GameTopBarProps {
  title: string;
}

export default function GameTopBar({ title }: GameTopBarProps) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative z-10 mx-auto flex w-[95vw] max-w-350 items-center justify-between pb-2 lg:pb-3"
    >
      <button
        onClick={() => router.push("/menu")}
        className="group flex items-center gap-2 rounded-full border-2 border-transparent px-4 py-2 text-lg font-bold text-nog-black/60 hover:border-nog-black/10 hover:text-nog-green-700 cursor-pointer transition-colors lg:text-xl"
      >
        <ArrowLeft size={22} className="transition-transform group-hover:-translate-x-1 lg:size-7" /> Back to Menu
      </button>
      <h1 className="text-2xl font-black tracking-tight text-nog-black sm:text-3xl lg:text-4xl">{title}</h1>
      <div className="w-33 shrink-0 lg:w-44" aria-hidden />
    </motion.div>
  );
}
