"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface GameTopBarProps {
  title: string;
}

export default function GameTopBar({ title }: GameTopBarProps) {
  const router = useRouter();

  return (
    <div className="mx-auto flex w-full max-w-3xl items-center justify-between pb-8">
      <button
        onClick={() => router.push("/")}
        className="flex items-center gap-2 rounded-xl text-lg font-bold text-nog-black/60 hover:text-nog-green-700 cursor-pointer"
      >
        <ArrowLeft size={22} /> Back to Menu
      </button>
      <h1 className="text-2xl font-black text-nog-black sm:text-3xl">{title}</h1>
      <div className="w-[132px] shrink-0" aria-hidden />
    </div>
  );
}
