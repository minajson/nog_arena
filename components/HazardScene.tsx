"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  X as XIcon,
  HardHat,
  Droplet,
  Droplets,
  FireExtinguisher,
  Zap,
  Cylinder,
  Hand,
  Footprints,
  Cigarette,
  Trash2,
  Construction,
  Toolbox,
  WavesLadder,
  FishingHook,
  ClipboardList,
  TriangleAlert,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Hazard, DecoySpot } from "@/data/hazards";

/** Maps the default hazard ids to a distinct found-state icon; anything else (admin-added
 * hazards) falls back to a generic warning triangle. */
const HAZARD_ICONS: Record<string, LucideIcon> = {
  h1: HardHat,
  h2: Droplet,
  h3: FireExtinguisher,
  h4: Zap,
  h5: Cylinder,
  h6: Hand,
  h7: Footprints,
  h8: Droplets,
  h9: Cigarette,
  h10: Trash2,
  h11: Construction,
  h12: Toolbox,
  h13: WavesLadder,
  h14: FishingHook,
  h15: ClipboardList,
};

function iconForHazard(id: string): LucideIcon {
  return HAZARD_ICONS[id] ?? TriangleAlert;
}

interface FeedbackMarker {
  key: number;
  x: number;
  y: number;
  correct: boolean;
}

interface HazardSceneProps {
  hazards: Hazard[];
  decoys: DecoySpot[];
  found: Set<string>;
  hintHazardId: string | null;
  mildClues: boolean;
  shake?: boolean;
  tense?: boolean;
  onHazardClick: (id: string, x: number, y: number) => void;
  onDecoyClick: (x: number, y: number) => void;
  onBackgroundMiss: () => void;
}

export default function HazardScene({
  hazards,
  decoys,
  found,
  hintHazardId,
  mildClues,
  shake = false,
  tense = false,
  onHazardClick,
  onDecoyClick,
  onBackgroundMiss,
}: HazardSceneProps) {
  const [markers, setMarkers] = useState<FeedbackMarker[]>([]);
  const keyRef = useRef(0);
  const hintHazard = hazards.find((h) => h.id === hintHazardId);

  function addMarker(x: number, y: number, correct: boolean) {
    const key = keyRef.current++;
    setMarkers((prev) => [...prev, { key, x, y, correct }]);
    setTimeout(() => setMarkers((prev) => prev.filter((m) => m.key !== key)), 850);
  }

  return (
    <motion.div
      onClick={onBackgroundMiss}
      animate={shake ? { x: [0, -10, 10, -10, 10, 0] } : { x: 0 }}
      className={`relative aspect-5/3 w-full cursor-crosshair overflow-hidden rounded-3xl border-2 shadow-md transition-colors ${
        tense ? "border-red-500/50 shadow-[0_0_0_4px_rgba(220,38,38,0.15)]" : "border-nog-black/10"
      }`}
    >
      {hintHazard && (
        <motion.div
          key={hintHazard.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background: `radial-gradient(circle at ${hintHazard.x}% ${hintHazard.y}%, rgba(224,184,60,0.35) 0%, rgba(224,184,60,0.1) 12%, transparent 22%)`,
          }}
        />
      )}
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
        const isFound = found.has(hazard.id);
        const isHinted = hintHazardId === hazard.id;
        const hitSize = hazard.nearMiss ? "h-9 w-9 sm:h-10 sm:w-10" : "h-12 w-12 sm:h-14 sm:w-14";
        const Icon = iconForHazard(hazard.id);
        return (
          <button
            key={hazard.id}
            onClick={(e) => {
              e.stopPropagation();
              if (isFound) return;
              addMarker(hazard.x, hazard.y, true);
              onHazardClick(hazard.id, hazard.x, hazard.y);
            }}
            disabled={isFound}
            style={{ left: `${hazard.x}%`, top: `${hazard.y}%` }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-all ${hitSize} ${
              isFound
                ? "flex items-center justify-center bg-nog-green-600/15 ring-2 ring-nog-green-600 cursor-default"
                : isHinted
                  ? "animate-pulse bg-nog-gold-400/25 ring-4 ring-nog-gold-400"
                  : mildClues
                    ? "cursor-pointer bg-nog-gold-400/10 opacity-50 hover:bg-nog-gold-400/25 hover:opacity-100 hover:ring-2 hover:ring-nog-gold-400"
                    : "cursor-pointer opacity-0 hover:bg-white/20 hover:opacity-100 hover:ring-2 hover:ring-nog-gold-400"
            }`}
            aria-label={isFound ? hazard.label : "hidden hotspot"}
          >
            {isFound && (
              <motion.span
                initial={{ scale: 0, rotate: -30, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 14 }}
              >
                <Icon size={hazard.nearMiss ? 18 : 22} className="text-nog-green-700" strokeWidth={2.25} />
              </motion.span>
            )}
          </button>
        );
      })}

      {decoys.map((decoy) => (
        <button
          key={decoy.id}
          onClick={(e) => {
            e.stopPropagation();
            addMarker(decoy.x, decoy.y, false);
            onDecoyClick(decoy.x, decoy.y);
          }}
          style={{ left: `${decoy.x}%`, top: `${decoy.y}%` }}
          className="absolute h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full opacity-0 transition-all hover:bg-white/10 hover:opacity-100 hover:ring-2 hover:ring-red-300"
          aria-label="decoy"
        />
      ))}

      <AnimatePresence>
        {markers.map((m) => (
          <div
            key={m.key}
            style={{ left: `${m.x}%`, top: `${m.y}%` }}
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
          >
            {m.correct &&
              [0, 1].map((ring) => (
                <motion.span
                  key={ring}
                  initial={{ opacity: 0.6, scale: 0.3 }}
                  animate={{ opacity: 0, scale: 2.4 }}
                  transition={{ duration: 0.7, delay: ring * 0.1, ease: "easeOut" }}
                  className="absolute inset-0 -m-4 rounded-full border-2 border-nog-gold-400"
                />
              ))}
            <motion.div
              initial={{ opacity: 1, scale: 0.6 }}
              animate={{ opacity: 0, scale: 1.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.85 }}
            >
              {m.correct ? (
                <Check className="text-nog-green-600" size={30} />
              ) : (
                <XIcon className="text-red-600" size={30} />
              )}
            </motion.div>
          </div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
