export type GameId =
  | "buzz-and-drill"
  | "spin-and-spark"
  | "pipeline-puzzle"
  | "hazard-hunt"
  | "pressure-point";

export interface GameMeta {
  id: GameId;
  name: string;
  tagline: string;
  path: string;
}

export const GAMES: GameMeta[] = [
  {
    id: "buzz-and-drill",
    name: "Buzz and Drill",
    tagline: "Fast-paced oil & gas trivia buzzer round",
    path: "/games/buzz-and-drill",
  },
  {
    id: "spin-and-spark",
    name: "Spin & Spark",
    tagline: "Spin the wheel for challenges, tasks and surprises",
    path: "/games/spin-and-spark",
  },
  {
    id: "pipeline-puzzle",
    name: "Pipeline Puzzle",
    tagline: "Drag the pieces to connect the pipeline route",
    path: "/games/pipeline-puzzle",
  },
  {
    id: "hazard-hunt",
    name: "Hazard Hunt",
    tagline: "Spot the safety hazards on site",
    path: "/games/hazard-hunt",
  },
  {
    id: "pressure-point",
    name: "Pressure Point",
    tagline: "Make the right call under pressure",
    path: "/games/pressure-point",
  },
];
