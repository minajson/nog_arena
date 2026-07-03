"use client";

import { useSyncExternalStore } from "react";

const noSubscribe = () => () => {};

/** Reads a client-only boolean once, safely across SSR hydration (always false on the server). */
export function useMountFlag(compute: () => boolean): boolean {
  return useSyncExternalStore(noSubscribe, compute, () => false);
}
