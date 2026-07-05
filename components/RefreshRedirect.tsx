"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Kiosk behavior: refreshing the browser anywhere in the app returns to the
 * opening attract screen ("/" — the NOG main video page). Only a real browser
 * reload triggers this; direct links and in-app navigation are untouched. */
export default function RefreshRedirect() {
  const router = useRouter();

  useEffect(() => {
    const nav = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    if (nav?.type === "reload" && window.location.pathname !== "/") {
      router.replace("/");
    }
  }, [router]);

  return null;
}
