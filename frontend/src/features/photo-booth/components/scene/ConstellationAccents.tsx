"use client";

import { motion } from "framer-motion";

/**
 * ConstellationAccents - Two intentional star clusters.
 * Left cluster flows from photo strip area. Right cluster drifts near text.
 * Both use thin elegant connecting lines + soft glow on anchor stars.
 */
export function ConstellationAccents({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 ${className}`}
      aria-hidden="true"
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          <radialGradient id="dotGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D4A574" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#D4A574" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="pinkGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E8919C" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#E8919C" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* LEFT CLUSTER - flows from above the photo strip */}
        <g stroke="#D4A574" strokeWidth="0.4" strokeOpacity="0.3" fill="none">
          <line x1="60" y1="100" x2="120" y2="180" />
          <line x1="120" y1="180" x2="180" y2="140" />
          <line x1="180" y1="140" x2="220" y2="220" />
          <line x1="60" y1="100" x2="40" y2="60" />
        </g>
        {/* Left cluster stars */}
        <Star cx={60} cy={100} size={3} glow="dotGlow" />
        <Star cx={120} cy={180} size={2.2} glow="dotGlow" />
        <Star cx={180} cy={140} size={2.6} glow="dotGlow" />
        <Star cx={220} cy={220} size={2} glow="dotGlow" />
        <Star cx={40} cy={60} size={1.8} glow="dotGlow" />

        {/* RIGHT CLUSTER - subtle, near text area */}
        <g stroke="#D4A574" strokeWidth="0.4" strokeOpacity="0.25" fill="none">
          <line x1="640" y1="200" x2="710" y2="150" />
          <line x1="710" y1="150" x2="760" y2="240" />
          <line x1="640" y1="200" x2="700" y2="280" />
        </g>
        {/* Right cluster stars */}
        <Star cx={640} cy={200} size={2.2} glow="dotGlow" />
        <Star cx={710} cy={150} size={2.8} glow="dotGlow" />
        <Star cx={760} cy={240} size={1.8} glow="dotGlow" />
        <Star cx={700} cy={280} size={2} glow="dotGlow" />

        {/* Lower-left faint accent star with pink glow */}
        <circle cx={140} cy={460} r={14} fill="url(#pinkGlow)" />
        <circle cx={140} cy={460} r={2.4} fill="#E8919C" opacity="0.65" />

        {/* Upper-right faint accent star with pink glow */}
        <circle cx={680} cy={80} r={12} fill="url(#pinkGlow)" />
        <circle cx={680} cy={80} r={2} fill="#E8919C" opacity="0.55" />
      </svg>

      {/* Twinkling stars on key positions */}
      <TwinkleDot
        className="absolute left-[7.5%] top-[16.7%]"
        delay={0}
        color="#D4A574"
      />
      <TwinkleDot
        className="absolute left-[15%] top-[30%]"
        delay={0.6}
        color="#D4A574"
      />
      <TwinkleDot
        className="absolute left-[22.5%] top-[23.3%]"
        delay={1.2}
        color="#D4A574"
      />
      <TwinkleDot
        className="absolute left-[27.5%] top-[36.7%]"
        delay={1.8}
        color="#D4A574"
      />
      <TwinkleDot
        className="absolute right-[20%] top-[33.3%]"
        delay={0.4}
        color="#D4A574"
      />
      <TwinkleDot
        className="absolute right-[11.25%] top-[25%]"
        delay={1.0}
        color="#D4A574"
      />
      <TwinkleDot
        className="absolute right-[6%] top-[13.3%]"
        delay={1.6}
        color="#E8919C"
      />
    </div>
  );
}

function Star({
  cx,
  cy,
  size,
  glow,
}: {
  cx: number;
  cy: number;
  size: number;
  glow: string;
}) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={size * 3.5} fill={`url(#${glow})`} />
      <circle cx={cx} cy={cy} r={size} fill="#D4A574" opacity="0.6" />
    </g>
  );
}

function TwinkleDot({
  className,
  delay = 0,
  color = "#D4A574",
}: {
  className?: string;
  delay?: number;
  color?: string;
}) {
  return (
    <motion.div
      className={`absolute ${className}`}
      animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.9, 1.1, 0.9] }}
      transition={{
        duration: 4 + delay * 0.3,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    >
      <div
        className="h-1.5 w-1.5 rounded-full"
        style={{
          background: color,
          boxShadow: `0 0 6px ${color}80`,
        }}
      />
    </motion.div>
  );
}
