"use client";

import { useEffect, useRef, useState } from "react";

/**
 * useMouseParallax - SSR-safe hook that tracks normalized mouse position
 * for subtle parallax effects. Returns lerped x/y in range [-1, 1].
 * Disabled on touch devices and when reduced motion is active.
 */
export function useMouseParallax(smoothing = 0.05) {
  const [enabled, setEnabled] = useState(false);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(!isTouch && !reducedMotion);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled]);

  // Lerp loop
  useEffect(() => {
    if (!enabled) return;
    let raf: number;
    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * smoothing;
      current.current.y += (target.current.y - current.current.y) * smoothing;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [enabled, smoothing]);

  return {
    x: current.current.x,
    y: current.current.y,
    enabled,
  };
}
