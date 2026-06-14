"use client";

import { motion } from "framer-motion";

/**
 * ConstellationAccents - HTML/SVG constellation-style dots and lines.
 * Renders tasteful star dots around the hero area with subtle drift.
 * Pairs with the Three.js ambient layer (which handles particles).
 */
export function ConstellationAccents({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 ${className}`}
      aria-hidden="true"
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 400 400"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          <radialGradient id="dotGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D4A574" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#D4A574" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Faint connecting lines forming a simple constellation pattern */}
        <g stroke="#D4A574" strokeWidth="0.3" strokeOpacity="0.25" fill="none">
          <line x1="60" y1="80" x2="140" y2="120" />
          <line x1="140" y1="120" x2="220" y2="60" />
          <line x1="220" y1="60" x2="320" y2="140" />
          <line x1="60" y1="280" x2="130" y2="340" />
          <line x1="130" y1="340" x2="240" y2="320" />
          <line x1="80" y1="200" x2="60" y2="280" />
        </g>

        {/* Star dots at line intersections */}
        {[
          { x: 60, y: 80, size: 2.2 },
          { x: 140, y: 120, size: 1.6 },
          { x: 220, y: 60, size: 2.4 },
          { x: 320, y: 140, size: 1.8 },
          { x: 60, y: 280, size: 2.0 },
          { x: 130, y: 340, size: 1.5 },
          { x: 240, y: 320, size: 1.8 },
          { x: 80, y: 200, size: 1.4 },
        ].map((d, i) => (
          <g key={i}>
            <circle cx={d.x} cy={d.y} r={d.size * 4} fill="url(#dotGlow)" />
            <circle
              cx={d.x}
              cy={d.y}
              r={d.size}
              fill="#D4A574"
              opacity="0.55"
            />
          </g>
        ))}
      </svg>

      {/* Floating twinkle animations on a few key dots */}
      <motion.div
        className="absolute left-[15%] top-[20%] h-1.5 w-1.5 rounded-full"
        style={{ background: "#D4A574", opacity: 0.5 }}
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[20%] top-[15%] h-1 w-1 rounded-full"
        style={{ background: "#E63946", opacity: 0.5 }}
        animate={{ opacity: [0.2, 0.6, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute bottom-[25%] left-[20%] h-1 w-1 rounded-full"
        style={{ background: "#D4A574", opacity: 0.4 }}
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
    </div>
  );
}
