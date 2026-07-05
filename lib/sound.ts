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
  | "spin"
  // Layered accents — same source files replayed at different volume/rate so
  // they read as distinct mechanical sounds without extra assets.
  | "tickSoft"
  | "lockIn"
  | "spinStop"
  | "hazardFound";

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
  tickSoft: "/sounds/tick.wav",
  lockIn: "/sounds/tick.wav",
  spinStop: "/sounds/tick.wav",
  hazardFound: "/sounds/correct.wav",
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

export function playSound(name: SoundName, opts?: { volume?: number; rate?: number }) {
  if (typeof window === "undefined") return;
  if (!getSettings().soundEnabled) return;
  const howl = getHowl(name);
  const id = howl.play();
  // Per-instance volume/rate so layered accents never affect other plays.
  if (opts?.volume !== undefined) howl.volume(opts.volume, id);
  if (opts?.rate !== undefined) howl.rate(opts.rate, id);
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

/* ---- Spin whoosh (WebAudio) ----
 * A gentle filtered-noise whoosh for the wheel: quiet (~0.2 gain), pitch falls
 * as the wheel decelerates, and it can be cut instantly when the wheel stops.
 * Replaces the old looped tick, which read as harsh/noisy. */

let whooshCtx: AudioContext | null = null;
let whooshGain: GainNode | null = null;
let whooshSrc: AudioBufferSourceNode | null = null;

export function startSpinWhoosh(durationSec = 3.9) {
  if (typeof window === "undefined") return;
  if (!getSettings().soundEnabled) return;
  try {
    stopSpinWhoosh();
    whooshCtx = whooshCtx ?? new AudioContext();
    const ctx = whooshCtx;
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const t0 = ctx.currentTime;

    const buffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.Q.value = 1.4;
    filter.frequency.setValueAtTime(950, t0);
    filter.frequency.exponentialRampToValueAtTime(200, t0 + durationSec);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(0.15, t0 + 0.35);
    gain.gain.linearRampToValueAtTime(0.04, t0 + durationSec);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    src.start();
    src.stop(t0 + durationSec + 0.3);

    whooshSrc = src;
    whooshGain = gain;
  } catch {
    // Audio is a nicety — never let it break the spin.
  }
}

export function stopSpinWhoosh() {
  if (!whooshCtx || !whooshGain) return;
  const t = whooshCtx.currentTime;
  const gain = whooshGain;
  const src = whooshSrc;
  gain.gain.cancelScheduledValues(t);
  gain.gain.setValueAtTime(gain.gain.value, t);
  gain.gain.linearRampToValueAtTime(0, t + 0.12);
  setTimeout(() => {
    try {
      src?.stop();
    } catch {
      /* already stopped */
    }
  }, 180);
  whooshSrc = null;
  whooshGain = null;
}
