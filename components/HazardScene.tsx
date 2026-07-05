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
      className={`relative aspect-5/3 w-full cursor-crosshair overflow-hidden rounded-3xl border-2 transition-colors ${
        tense
          ? "border-red-500/50 shadow-[0_25px_50px_-12px_rgba(10,10,10,0.35),0_0_0_4px_rgba(220,38,38,0.15)]"
          : "border-nog-black/10 shadow-[0_25px_50px_-12px_rgba(10,10,10,0.35)]"
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
        <defs>
          <linearGradient id="hz-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f6fbf8" />
            <stop offset="1" stopColor="#dcefe3" />
          </linearGradient>
          <linearGradient id="hz-ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#cfe4d6" />
            <stop offset="1" stopColor="#b3cdbc" />
          </linearGradient>
          <linearGradient id="hz-walk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#c8d1d3" />
            <stop offset="0.5" stopColor="#a7b3b5" />
            <stop offset="1" stopColor="#8b9799" />
          </linearGradient>
          <linearGradient id="hz-tank" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#7e8b85" />
            <stop offset="0.3" stopColor="#e3eae6" />
            <stop offset="0.6" stopColor="#aab6b0" />
            <stop offset="1" stopColor="#5e6c66" />
          </linearGradient>
          <linearGradient id="hz-tank-gold" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#a9791f" />
            <stop offset="0.35" stopColor="#f2cf5c" />
            <stop offset="0.65" stopColor="#c99a2e" />
            <stop offset="1" stopColor="#8a6216" />
          </linearGradient>
          <linearGradient id="hz-pipe" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#eef2ef" />
            <stop offset="0.45" stopColor="#9fb0a8" />
            <stop offset="1" stopColor="#4d5b54" />
          </linearGradient>
          <linearGradient id="hz-cyl-green" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#0a5c3a" />
            <stop offset="0.4" stopColor="#14ad63" />
            <stop offset="1" stopColor="#063d29" />
          </linearGradient>
          <radialGradient id="hz-sun" cx="0.18" cy="0.12" r="0.5">
            <stop offset="0" stopColor="#fff8dd" stopOpacity="0.9" />
            <stop offset="1" stopColor="#fff8dd" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="hz-vignette" cx="0.5" cy="0.45" r="0.75">
            <stop offset="0.62" stopColor="#04241a" stopOpacity="0" />
            <stop offset="1" stopColor="#04241a" stopOpacity="0.22" />
          </radialGradient>
        </defs>

        {/* sky + light */}
        <rect width="1000" height="600" fill="url(#hz-sky)" />
        <rect width="1000" height="600" fill="url(#hz-sun)" />
        <ellipse cx="700" cy="90" rx="90" ry="22" fill="white" opacity="0.5" />
        <ellipse cx="770" cy="105" rx="60" ry="16" fill="white" opacity="0.4" />
        <ellipse cx="330" cy="70" rx="70" ry="16" fill="white" opacity="0.45" />

        {/* distant skyline (depth layer) */}
        <g opacity="0.13" fill="#0a5c3a">
          <polygon points="330,400 352,250 374,400" />
          <rect x="322" y="392" width="60" height="10" rx="2" />
          <polygon points="480,400 496,290 512,400" />
          <rect x="540" y="340" width="70" height="60" rx="4" />
          <ellipse cx="575" cy="340" rx="35" ry="8" />
        </g>

        {/* ground */}
        <rect y="400" width="1000" height="200" fill="url(#hz-ground)" />
        <line x1="0" y1="400" x2="1000" y2="400" stroke="#8fae9b" strokeWidth="2" opacity="0.6" />

        {/* main derrick with platform */}
        <g>
          <ellipse cx="152" cy="424" rx="78" ry="12" fill="#04241a" opacity="0.15" />
          <rect x="96" y="408" width="112" height="14" rx="4" fill="#3c4441" />
          <polygon points="112,408 150,160 158,160 196,408" fill="none" stroke="#0a5c3a" strokeWidth="9" strokeLinejoin="round" />
          <line x1="122" y1="340" x2="186" y2="340" stroke="#0a5c3a" strokeWidth="6" />
          <line x1="130" y1="280" x2="178" y2="280" stroke="#0a5c3a" strokeWidth="6" />
          <line x1="138" y1="220" x2="170" y2="220" stroke="#0a5c3a" strokeWidth="5" />
          <line x1="122" y1="340" x2="178" y2="280" stroke="#0d7a48" strokeWidth="3.5" />
          <line x1="186" y1="340" x2="130" y2="280" stroke="#0d7a48" strokeWidth="3.5" />
          <line x1="130" y1="280" x2="170" y2="220" stroke="#0d7a48" strokeWidth="3" />
          <line x1="178" y1="280" x2="138" y2="220" stroke="#0d7a48" strokeWidth="3" />
          <rect x="146" y="140" width="16" height="24" rx="3" fill="#0a5c3a" />
          <polygon points="162,144 190,152 162,160" fill="#e0b83c" />
        </g>

        {/* storage tanks (right) */}
        <g>
          <ellipse cx="835" cy="424" rx="70" ry="12" fill="#04241a" opacity="0.16" />
          <rect x="780" y="300" width="110" height="120" fill="url(#hz-tank)" />
          <ellipse cx="835" cy="300" rx="55" ry="14" fill="#d3dcd7" stroke="#7e8b85" strokeWidth="2" />
          <ellipse cx="835" cy="420" rx="55" ry="12" fill="#5e6c66" />
          <line x1="796" y1="312" x2="796" y2="414" stroke="#5e6c66" strokeWidth="3" opacity="0.5" />
          <line x1="806" y1="314" x2="806" y2="416" stroke="#5e6c66" strokeWidth="3" opacity="0.35" />
          <rect x="900" y="330" width="72" height="90" fill="url(#hz-tank-gold)" opacity="0.85" />
          <ellipse cx="936" cy="330" rx="36" ry="10" fill="#f2cf5c" stroke="#a9791f" strokeWidth="2" opacity="0.9" />
          <ellipse cx="936" cy="420" rx="36" ry="9" fill="#8a6216" opacity="0.8" />
        </g>

        {/* elevated pipe run with flanges + valve (leak sits under the valve) */}
        <g>
          <rect x="600" y="228" width="400" height="22" rx="11" fill="url(#hz-pipe)" />
          <rect x="600" y="230" width="400" height="5" rx="2.5" fill="white" opacity="0.4" />
          {[660, 760, 920].map((fx) => (
            <rect key={fx} x={fx} y="222" width="10" height="34" rx="3" fill="#3c4441" />
          ))}
          <circle cx="860" cy="239" r="26" fill="none" stroke="#c99a2e" strokeWidth="6" />
          <line x1="860" y1="215" x2="860" y2="263" stroke="#c99a2e" strokeWidth="5" />
          <line x1="836" y1="239" x2="884" y2="239" stroke="#c99a2e" strokeWidth="5" />
          <circle cx="860" cy="239" r="7" fill="#8a6216" />
          <rect x="854" y="256" width="12" height="26" rx="4" fill="#4d5b54" />
          <path d="M858 284 q2 10 -3 18 q8 -4 10 -14 z" fill="#171a18" opacity="0.7" />
          <ellipse cx="861" cy="308" rx="16" ry="5" fill="#171a18" opacity="0.35" />
          <rect x="600" y="250" width="14" height="160" fill="#5e6c66" />
          <rect x="980" y="250" width="14" height="160" fill="#5e6c66" />
        </g>

        {/* equipment cabinet (cable sneaks out behind it) */}
        <g>
          <ellipse cx="618" cy="214" rx="52" ry="8" fill="#04241a" opacity="0.15" />
          <rect x="576" y="128" width="84" height="84" rx="8" fill="#3c4441" />
          <rect x="576" y="128" width="84" height="10" rx="5" fill="#5e6c66" />
          <rect x="588" y="150" width="60" height="6" rx="3" fill="#9aa6a8" opacity="0.6" />
          <rect x="588" y="164" width="60" height="6" rx="3" fill="#9aa6a8" opacity="0.6" />
          <circle cx="644" cy="196" r="5" fill="#e0b83c" />
          <path d="M660 182 q26 6 30 22 q-18 -4 -30 -10 z" fill="#171a18" opacity="0.55" />
        </g>

        {/* warning sign on post */}
        <g>
          <rect x="446" y="318" width="9" height="94" rx="3" fill="#3c4441" />
          <polygon points="450,268 492,326 408,326" fill="#e0b83c" stroke="#171a18" strokeWidth="5" strokeLinejoin="round" />
          <rect x="447" y="288" width="7" height="20" rx="3" fill="#171a18" />
          <circle cx="450.5" cy="316" r="4" fill="#171a18" />
        </g>

        {/* extinguisher partly blocked by crate */}
        <g>
          <rect x="66" y="176" width="26" height="52" rx="8" fill="#d43f3f" />
          <rect x="72" y="168" width="8" height="12" rx="3" fill="#8b1f1f" />
          <path d="M80 172 q16 2 14 18" fill="none" stroke="#8b1f1f" strokeWidth="4" />
          <rect x="58" y="206" width="52" height="40" rx="4" fill="#c99a2e" opacity="0.9" />
          <line x1="58" y1="226" x2="110" y2="226" stroke="#8a6216" strokeWidth="3" />
          <line x1="84" y1="206" x2="84" y2="246" stroke="#8a6216" strokeWidth="3" />
        </g>

        {/* workers */}
        <g>
          <ellipse cx="160" cy="368" rx="24" ry="6" fill="#04241a" opacity="0.18" />
          <circle cx="160" cy="300" r="13" fill="#e8b98a" />
          <path d="M145 298 a15 12 0 0 1 30 0 z" fill="#e0b83c" />
          <rect x="146" y="312" width="28" height="38" rx="10" fill="#0d7a48" />
          <rect x="149" y="348" width="9" height="22" rx="4" fill="#3c4441" />
          <rect x="163" y="348" width="9" height="22" rx="4" fill="#3c4441" />
          <rect x="140" y="318" width="8" height="24" rx="4" fill="#0a5c3a" />
          <rect x="173" y="318" width="8" height="24" rx="4" fill="#0a5c3a" />
        </g>
        <g>
          <ellipse cx="272" cy="312" rx="22" ry="5" fill="#04241a" opacity="0.15" />
          <circle cx="272" cy="248" r="12" fill="#c98e5f" />
          <path d="M258 246 a14 11 0 0 1 28 0 z" fill="#f2cf5c" />
          <rect x="259" y="259" width="26" height="34" rx="9" fill="#0a5c3a" />
          <rect x="262" y="291" width="8" height="20" rx="4" fill="#3c4441" />
          <rect x="275" y="291" width="8" height="20" rx="4" fill="#3c4441" />
          <rect x="252" y="264" width="8" height="22" rx="4" fill="#063d29" />
          <rect x="285" y="264" width="8" height="22" rx="4" fill="#063d29" />
          <rect x="284" y="282" width="18" height="10" rx="3" fill="#9aa6a8" />
        </g>

        {/* walkway with hazard-stripe edge + railing */}
        <g>
          <rect y="468" width="1000" height="78" fill="url(#hz-walk)" />
          <rect y="468" width="1000" height="8" fill="#e0b83c" />
          <line x1="0" y1="472" x2="1000" y2="472" stroke="#171a18" strokeWidth="8" strokeDasharray="26 26" />
          <rect y="540" width="1000" height="8" fill="#6d7a7c" />
          {[80, 280, 480, 680, 880].map((px) => (
            <rect key={px} x={px} y="430" width="7" height="40" rx="2" fill="#5e6c66" />
          ))}
          <line x1="0" y1="434" x2="1000" y2="434" stroke="#5e6c66" strokeWidth="5" />
        </g>

        {/* oil sheen on walkway */}
        <g>
          <ellipse cx="400" cy="486" rx="52" ry="12" fill="#171a18" opacity="0.32" />
          <ellipse cx="388" cy="483" rx="24" ry="6" fill="#0d7a48" opacity="0.35" />
          <ellipse cx="416" cy="489" rx="16" ry="4" fill="#c99a2e" opacity="0.3" />
        </g>

        {/* loose hose across walkway */}
        <path d="M455 545 q45 -48 100 -38 q60 10 95 34" fill="none" stroke="#063d29" strokeWidth="9" strokeLinecap="round" opacity="0.85" />
        <path d="M455 545 q45 -48 100 -38 q60 10 95 34" fill="none" stroke="#14ad63" strokeWidth="3" strokeLinecap="round" opacity="0.5" />

        {/* unsecured gas cylinders */}
        <g>
          <ellipse cx="745" cy="432" rx="34" ry="7" fill="#04241a" opacity="0.18" />
          <rect x="722" y="356" width="22" height="72" rx="9" fill="url(#hz-cyl-green)" transform="rotate(-7 733 392)" />
          <rect x="728" y="348" width="8" height="12" rx="3" fill="#3c4441" transform="rotate(-7 733 392)" />
          <rect x="748" y="360" width="22" height="70" rx="9" fill="url(#hz-tank-gold)" />
          <rect x="755" y="352" width="8" height="12" rx="3" fill="#3c4441" />
        </g>

        {/* foreground barrels + cone (nearest layer) */}
        <g>
          <ellipse cx="205" cy="576" rx="72" ry="12" fill="#04241a" opacity="0.2" />
          <rect x="150" y="500" width="52" height="72" rx="8" fill="url(#hz-cyl-green)" />
          <ellipse cx="176" cy="500" rx="26" ry="8" fill="#14ad63" stroke="#063d29" strokeWidth="2" />
          <line x1="150" y1="524" x2="202" y2="524" stroke="#04241a" strokeWidth="3" opacity="0.4" />
          <line x1="150" y1="548" x2="202" y2="548" stroke="#04241a" strokeWidth="3" opacity="0.4" />
          <rect x="208" y="512" width="46" height="62" rx="7" fill="url(#hz-tank-gold)" />
          <ellipse cx="231" cy="512" rx="23" ry="7" fill="#f2cf5c" stroke="#8a6216" strokeWidth="2" />
          <line x1="208" y1="534" x2="254" y2="534" stroke="#8a6216" strokeWidth="3" opacity="0.5" />
        </g>
        <g>
          <ellipse cx="660" cy="580" rx="26" ry="6" fill="#04241a" opacity="0.2" />
          <polygon points="660,528 678,578 642,578" fill="#e07b3c" />
          <rect x="648" y="548" width="24" height="8" fill="white" opacity="0.85" />
          <rect x="636" y="576" width="48" height="7" rx="3" fill="#c05e28" />
        </g>

        {/* light sweep + vignette for depth */}
        <polygon points="0,0 420,0 0,300" fill="white" opacity="0.14" />
        <rect width="1000" height="600" fill="url(#hz-vignette)" />
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
                ? "flex items-center justify-center cursor-default border-2 border-nog-gold-400 bg-linear-to-b from-nog-green-500 to-nog-green-800 shadow-[0_0_18px_rgba(20,173,99,0.8),0_4px_8px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.4)]"
                : isHinted
                  ? "animate-pulse bg-nog-gold-400/25 ring-4 ring-nog-gold-400"
                  : mildClues
                    ? "cursor-pointer border border-white/40 bg-white/10 opacity-60 backdrop-blur-[1px] hover:bg-nog-gold-400/25 hover:opacity-100 hover:ring-2 hover:ring-nog-gold-400"
                    : "cursor-pointer border border-white/25 bg-white/[0.06] opacity-40 backdrop-blur-[1px] hover:bg-white/20 hover:opacity-100 hover:ring-2 hover:ring-nog-gold-400"
            }`}
            aria-label={isFound ? hazard.label : "hidden hotspot"}
          >
            {isFound && (
              <motion.span
                initial={{ scale: 0, rotate: -30, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 14 }}
              >
                <Icon
                  size={hazard.nearMiss ? 18 : 22}
                  className="text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]"
                  strokeWidth={2.25}
                />
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
          className="absolute h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full border border-white/25 bg-white/[0.06] opacity-40 backdrop-blur-[1px] transition-all hover:bg-white/20 hover:opacity-100 hover:ring-2 hover:ring-nog-gold-400"
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
            {m.correct && (
              <>
                {[0, 1].map((ring) => (
                  <motion.span
                    key={ring}
                    initial={{ opacity: 0.6, scale: 0.3 }}
                    animate={{ opacity: 0, scale: 2.4 }}
                    transition={{ duration: 0.7, delay: ring * 0.1, ease: "easeOut" }}
                    className="absolute inset-0 -m-4 rounded-full border-2 border-nog-gold-400"
                  />
                ))}
                {Array.from({ length: 10 }, (_, p) => {
                  const angle = (p * 2 * Math.PI) / 10;
                  return (
                    <motion.span
                      key={`p${p}`}
                      initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                      animate={{
                        opacity: 0,
                        x: Math.cos(angle) * 52,
                        y: Math.sin(angle) * 52,
                        scale: 0.3,
                      }}
                      transition={{ duration: 0.65, ease: "easeOut" }}
                      className={`absolute h-2.5 w-2.5 rounded-full ${
                        p % 2 === 0 ? "bg-nog-green-500" : "bg-nog-gold-400"
                      } shadow-[0_0_8px_rgba(20,173,99,0.7)]`}
                    />
                  );
                })}
              </>
            )}
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
