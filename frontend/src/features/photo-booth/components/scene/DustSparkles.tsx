"use client";

import { motion } from "framer-motion";

/**
 * DustSparkles - Very subtle dust particles that drift slowly.
 * Sits as the topmost ambient layer. Creates a dreamy, atmospheric feel.
 */
export function DustSparkles({ className = "" }: { className?: string }) {
  // Pre-computed positions for stable SSR
  const particles = [
    { x: 12, y: 18, size: 1.5, delay: 0, duration: 8 },
    { x: 22, y: 42, size: 1, delay: 1.2, duration: 9 },
    { x: 35, y: 14, size: 1.2, delay: 0.5, duration: 10 },
    { x: 48, y: 58, size: 1.4, delay: 1.8, duration: 7.5 },
    { x: 55, y: 28, size: 1, delay: 0.9, duration: 9.5 },
    { x: 68, y: 48, size: 1.6, delay: 1.4, duration: 8.5 },
    { x: 78, y: 22, size: 1.2, delay: 0.3, duration: 10 },
    { x: 85, y: 62, size: 1, delay: 1.6, duration: 8 },
    { x: 18, y: 72, size: 1.3, delay: 0.7, duration: 9 },
    { x: 42, y: 84, size: 1.5, delay: 1.1, duration: 7.5 },
    { x: 62, y: 78, size: 1.1, delay: 0.2, duration: 9.5 },
    { x: 88, y: 38, size: 1.4, delay: 1.9, duration: 8.5 },
  ];

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: "#E8C9A0",
            boxShadow: "0 0 4px rgba(232, 201, 160, 0.6)",
          }}
          animate={{
            y: [0, -8, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
