"use client";

import {
  HardHat,
  Droplet,
  Flame,
  Zap,
  Container,
  Hand,
  Cable,
  Droplets,
  Cigarette,
  Trash2,
  Check,
  X as XIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Hazard } from "@/data/hazards";

const HAZARD_ICONS: Record<string, LucideIcon> = {
  h1: HardHat,
  h2: Droplet,
  h3: Flame,
  h4: Zap,
  h5: Container,
  h6: Hand,
  h7: Cable,
  h8: Droplets,
  h9: Cigarette,
  h10: Trash2,
};

interface HazardSceneProps {
  hazards: Hazard[];
  found: Set<string>;
  missed: Set<string>;
  onHazardClick: (id: string) => void;
  onBackgroundClick: () => void;
}

export default function HazardScene({ hazards, found, missed, onHazardClick, onBackgroundClick }: HazardSceneProps) {
  return (
    <div
      onClick={onBackgroundClick}
      className="relative aspect-[5/3] w-full overflow-hidden rounded-3xl border-2 border-nog-black/10 shadow-md"
    >
      <svg viewBox="0 0 1000 600" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
        <rect width="1000" height="600" fill="#eaf6ef" />
        <rect y="420" width="1000" height="180" fill="#cfe8d6" />
        <rect y="480" width="1000" height="60" fill="#b9c2c4" />
        <polygon points="120,420 150,180 180,420" fill="none" stroke="#0a5c3a" strokeWidth="8" />
        <line x1="120" y1="300" x2="180" y2="300" stroke="#0a5c3a" strokeWidth="6" />
        <line x1="130" y1="360" x2="170" y2="360" stroke="#0a5c3a" strokeWidth="6" />
        <circle cx="820" cy="360" r="55" fill="#0d7a48" opacity="0.25" />
        <rect x="765" y="360" width="110" height="60" fill="#0d7a48" opacity="0.25" />
        <circle cx="900" cy="380" r="40" fill="#c99a2e" opacity="0.2" />
        <rect x="860" y="380" width="80" height="45" fill="#c99a2e" opacity="0.2" />
        <rect x="400" y="380" width="140" height="8" fill="#9aa6a8" />
        <rect x="600" y="330" width="10" height="90" fill="#171a18" opacity="0.3" />
        <polygon points="580,330 630,330 605,300" fill="#171a18" opacity="0.3" />
      </svg>

      {hazards.map((hazard) => {
        const Icon = HAZARD_ICONS[hazard.id] ?? Droplet;
        const isFound = found.has(hazard.id);
        const isMissed = missed.has(hazard.id);
        return (
          <button
            key={hazard.id}
            onClick={(e) => {
              e.stopPropagation();
              onHazardClick(hazard.id);
            }}
            disabled={isFound}
            style={{ left: `${hazard.x}%`, top: `${hazard.y}%` }}
            className={`absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 shadow-lg transition-colors sm:h-14 sm:w-14 ${
              isFound
                ? "border-nog-green-600 bg-nog-green-600 text-white"
                : isMissed
                  ? "border-red-500 bg-red-500 text-white"
                  : "animate-pulse border-nog-gold-500 bg-white/90 text-nog-gold-700 hover:scale-110 cursor-pointer"
            }`}
            aria-label={hazard.label}
          >
            {isFound ? <Check size={22} /> : isMissed ? <XIcon size={22} /> : <Icon size={22} />}
          </button>
        );
      })}
    </div>
  );
}
