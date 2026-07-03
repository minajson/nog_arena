export interface Hazard {
  id: string;
  label: string;
  explanation: string;
  /** Position as a percentage (0-100) of the worksite scene. */
  x: number;
  y: number;
  enabled: boolean;
}

export const defaultHazards: Hazard[] = [
  {
    id: "h1",
    label: "Worker without helmet",
    explanation: "Every worker on site must wear a hard hat to protect against falling objects.",
    x: 16,
    y: 54,
    enabled: true,
  },
  {
    id: "h2",
    label: "Oil spill on walkway",
    explanation: "Spills must be barricaded and cleaned immediately to prevent slips and fire risk.",
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
    label: "Open electrical cable",
    explanation: "Exposed wiring can cause shocks or sparks — it must be insulated and inspected.",
    x: 61,
    y: 28,
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
    label: "Worker without gloves",
    explanation: "Gloves protect hands from chemicals, sharp edges and heat during site tasks.",
    x: 27,
    y: 44,
    enabled: true,
  },
  {
    id: "h7",
    label: "Trip hazard from loose hose",
    explanation: "Loose hoses across walkways should be secured or routed away from foot traffic.",
    x: 52,
    y: 84,
    enabled: true,
  },
  {
    id: "h8",
    label: "Leaking valve",
    explanation: "Leaking valves risk product loss and fire hazard — they must be reported and shut off.",
    x: 86,
    y: 40,
    enabled: true,
  },
  {
    id: "h9",
    label: "Smoking near flammable area",
    explanation: "Smoking is strictly prohibited near flammable materials and designated hazard zones.",
    x: 64,
    y: 58,
    enabled: true,
  },
  {
    id: "h10",
    label: "Poor housekeeping",
    explanation: "Cluttered work areas increase trip hazards — tools and debris must be kept tidy.",
    x: 12,
    y: 72,
    enabled: true,
  },
];
