"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useEffect } from "react";

/**
 * PremiumPhotoStrip - HTML/CSS photo strip styled like a printed photo card.
 * Looks like real paper, not 3D mesh. Uses framer-motion for subtle
 * floating + parallax tilt.
 */
export function PremiumPhotoStrip() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics for natural feel
  const springConfig = { stiffness: 60, damping: 18, mass: 0.4 };
  const rotateX = useSpring(useTransform(mouseY, [-1, 1], [4, -4]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-1, 1], [-5, 5]), springConfig);

  // Subtle shadow that follows tilt
  const shadowX = useSpring(useTransform(mouseX, [-1, 1], [6, -6]), springConfig);
  const shadowY = useSpring(useTransform(mouseY, [-1, 1], [6, -6]), springConfig);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || reduced) return;

    const onMove = (e: PointerEvent) => {
      mouseX.set((e.clientX / window.innerWidth) * 2 - 1);
      mouseY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mouseX, mouseY]);

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ perspective: "1200px" }}
    >
      {/* Soft drop shadow that follows parallax */}
      <motion.div
        className="absolute -bottom-4 left-1/2 h-10 w-52 -translate-x-1/2 rounded-full opacity-40 blur-2xl"
        style={{
          background: "radial-gradient(ellipse, rgba(140, 119, 131, 0.35) 0%, transparent 70%)",
          x: shadowX,
          y: shadowY,
        }}
        aria-hidden
      />

      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        animate={{
          y: [0, -5, 0],
        }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative"
      >
        {/* The photo card */}
        <div
          className="relative w-[210px] rounded-[12px] p-3.5 sm:w-[230px]"
          style={{
            background: "linear-gradient(145deg, #FFFCF8 0%, #FAF6F0 100%)",
            boxShadow: `
              0 1px 1px rgba(60, 30, 40, 0.04),
              0 4px 10px rgba(60, 30, 40, 0.05),
              0 16px 36px rgba(60, 30, 40, 0.07)
            `,
            border: "1px solid rgba(230, 220, 210, 0.6)",
          }}
        >
          {/* Paper highlight overlay */}
          <div
            className="pointer-events-none absolute inset-0 rounded-[12px]"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.7) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.18) 100%)",
            }}
            aria-hidden
          />

          {/* Photo frames */}
          <div className="relative flex flex-col gap-1.5">
            <Frame color="#FFE0E8" />
            <Frame color="#F0E2C5" />
            <Frame color="#E8DEF2" />
            <Frame color="#FCDCE6" />
          </div>

          {/* Brand footer */}
          <div className="mt-3 flex items-center justify-center gap-1.5">
            <span
              className="inline-block h-1 w-1 rounded-full"
              style={{ background: "#E63946" }}
            />
            <span
              className="text-[8.5px] font-semibold tracking-[0.22em] uppercase"
              style={{ color: "#5A3E4C" }}
            >
              Constella
            </span>
            <span className="text-[8.5px]" style={{ color: "#8C7783" }}>
              · 14 Jun 2026
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Frame({ color }: { color: string }) {
  return (
    <div
      className="relative h-[64px] w-full overflow-hidden rounded-[4px] sm:h-[70px]"
      style={{
        background: `linear-gradient(135deg, ${color} 0%, ${darken(color, 0.06)} 100%)`,
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.5)",
      }}
    >
      {/* Inner highlight to give "photo" feel */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 30% 25%, rgba(255,255,255,0.35) 0%, transparent 55%)`,
        }}
        aria-hidden
      />
    </div>
  );
}

function darken(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const dr = Math.max(0, Math.floor(r * (1 - amount)));
  const dg = Math.max(0, Math.floor(g * (1 - amount)));
  const db = Math.max(0, Math.floor(b * (1 - amount)));
  return `#${dr.toString(16).padStart(2, "0")}${dg.toString(16).padStart(2, "0")}${db.toString(16).padStart(2, "0")}`;
}
