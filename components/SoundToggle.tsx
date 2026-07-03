"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useSettings, updateSettings } from "@/lib/store";

export default function SoundToggle() {
  const { soundEnabled } = useSettings();

  function toggle() {
    updateSettings({ soundEnabled: !soundEnabled });
  }

  return (
    <button
      onClick={toggle}
      aria-label={soundEnabled ? "Mute sound" : "Unmute sound"}
      aria-pressed={soundEnabled}
      className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-nog-black/10 bg-white shadow-sm hover:border-nog-green-600 hover:text-nog-green-700 transition-colors cursor-pointer"
    >
      {soundEnabled ? <Volume2 size={22} strokeWidth={2.25} /> : <VolumeX size={22} strokeWidth={2.25} />}
    </button>
  );
}
