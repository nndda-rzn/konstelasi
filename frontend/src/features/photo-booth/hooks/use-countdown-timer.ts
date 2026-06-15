"use client";

import { useCallback, useEffect, useRef } from "react";

export interface CountdownTimer {
  intervalRef: React.MutableRefObject<ReturnType<typeof setInterval> | null>;
  flashRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>;
  clearAllTimers: () => void;
}

export function useCountdownTimer(): CountdownTimer {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const flashRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearAllTimers = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (flashRef.current) {
      clearTimeout(flashRef.current);
      flashRef.current = null;
    }
  }, []);

  useEffect(() => clearAllTimers, [clearAllTimers]);

  return { intervalRef, flashRef, clearAllTimers };
}
