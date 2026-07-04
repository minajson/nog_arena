import { getSettings } from "./storage";

/** Speaks `text` aloud, cancelling any speech already in progress so lines never overlap. */
export function speak(text: string) {
  if (typeof window === "undefined") return;
  if (!window.speechSynthesis) return;
  if (!getSettings().soundEnabled) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 1;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeech() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
}

export const VOICE_LINES = {
  gameStart: "Get ready. Your challenge begins now.",
  correct: "Correct!",
  wrong: "Oops! Try again.",
  hurryUp: "Hurry up. Time is almost over.",
  winner: (name: string) => `Congratulations, ${name}. You are a winner!`,
  tie: "It is a tie. Well done to both players!",
};
