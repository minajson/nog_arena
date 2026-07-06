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
  spinUsed: "nog-arena:spin-used",
  scenariosUsed: "nog-arena:scenarios-used",
  contentVersion: "nog-arena:content-version",
} as const;

/** Bumped whenever the default question/challenge banks are rewritten, so
 * browsers holding an older saved copy pick up the fresh content. Clears the
 * saved banks once (admin edits made before the bump are discarded). */
const CONTENT_VERSION = "3";

let contentVersionChecked = false;
function ensureContentVersion() {
  if (typeof window === "undefined" || contentVersionChecked) return;
  contentVersionChecked = true;
  if (window.localStorage.getItem(KEYS.contentVersion) === CONTENT_VERSION) return;
  window.localStorage.removeItem(KEYS.buzzQuestions);
  window.localStorage.removeItem(KEYS.spinChallenges);
  window.localStorage.removeItem(KEYS.scenarios);
  window.localStorage.removeItem(KEYS.spinUsed);
  window.localStorage.removeItem(KEYS.scenariosUsed);
  window.localStorage.setItem(KEYS.contentVersion, CONTENT_VERSION);
}

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
  ensureContentVersion();
  return readJSON(KEYS.buzzQuestions, defaultBuzzQuestions);
}
export function saveBuzzQuestions(questions: BuzzQuestion[]) {
  writeJSON(KEYS.buzzQuestions, questions);
}

export function getSpinChallenges(): SpinChallenge[] {
  ensureContentVersion();
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
  ensureContentVersion();
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

/* ---- Spin & Spark no-repeat pool ----
 * Landed challenges are remembered across the whole event so the wheel never
 * repeats one, until a facilitator explicitly resets the pool. */

export function getUsedSpinChallengeIds(): string[] {
  ensureContentVersion();
  return readJSON(KEYS.spinUsed, [] as string[]);
}
export function saveUsedSpinChallengeIds(ids: string[]) {
  writeJSON(KEYS.spinUsed, ids);
}
export function clearUsedSpinChallengeIds() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEYS.spinUsed);
}

/* ---- Pressure Point no-repeat pool ----
 * Ids of scenarios already SHOWN to any player, across games. A question only
 * counts as used once it has actually appeared on screen. */

export function getUsedScenarioIds(): string[] {
  ensureContentVersion();
  return readJSON(KEYS.scenariosUsed, [] as string[]);
}
export function saveUsedScenarioIds(ids: string[]) {
  writeJSON(KEYS.scenariosUsed, ids);
}

/** Round-robin cursor for question packs: returns the current pack index and
 * advances it, so consecutive games draw from different packs. */
export function nextPackIndex(cursorName: string, packCount: number): number {
  if (typeof window === "undefined" || packCount <= 0) return 0;
  const key = `nog-arena:${cursorName}`;
  const current = (Number(window.localStorage.getItem(key)) || 0) % packCount;
  window.localStorage.setItem(key, String((current + 1) % packCount));
  return current;
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
