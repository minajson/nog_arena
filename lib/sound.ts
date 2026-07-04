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
  | "hint"
  | "spin";

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
  spin: "/sounds/tick.wav",
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

/** Loops a sound (e.g. a whirring wheel) until stopSound() is called for the same name. */
export function playLoopingSound(name: SoundName, { volume = 1, rate = 1 }: { volume?: number; rate?: number } = {}) {
  if (typeof window === "undefined") return;
  if (!getSettings().soundEnabled) return;
  const howl = getHowl(name);
  howl.loop(true);
  howl.rate(rate);
  howl.volume(volume);
  howl.play();
}

export function stopSound(name: SoundName) {
  if (typeof window === "undefined") return;
  const howl = getHowl(name);
  howl.loop(false);
  howl.stop();
  howl.volume(1);
  howl.rate(1);
}
