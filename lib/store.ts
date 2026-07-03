"use client";

import { useSyncExternalStore } from "react";
import { defaultGameSettings, type GameSettings } from "@/data/gameSettings";
import { defaultBuzzQuestions, type BuzzQuestion } from "@/data/buzzQuestions";
import { defaultSpinChallenges, type SpinChallenge } from "@/data/spinChallenges";
import { defaultHazards, type Hazard } from "@/data/hazards";
import { defaultScenarios, type Scenario } from "@/data/scenarios";
import { defaultPipelineSequence, type PipelinePieceType } from "@/data/pipelineData";
import * as storage from "./storage";
import type { LeaderboardEntry } from "./storage";

function createStore<T>(getInitial: () => T, persist: (value: T) => void, defaults: T) {
  type Listener = () => void;
  const listeners = new Set<Listener>();
  let snapshot: T | null = null;

  function emitChange() {
    for (const listener of listeners) listener();
  }
  function subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }
  function getSnapshot(): T {
    if (snapshot === null) snapshot = getInitial();
    return snapshot;
  }
  function getServerSnapshot(): T {
    return defaults;
  }
  function set(next: T) {
    snapshot = next;
    persist(next);
    emitChange();
  }
  function reset() {
    set(structuredClone(defaults));
  }
  function refresh() {
    snapshot = null;
    emitChange();
  }
  function useValue(): T {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  }
  return { useValue, set, reset, refresh, getSnapshot };
}

const settingsStore = createStore(storage.getSettings, storage.saveSettings, defaultGameSettings);
const buzzStore = createStore(storage.getBuzzQuestions, storage.saveBuzzQuestions, defaultBuzzQuestions);
const spinStore = createStore(storage.getSpinChallenges, storage.saveSpinChallenges, defaultSpinChallenges);
const hazardStore = createStore(storage.getHazards, storage.saveHazards, defaultHazards);
const scenarioStore = createStore(storage.getScenarios, storage.saveScenarios, defaultScenarios);
const pipelineStore = createStore(storage.getPipelineSequence, storage.savePipelineSequence, defaultPipelineSequence);
const leaderboardStore = createStore(storage.getLeaderboard, storage.saveLeaderboard, [] as LeaderboardEntry[]);

export function useSettings(): GameSettings {
  return settingsStore.useValue();
}
export function updateSettings(patch: Partial<GameSettings>) {
  settingsStore.set({ ...settingsStore.getSnapshot(), ...patch });
}
export function resetSettingsToDefaults() {
  settingsStore.reset();
}

export function useBuzzQuestions(): BuzzQuestion[] {
  return buzzStore.useValue();
}
export function setBuzzQuestions(next: BuzzQuestion[]) {
  buzzStore.set(next);
}
export function resetBuzzQuestions() {
  buzzStore.reset();
}

export function useSpinChallenges(): SpinChallenge[] {
  return spinStore.useValue();
}
export function setSpinChallenges(next: SpinChallenge[]) {
  spinStore.set(next);
}
export function resetSpinChallenges() {
  spinStore.reset();
}

export function useHazards(): Hazard[] {
  return hazardStore.useValue();
}
export function setHazards(next: Hazard[]) {
  hazardStore.set(next);
}
export function resetHazards() {
  hazardStore.reset();
}

export function useScenarios(): Scenario[] {
  return scenarioStore.useValue();
}
export function setScenarios(next: Scenario[]) {
  scenarioStore.set(next);
}
export function resetScenarios() {
  scenarioStore.reset();
}

export function usePipelineSequence(): PipelinePieceType[] {
  return pipelineStore.useValue();
}
export function setPipelineSequence(next: PipelinePieceType[]) {
  pipelineStore.set(next);
}
export function resetPipelineSequence() {
  pipelineStore.reset();
}

export function useLeaderboard(): LeaderboardEntry[] {
  return leaderboardStore.useValue();
}
export function addLeaderboardEntry(entry: LeaderboardEntry) {
  leaderboardStore.set(storage.addLeaderboardEntry(entry));
}
export function clearLeaderboard() {
  leaderboardStore.set([]);
}

export function exportAllData() {
  return storage.exportAllData();
}

export function importAllData(data: Partial<storage.ExportedData>) {
  storage.importAllData(data);
  settingsStore.refresh();
  buzzStore.refresh();
  spinStore.refresh();
  hazardStore.refresh();
  scenarioStore.refresh();
  pipelineStore.refresh();
}
