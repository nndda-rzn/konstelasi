"use client";

import { useEffect, useState } from "react";

/**
 * useReducedMotion - SSR-safe reactive check for `prefers-reduced-motion: reduce`.
 * Returns `true` when user has requested reduced motion at the OS level.
 * Updates reactively if the user changes the setting.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return reduced;
}
