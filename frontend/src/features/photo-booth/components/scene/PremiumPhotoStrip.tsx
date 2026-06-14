"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useEffect } from "react";

/**
 * PremiumPhotoStrip - HTML/SVG photo strip styled like a printed photo card.
 * Uses framer-motion for subtle parallax tilt and floating animation.
 * Renders better than a 3D mesh for this use case - looks like real paper.
 */
export function PremiumPhotoStrip() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics for natural feel
  const springConfig = { stiffness: 60, damping: 18, mass: 0.4 };
  const rotateX = useSpring(useTransform(mouseY, [-1, 1], [3, -3]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-1, 1], [-3, 3]), springConfig);

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
    <div className="relative flex items-center justify-center" style={{ perspective: "1000px" }}>
      {/* Soft drop shadow underneath */}
      <div
        className="absolute -bottom-3 left-1/2 h-8 w-44 -translate-x-1/2 rounded-full opacity-30 blur-xl"
        style={{ background: "radial-gradient(ellipse, rgba(140, 119, 131, 0.25) 0%, transparent 70%)" }}
        aria-hidden
      />

      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        animate={{
          y: [0, -4, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative"
      >
        {/* The photo card */}
        <div
          className="relative w-[200px] rounded-[10px] p-3 sm:w-[220px]"
          style={{
            background: "linear-gradient(145deg, #FFFCF8 0%, #FAF6F0 100%)",
            boxShadow: `
              0 1px 1px rgba(60, 30, 40, 0.04),
              0 4px 12px rgba(60, 30, 40, 0.06),
              0 12px 28px rgba(60, 30, 40, 0.05)
            `,
            border: "1px solid rgba(230, 220, 210, 0.5)",
          }}
        >
          {/* Subtle paper highlight */}
          <div
            className="pointer-events-none absolute inset-0 rounded-[10px]"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.6) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.15) 100%)",
            }}
            aria-hidden
          />

          {/* Photo frames */}
          <div className="relative flex flex-col gap-1.5">
            <Frame color="#FFE5E8" accent="dusty-pink" />
            <Frame color="#F0E6D2" accent="muted-gold" />
            <Frame color="#E8E0F0" accent="lavender" />
            <Frame color="#FCE0E8" accent="blush" />
          </div>

          {/* Brand footer */}
          <div className="mt-2.5 flex items-center justify-center gap-1.5">
            <span
              className="inline-block h-1 w-1 rounded-full"
              style={{ background: "#E63946" }}
            />
            <span
              className="text-[8px] font-semibold tracking-[0.2em] uppercase"
              style={{ color: "#5A3E4C" }}
            >
              Constella
            </span>
            <span
              className="text-[8px]"
              style={{ color: "#8C7783" }}
            >
              · 14 Jun 2026
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Frame({ color, accent }: { color: string; accent: string }) {
  return (
    <div
      className="relative h-[60px] w-full overflow-hidden rounded-[3px] sm:h-[68px]"
      style={{
        background: `linear-gradient(135deg, ${color} 0%, ${darken(color, 0.08)} 100%)`,
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.4)",
      }}
    >
      {/* Subtle photo texture/gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.3) 0%, transparent 50%)`,
        }}
        aria-hidden
      />
    </div>
  );
}

// Helper to darken a hex color slightly for gradient
function darken(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const dr = Math.max(0, Math.floor(r * (1 - amount)));
  const dg = Math.max(0, Math.floor(g * (1 - amount)));
  const db = Math.max(0, Math.floor(b * (1 - amount)));
  return `#${dr.toString(16).padStart(2, "0")}${dg.toString(16).padStart(2, "0")}${db.toString(16).padStart(2, "0")}`;
}
