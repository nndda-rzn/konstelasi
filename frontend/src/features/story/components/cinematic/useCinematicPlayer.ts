"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface UseCinematicPlayerParams {
  totalNodes: number;
  durationMs: number;
  onComplete: () => void;
}

/**
 * useCinematicPlayer - Manages auto-play state, progress, and keyboard controls.
 * - Auto-advances after durationMs (unless paused)
 * - Tracks progress 0-100 via requestAnimationFrame
 * - Keyboard: Arrow/Space (next), ArrowLeft (prev), P (pause), Esc (close)
 */
export const useCinematicPlayer = ({
  totalNodes,
  durationMs,
  onComplete,
}: UseCinematicPlayerParams) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef<number>(Date.now());
  const elapsedRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  const goNext = useCallback(() => {
    setCurrentIndex((i) => {
      if (i >= totalNodes - 1) {
        onComplete();
        return i;
      }
      return i + 1;
    });
    elapsedRef.current = 0;
    startTimeRef.current = Date.now();
    setProgress(0);
  }, [totalNodes, onComplete]);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => Math.max(0, i - 1));
    elapsedRef.current = 0;
    startTimeRef.current = Date.now();
    setProgress(0);
  }, []);

  const goTo = useCallback((index: number) => {
    setCurrentIndex(index);
    elapsedRef.current = 0;
    startTimeRef.current = Date.now();
    setProgress(0);
  }, []);

  const togglePause = useCallback(() => {
    setIsPaused((p) => !p);
  }, []);

  // Animation loop
  useEffect(() => {
    if (isPaused || totalNodes === 0) return;
    startTimeRef.current = Date.now() - elapsedRef.current;
    const tick = () => {
      const e = Date.now() - startTimeRef.current;
      elapsedRef.current = e;
      const p = Math.min(100, (e / durationMs) * 100);
      setProgress(p);
      if (p >= 100) {
        goNext();
      } else {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [currentIndex, isPaused, durationMs, goNext, totalNodes]);

  // Reset on index change
  useEffect(() => {
    elapsedRef.current = 0;
    startTimeRef.current = Date.now();
    setProgress(0);
  }, [currentIndex]);

  return {
    currentIndex,
    isPaused,
    progress,
    goNext,
    goPrev,
    goTo,
    togglePause,
  };
};

/**
 * useCinematicKeyboard - Global keyboard handler.
 */
export const useCinematicKeyboard = (
  goNext: () => void,
  goPrev: () => void,
  onClose: () => void,
  togglePause: () => void
) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        goPrev();
      } else if (e.key === "Escape") {
        onClose();
      } else if (e.key.toLowerCase() === "p") {
        togglePause();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, onClose, togglePause]);
};
