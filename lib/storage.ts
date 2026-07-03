import { defaultGameSettings, type GameSettings } from "@/data/gameSettings";
import { defaultBuzzQuestions, type BuzzQuestion } from "@/data/buzzQuestions";
import { defaultSpinChallenges, type SpinChallenge } from "@/data/spinChallenges";
import { defaultHazards, type Hazard } from "@/data/hazards";
import { defaultScenarios, type Scenario } from "@/data/scenarios";
import { defaultPipelineSequence, type PipelinePieceType } from "@/data/pipelineData";

const KEYS = {
  settings: "nog-arena:settings",
  buzzQuestions: "nog-arena:buzz-questions",
  spinChallenges: "nog-arena:spin-challenges",
  hazards: "nog-arena:hazards",
  scenarios: "nog-arena:scenarios",
  pipelineSequence: "nog-arena:pipeline-sequence",
  leaderboard: "nog-arena:leaderboard",
} as const;

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export interface LeaderboardEntry {
  id: string;
  game: string;
  winner: string;
  score: number;
  tie: boolean;
  timestamp: number;
}

export function getSettings(): GameSettings {
  return { ...defaultGameSettings, ...readJSON(KEYS.settings, defaultGameSettings) };
}
export function saveSettings(settings: GameSettings) {
  writeJSON(KEYS.settings, settings);
}

export function getBuzzQuestions(): BuzzQuestion[] {
  return readJSON(KEYS.buzzQuestions, defaultBuzzQuestions);
}
export function saveBuzzQuestions(questions: BuzzQuestion[]) {
  writeJSON(KEYS.buzzQuestions, questions);
}

export function getSpinChallenges(): SpinChallenge[] {
  return readJSON(KEYS.spinChallenges, defaultSpinChallenges);
}
export function saveSpinChallenges(challenges: SpinChallenge[]) {
  writeJSON(KEYS.spinChallenges, challenges);
}

export function getHazards(): Hazard[] {
  return readJSON(KEYS.hazards, defaultHazards);
}
export function saveHazards(hazards: Hazard[]) {
  writeJSON(KEYS.hazards, hazards);
}

export function getScenarios(): Scenario[] {
  return readJSON(KEYS.scenarios, defaultScenarios);
}
export function saveScenarios(scenarios: Scenario[]) {
  writeJSON(KEYS.scenarios, scenarios);
}

export function getPipelineSequence(): PipelinePieceType[] {
  return readJSON(KEYS.pipelineSequence, defaultPipelineSequence);
}
export function savePipelineSequence(sequence: PipelinePieceType[]) {
  writeJSON(KEYS.pipelineSequence, sequence);
}

export function getLeaderboard(): LeaderboardEntry[] {
  return readJSON(KEYS.leaderboard, [] as LeaderboardEntry[]);
}
export function saveLeaderboard(entries: LeaderboardEntry[]) {
  writeJSON(KEYS.leaderboard, entries);
}
export function addLeaderboardEntry(entry: LeaderboardEntry) {
  const next = [entry, ...getLeaderboard()].slice(0, 50);
  saveLeaderboard(next);
  return next;
}

export interface ExportedData {
  settings: GameSettings;
  buzzQuestions: BuzzQuestion[];
  spinChallenges: SpinChallenge[];
  hazards: Hazard[];
  scenarios: Scenario[];
  pipelineSequence: PipelinePieceType[];
}

export function exportAllData(): ExportedData {
  return {
    settings: getSettings(),
    buzzQuestions: getBuzzQuestions(),
    spinChallenges: getSpinChallenges(),
    hazards: getHazards(),
    scenarios: getScenarios(),
    pipelineSequence: getPipelineSequence(),
  };
}

export function importAllData(data: Partial<ExportedData>) {
  if (data.settings) saveSettings({ ...defaultGameSettings, ...data.settings });
  if (data.buzzQuestions) saveBuzzQuestions(data.buzzQuestions);
  if (data.spinChallenges) saveSpinChallenges(data.spinChallenges);
  if (data.hazards) saveHazards(data.hazards);
  if (data.scenarios) saveScenarios(data.scenarios);
  if (data.pipelineSequence) savePipelineSequence(data.pipelineSequence);
}
