"use client";

/** Decorative industrial layer for hero screens: floating metallic pipes along
 * the edges, slowly turning gears, sweeping pressure gauges, green energy
 * flowing through pipe runs, and rising light particles. Pure CSS animations
 * (globals.css) — pointer-events off, purely aesthetic.
 *
 * tone="onDark" sits over video/dark surfaces (brighter strokes, glow);
 * tone="onLight" is a quieter dose for white pages like the menu. */

interface IndustrialAmbienceProps {
  tone?: "onDark" | "onLight";
}

const PARTICLES = [
  { left: "6%", size: 5, duration: 8, delay: 0 },
  { left: "14%", size: 4, duration: 11, delay: 2.2 },
  { left: "28%", size: 6, duration: 9, delay: 4.1 },
  { left: "43%", size: 4, duration: 12, delay: 1.4 },
  { left: "58%", size: 5, duration: 10, delay: 3.3 },
  { left: "72%", size: 4, duration: 9, delay: 5.2 },
  { left: "84%", size: 6, duration: 11, delay: 0.8 },
  { left: "93%", size: 4, duration: 8, delay: 2.9 },
];

function Gear({ className, teeth = 8 }: { className?: string; teeth?: number }) {
  const spokes = Array.from({ length: teeth }, (_, i) => (i * 360) / teeth);
  return (
    <svg viewBox="-50 -50 100 100" className={className} fill="none" stroke="currentColor">
      {spokes.map((deg) => (
        <rect key={deg} x="-6" y="-48" width="12" height="14" rx="3" fill="currentColor" stroke="none" transform={`rotate(${deg})`} />
      ))}
      <circle r="34" strokeWidth="10" />
      <circle r="12" strokeWidth="6" />
    </svg>
  );
}

function PressureGauge({ className }: { className?: string }) {
  return (
    <div className={`relative ${className ?? ""}`}>
      <svg viewBox="0 0 100 100" className="h-full w-full" fill="none" stroke="currentColor">
        <circle cx="50" cy="50" r="44" strokeWidth="5" />
        <circle cx="50" cy="50" r="36" strokeWidth="1.5" opacity="0.5" strokeDasharray="2 9" />
        {[-60, -30, 0, 30, 60].map((deg) => (
          <line key={deg} x1="50" y1="14" x2="50" y2="22" strokeWidth="3" transform={`rotate(${deg} 50 50)`} />
        ))}
        <circle cx="50" cy="50" r="5" fill="currentColor" stroke="none" />
      </svg>
      <div className="animate-gauge-sweep absolute left-1/2 top-[18%] h-[32%] w-[3.5%] -translate-x-1/2 rounded-full bg-current" />
    </div>
  );
}

/** A metallic pipe segment: gradient body + darker flange rings at both ends. */
function Pipe({ className, style, vertical = false }: { className?: string; style?: React.CSSProperties; vertical?: boolean }) {
  const gradient = vertical
    ? "linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.4) 30%, rgba(255,255,255,0.1) 55%, rgba(0,0,0,0.25))"
    : "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.4) 30%, rgba(255,255,255,0.1) 55%, rgba(0,0,0,0.25))";
  return (
    <div className={`animate-pipe-drift absolute ${className ?? ""}`} style={style}>
      <div
        className={`relative rounded-full ${vertical ? "h-full w-5 sm:w-7" : "h-5 w-full sm:h-7"}`}
        style={{ background: `${gradient}, var(--pipe-base, rgba(120,130,125,0.5))` }}
      >
        <div
          className={`absolute rounded-sm bg-black/30 ${
            vertical ? "inset-x-[-4px] top-[12%] h-2.5" : "inset-y-[-4px] left-[12%] w-2.5"
          }`}
        />
        <div
          className={`absolute rounded-sm bg-black/30 ${
            vertical ? "inset-x-[-4px] bottom-[12%] h-2.5" : "inset-y-[-4px] right-[12%] w-2.5"
          }`}
        />
      </div>
    </div>
  );
}

export default function IndustrialAmbience({ tone = "onDark" }: IndustrialAmbienceProps) {
  const onDark = tone === "onDark";
  const metalColor = onDark ? "text-white/25" : "text-nog-black/12";
  const gaugeColor = onDark ? "text-nog-gold-400/60" : "text-nog-gold-600/40";
  const energyOpacity = onDark ? 0.5 : 0.25;
  const particleColor = onDark ? "rgba(242,207,92,0.8)" : "rgba(15,148,85,0.5)";

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* floating metallic pipes hugging the edges */}
      <Pipe vertical className="left-[2%] top-[8%] h-[38%]" style={{ "--pipe-rot": "-4deg", animationDelay: "0.4s" } as React.CSSProperties} />
      <Pipe vertical className="right-[3%] top-[46%] h-[34%]" style={{ "--pipe-rot": "5deg", animationDelay: "2.1s" } as React.CSSProperties} />
      <Pipe className="left-[6%] bottom-[6%] w-[26%]" style={{ "--pipe-rot": "3deg", animationDelay: "1.2s" } as React.CSSProperties} />
      <Pipe className="right-[5%] top-[7%] w-[22%]" style={{ "--pipe-rot": "-3deg", animationDelay: "3s" } as React.CSSProperties} />

      {/* turning gears */}
      <Gear className={`animate-gear-spin absolute -left-10 -top-10 h-40 w-40 sm:h-56 sm:w-56 ${metalColor}`} teeth={10} />
      <Gear className={`animate-gear-spin-reverse absolute left-24 top-20 hidden h-24 w-24 sm:block sm:h-32 sm:w-32 ${metalColor}`} />
      <Gear className={`animate-gear-spin-reverse absolute -bottom-12 -right-12 h-44 w-44 sm:h-60 sm:w-60 ${metalColor}`} teeth={12} />

      {/* sweeping pressure gauges */}
      <PressureGauge className={`absolute right-[7%] top-[16%] h-16 w-16 sm:h-24 sm:w-24 ${gaugeColor}`} />
      <PressureGauge className={`absolute bottom-[14%] left-[5%] h-14 w-14 sm:h-20 sm:w-20 ${gaugeColor}`} />

      {/* green energy flowing along pipe runs */}
      <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" fill="none">
        <path
          d="M -40 680 C 260 600, 420 760, 720 650 S 1080 520, 1260 590"
          stroke="var(--nog-green-500)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="14 26"
          opacity={energyOpacity}
          className="animate-energy-flow"
        />
        <path
          d="M -40 110 C 240 220, 560 60, 860 170 S 1140 240, 1260 150"
          stroke="var(--nog-green-500)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="10 30"
          opacity={energyOpacity * 0.8}
          className="animate-energy-flow"
          style={{ animationDelay: "-3s" }}
        />
      </svg>

      {/* rising light particles */}
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="animate-particle-rise absolute bottom-[-2%] rounded-full"
          style={
            {
              left: p.left,
              width: p.size,
              height: p.size,
              background: particleColor,
              boxShadow: onDark ? `0 0 ${p.size * 2}px ${particleColor}` : undefined,
              "--rise-duration": `${p.duration}s`,
              "--rise-delay": `${p.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
