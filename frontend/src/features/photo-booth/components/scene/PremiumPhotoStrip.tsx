"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useEffect } from "react";

/**
 * PremiumPhotoStrip - A hero artifact styled like a premium printed keepsake.
 * Branded for Constella: warm cream paper, pastel frames, tiny star glyphs,
 * constellation stamp, handwritten-feel date, soft parallax tilt + float.
 */
export function PremiumPhotoStrip() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 55, damping: 18, mass: 0.4 };
  const rotateX = useSpring(useTransform(mouseY, [-1, 1], [4.5, -4.5]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-1, 1], [-5.5, 5.5]), springConfig);
  const shadowX = useSpring(useTransform(mouseX, [-1, 1], [7, -7]), springConfig);
  const shadowY = useSpring(useTransform(mouseY, [-1, 1], [7, -7]), springConfig);

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
      {/* Layered radial glow halo - blush + cream + lavender */}
      <div
        className="pointer-events-none absolute -inset-24"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255, 200, 210, 0.32) 0%, rgba(232, 212, 240, 0.18) 35%, rgba(245, 230, 200, 0.1) 60%, transparent 75%)",
          filter: "blur(24px)",
        }}
        aria-hidden
      />

      {/* Tiny orbiting sparkles around the strip */}
      <Sparkle className="absolute -top-3 -left-4" delay={0} size={7} />
      <Sparkle className="absolute -top-1 right-1" delay={0.9} size={5} />
      <Sparkle className="absolute top-1/3 -left-7" delay={1.6} size={6} />
      <Sparkle className="absolute bottom-3 -right-5" delay={0.5} size={8} />
      <Sparkle className="absolute -bottom-1 left-3" delay={1.3} size={5} />
      <Sparkle className="absolute top-2 -right-7" delay={2.1} size={4} />

      {/* Drop shadow that follows parallax */}
      <motion.div
        className="absolute -bottom-5 left-1/2 h-12 w-56 -translate-x-1/2 rounded-full opacity-45 blur-2xl"
        style={{
          background:
            "radial-gradient(ellipse, rgba(140, 100, 115, 0.4) 0%, rgba(180, 140, 160, 0.15) 50%, transparent 75%)",
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
          y: [0, -6, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative"
      >
        {/* The photo card */}
        <div
          className="relative w-[218px] rounded-[14px] p-3.5 sm:w-[240px]"
          style={{
            background: "linear-gradient(150deg, #FFFCF8 0%, #FAF5EE 50%, #F8F1E8 100%)",
            boxShadow: `
              0 1px 2px rgba(60, 30, 40, 0.05),
              0 6px 14px rgba(60, 30, 40, 0.06),
              0 20px 44px rgba(60, 30, 40, 0.08)
            `,
            border: "1px solid rgba(225, 210, 195, 0.65)",
          }}
        >
          {/* Paper highlight overlay - subtle gloss */}
          <div
            className="pointer-events-none absolute inset-0 rounded-[14px]"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.65) 0%, transparent 28%, transparent 72%, rgba(255,255,255,0.2) 100%)",
            }}
            aria-hidden
          />

          {/* Top corner constellation stamp - tiny detail */}
          <div className="absolute right-2.5 top-2.5 flex items-center gap-0.5 opacity-70">
            <DotStar size={3} delay={0} />
            <DotStar size={2} delay={0.5} />
            <DotStar size={2.5} delay={1} />
          </div>

          {/* Photo frames */}
          <div className="relative mt-1 flex flex-col gap-[5px]">
            <Frame color="#FFE0E8" />
            <Frame color="#F0E2C5" />
            <Frame color="#E8DEF2" />
            <Frame color="#FCDCE6" />
          </div>

          {/* Brand footer */}
          <div className="mt-3 flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <svg
                width="9"
                height="9"
                viewBox="0 0 10 10"
                fill="none"
                aria-hidden
              >
                <path
                  d="M5 0L5.7 4.3L10 5L5.7 5.7L5 10L4.3 5.7L0 5L4.3 4.3L5 0Z"
                  fill="#D4A574"
                />
              </svg>
              <span
                className="text-[9px] font-semibold tracking-[0.25em] uppercase"
                style={{ color: "#5A3E4C" }}
              >
                Constella
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span
                className="h-px w-3"
                style={{ background: "linear-gradient(90deg, transparent, #D4A574, transparent)" }}
              />
              <span className="text-[8.5px] italic" style={{ color: "#9D7B8A" }}>
                14 jun
              </span>
            </div>
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
        background: `linear-gradient(135deg, ${color} 0%, ${darken(color, 0.07)} 100%)`,
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.5)",
      }}
    >
      {/* Inner highlight */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 30% 25%, rgba(255,255,255,0.4) 0%, transparent 55%)`,
        }}
        aria-hidden
      />
      {/* Subtle dust speck */}
      <div
        className="absolute right-2 top-2 h-1 w-1 rounded-full opacity-50"
        style={{ background: "#FFFFFF" }}
      />
    </div>
  );
}

function Sparkle({
  className,
  delay = 0,
  size = 6,
}: {
  className?: string;
  delay?: number;
  size?: number;
}) {
  return (
    <motion.div
      className={`pointer-events-none ${className}`}
      animate={{
        opacity: [0.2, 0.85, 0.2],
        scale: [0.85, 1.05, 0.85],
      }}
      transition={{
        duration: 3.5 + delay * 0.25,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    >
      <svg width={size} height={size} viewBox="0 0 10 10" fill="none" aria-hidden>
        <path
          d="M5 0L5.7 4.3L10 5L5.7 5.7L5 10L4.3 5.7L0 5L4.3 4.3L5 0Z"
          fill="#D4A574"
          opacity="0.7"
        />
      </svg>
    </motion.div>
  );
}

function DotStar({ size = 3, delay = 0 }: { size?: number; delay?: number }) {
  return (
    <motion.div
      className="rounded-full"
      style={{ background: "#D4A574", width: size, height: size }}
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 3, repeat: Infinity, delay, ease: "easeInOut" }}
    />
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
