export interface Hazard {
  id: string;
  label: string;
  explanation: string;
  /** Position as a percentage (0-100) of the worksite scene. */
  x: number;
  y: number;
  /** Looks safe at a glance — only obvious on close inspection. */
  nearMiss?: boolean;
  enabled: boolean;
}

export const defaultHazards: Hazard[] = [
  {
    id: "h1",
    label: "Worker without chin strap",
    explanation: "A hard hat without its chin strap fastened can fall off during sudden movement or impact.",
    x: 16,
    y: 54,
    enabled: true,
  },
  {
    id: "h2",
    label: "Oil sheen near walkway",
    explanation: "Even a thin sheen of oil creates a serious slip hazard and must be cleaned up immediately.",
    x: 40,
    y: 80,
    enabled: true,
  },
  {
    id: "h3",
    label: "Blocked fire extinguisher",
    explanation: "Fire extinguishers must always be visible and unobstructed for emergency access.",
    x: 8,
    y: 34,
    enabled: true,
  },
  {
    id: "h4",
    label: "Exposed cable partly hidden behind equipment",
    explanation: "A cable tucked behind equipment can still shock or spark — hidden hazards are often overlooked.",
    x: 61,
    y: 28,
    nearMiss: true,
    enabled: true,
  },
  {
    id: "h5",
    label: "Unsecured gas cylinder",
    explanation: "Gas cylinders must be upright and chained to prevent leaks or explosions if knocked over.",
    x: 74,
    y: 66,
    enabled: true,
  },
  {
    id: "h6",
    label: "Worker handling material without gloves",
    explanation: "Gloves protect hands from chemicals, sharp edges and heat during site tasks.",
    x: 27,
    y: 44,
    enabled: true,
  },
  {
    id: "h7",
    label: "Loose hose across walkway",
    explanation: "Loose hoses across walkways should be secured or routed away from foot traffic.",
    x: 52,
    y: 84,
    enabled: true,
  },
  {
    id: "h8",
    label: "Small leak under valve",
    explanation: "Even a small leak risks product loss and fire hazard — it must be reported and shut off.",
    x: 86,
    y: 40,
    enabled: true,
  },
  {
    id: "h9",
    label: "Smoking sign ignored near flammable area",
    explanation: "Smoking is strictly prohibited near flammable materials and designated hazard zones.",
    x: 64,
    y: 58,
    enabled: true,
  },
  {
    id: "h10",
    label: "Poor housekeeping beside access route",
    explanation: "Cluttered work areas increase trip hazards — tools and debris must be kept tidy.",
    x: 12,
    y: 72,
    enabled: true,
  },
  {
    id: "h11",
    label: "Missing barricade around work area",
    explanation: "Active work areas must be barricaded to keep uninvolved personnel at a safe distance.",
    x: 45,
    y: 50,
    enabled: true,
  },
  {
    id: "h12",
    label: "No spill kit nearby",
    explanation: "A spill kit must be within reach of any area handling liquids or chemicals.",
    x: 30,
    y: 66,
    enabled: true,
  },
  {
    id: "h13",
    label: "Ladder not secured",
    explanation: "An unsecured ladder looks fine standing still but can slip or tip under load.",
    x: 70,
    y: 50,
    nearMiss: true,
    enabled: true,
  },
  {
    id: "h14",
    label: "Worker standing under suspended load",
    explanation: "Never stand beneath a suspended load — a dropped or swinging load can cause fatal injury.",
    x: 55,
    y: 35,
    enabled: true,
  },
  {
    id: "h15",
    label: "Permit board missing signature",
    explanation: "An unsigned permit board looks routine but means work may be proceeding without authorization.",
    x: 90,
    y: 70,
    nearMiss: true,
    enabled: true,
  },
];

export interface DecoySpot {
  id: string;
  x: number;
  y: number;
}

/** Clickable but harmless-looking spots that cost points if clicked — used at Medium/Hard difficulty. */
export const decoySpots: DecoySpot[] = [
  { id: "d1", x: 20, y: 25 },
  { id: "d2", x: 50, y: 45 },
  { id: "d3", x: 68, y: 80 },
  { id: "d4", x: 35, y: 30 },
  { id: "d5", x: 80, y: 55 },
  { id: "d6", x: 25, y: 60 },
  { id: "d7", x: 58, y: 68 },
  { id: "d8", x: 10, y: 45 },
];

export type HazardDifficulty = "easy" | "medium" | "hard";

export const DIFFICULTY_SETTINGS: Record<HazardDifficulty, { hazardCount: number; decoyCount: number; mildClues: boolean }> = {
  easy: { hazardCount: 10, decoyCount: 0, mildClues: true },
  medium: { hazardCount: 12, decoyCount: 4, mildClues: false },
  hard: { hazardCount: 15, decoyCount: 8, mildClues: false },
};
