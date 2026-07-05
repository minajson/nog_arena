"use client";

import { useEffect, useRef } from "react";
import { useSettings } from "@/lib/store";
import { startAmbientHum, stopAmbientHum } from "@/lib/ambient";

/** Invisible controller for the low industrial hum. Browsers only allow audio
 * after a user gesture, so the hum arms itself on the first pointer/key input
 * and then follows the existing global sound toggle. */
export default function AmbientHum() {
  const { soundEnabled } = useSettings();
  const interactedRef = useRef(false);

  useEffect(() => {
    function onFirstInteraction() {
      interactedRef.current = true;
      if (soundEnabled) startAmbientHum();
      window.removeEventListener("pointerdown", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
    }

    if (!soundEnabled) {
      stopAmbientHum();
    } else if (interactedRef.current) {
      startAmbientHum();
    }

    window.addEventListener("pointerdown", onFirstInteraction);
    window.addEventListener("keydown", onFirstInteraction);
    return () => {
      window.removeEventListener("pointerdown", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
    };
  }, [soundEnabled]);

  useEffect(() => stopAmbientHum, []);

  return null;
}
