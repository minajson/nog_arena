export interface GameSettings {
  soundEnabled: boolean;
  backgroundVideoEnabled: boolean;

  buzzTimePerQuestion: number;
  buzzNumberOfQuestions: number;
  buzzWarningThreshold: number;
  buzzPointsPerCorrect: number;

  spinNumberOfChallenges: number;

  pipelineTimePerPlayer: number;
  pipelineWarningThreshold: number;

  hazardTimePerPlayer: number;
  hazardWarningThreshold: number;
  hazardNumberOfHazards: number;

  pressureTimePerPlayer: number;
  pressureWarningThreshold: number;
  pressureNumberOfScenarios: number;
}

export const defaultGameSettings: GameSettings = {
  soundEnabled: true,
  backgroundVideoEnabled: false,

  buzzTimePerQuestion: 20,
  buzzNumberOfQuestions: 10,
  buzzWarningThreshold: 15,
  buzzPointsPerCorrect: 1,

  spinNumberOfChallenges: 15,

  pipelineTimePerPlayer: 90,
  pipelineWarningThreshold: 15,

  hazardTimePerPlayer: 60,
  hazardWarningThreshold: 15,
  hazardNumberOfHazards: 10,

  pressureTimePerPlayer: 45,
  pressureWarningThreshold: 15,
  pressureNumberOfScenarios: 8,
};

export type NumericSettingKey = Exclude<keyof GameSettings, "soundEnabled" | "backgroundVideoEnabled">;

export interface SettingField {
  key: NumericSettingKey;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  game: string;
}

export const SETTINGS_FIELDS: SettingField[] = [
  { key: "buzzTimePerQuestion", label: "Time per question", unit: "sec", min: 5, max: 60, step: 5, game: "Buzz and Drill" },
  { key: "buzzNumberOfQuestions", label: "Number of questions", unit: "qs", min: 3, max: 30, step: 1, game: "Buzz and Drill" },
  { key: "buzzWarningThreshold", label: "Warning sound threshold", unit: "sec left", min: 3, max: 30, step: 1, game: "Buzz and Drill" },
  { key: "buzzPointsPerCorrect", label: "Points per correct answer", unit: "pts", min: 1, max: 10, step: 1, game: "Buzz and Drill" },

  { key: "spinNumberOfChallenges", label: "Number of wheel segments", unit: "segments", min: 4, max: 20, step: 1, game: "Spin & Spark" },

  { key: "pipelineTimePerPlayer", label: "Time per player", unit: "sec", min: 30, max: 180, step: 10, game: "Pipeline Puzzle" },
  { key: "pipelineWarningThreshold", label: "Warning sound threshold", unit: "sec left", min: 3, max: 30, step: 1, game: "Pipeline Puzzle" },

  { key: "hazardTimePerPlayer", label: "Time per player", unit: "sec", min: 20, max: 180, step: 10, game: "Hazard Hunt" },
  { key: "hazardWarningThreshold", label: "Warning sound threshold", unit: "sec left", min: 3, max: 30, step: 1, game: "Hazard Hunt" },
  { key: "hazardNumberOfHazards", label: "Number of hazards", unit: "hazards", min: 3, max: 10, step: 1, game: "Hazard Hunt" },

  { key: "pressureTimePerPlayer", label: "Time per player", unit: "sec", min: 15, max: 120, step: 5, game: "Pressure Point" },
  { key: "pressureWarningThreshold", label: "Warning sound threshold", unit: "sec left", min: 3, max: 30, step: 1, game: "Pressure Point" },
  { key: "pressureNumberOfScenarios", label: "Number of scenarios", unit: "scenarios", min: 2, max: 8, step: 1, game: "Pressure Point" },
];
