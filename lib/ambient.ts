/** Low industrial hum synthesized with WebAudio — no audio file needed.
 * Two detuned low oscillators through a lowpass filter, with a slow LFO
 * "breathing" the gain so it feels like distant machinery, kept very quiet
 * so it never competes with game sounds or the announcer voice. */

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let running = false;

const HUM_VOLUME = 0.035;

export function startAmbientHum() {
  if (typeof window === "undefined" || running) return;
  try {
    ctx = ctx ?? new AudioContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});

    masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(HUM_VOLUME, ctx.currentTime + 2.5);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 220;
    filter.connect(masterGain);
    masterGain.connect(ctx.destination);

    for (const [freq, type] of [
      [52, "sawtooth"],
      [104.5, "triangle"],
    ] as const) {
      const osc = ctx.createOscillator();
      osc.type = type;
      osc.frequency.value = freq;
      const oscGain = ctx.createGain();
      oscGain.gain.value = freq < 60 ? 1 : 0.35;
      osc.connect(oscGain);
      oscGain.connect(filter);
      osc.start();
    }

    // Slow breathing so the hum never reads as a flat test tone
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.09;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = HUM_VOLUME * 0.4;
    lfo.connect(lfoGain);
    lfoGain.connect(masterGain.gain);
    lfo.start();

    running = true;
  } catch {
    // Audio is a nicety — never let it break the page.
  }
}

export function stopAmbientHum() {
  if (!running || !ctx || !masterGain) return;
  const gain = masterGain;
  gain.gain.cancelScheduledValues(ctx.currentTime);
  gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
  const oldCtx = ctx;
  setTimeout(() => {
    oldCtx.close().catch(() => {});
  }, 800);
  ctx = null;
  masterGain = null;
  running = false;
}
