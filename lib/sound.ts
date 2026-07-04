import { Howl } from "howler";
import { getSettings } from "./storage";

export type SoundName =
  | "tick"
  | "warning"
  | "correct"
  | "wrong"
  | "winner"
  | "tryAgain"
  | "celebration"
  | "buzz"
  | "blank"
  | "buzzerEnd"
  | "hint";

const SOUND_SRC: Record<SoundName, string> = {
  tick: "/sounds/tick.wav",
  warning: "/sounds/warning.wav",
  correct: "/sounds/correct.wav",
  wrong: "/sounds/wrong.wav",
  winner: "/sounds/winner.wav",
  tryAgain: "/sounds/wrong.wav",
  celebration: "/sounds/winner.wav",
  buzz: "/sounds/tick.wav",
  blank: "/sounds/wrong.wav",
  buzzerEnd: "/sounds/wrong.wav",
  hint: "/sounds/tick.wav",
};

const cache = new Map<SoundName, Howl>();

function getHowl(name: SoundName): Howl {
  let howl = cache.get(name);
  if (!howl) {
    howl = new Howl({ src: [SOUND_SRC[name]], preload: true });
    cache.set(name, howl);
  }
  return howl;
}

export function playSound(name: SoundName) {
  if (typeof window === "undefined") return;
  if (!getSettings().soundEnabled) return;
  getHowl(name).play();
}
