"use client";

import { motion } from "framer-motion";
import type { FrameStyle } from "../../../config/frames";
import { FrameMockup } from "./FrameMockup";

interface FrameThumbProps {
  frame: FrameStyle;
  active: boolean;
  onSelect: () => void;
}

/**
 * FrameThumb - Selectable card with mockup + meta for a single
 * frame style in the FrameSelector grid.
 */
export function FrameThumb({ frame, active, onSelect }: FrameThumbProps) {
  return (
    <motion.button
      onClick={onSelect}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className={`group relative flex flex-col items-stretch overflow-hidden rounded-lg p-1.5 text-left transition-all ${
        active ? "bg-white" : "bg-white/60 hover:bg-white"
      }`}
      style={{
        boxShadow: active
          ? "0 1px 2px rgba(60, 30, 40, 0.05), 0 4px 12px rgba(60, 30, 40, 0.06), 0 0 0 1.5px rgba(212, 165, 116, 0.5)"
          : "0 1px 2px rgba(60, 30, 40, 0.03), 0 1px 3px rgba(60, 30, 40, 0.04)",
        border: "1px solid rgba(225, 210, 195, 0.4)",
      }}
    >
      {active && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 380, damping: 20 }}
          className="absolute right-1 top-1 z-20 flex h-3.5 w-3.5 items-center justify-center rounded-full"
          style={{
            background: "linear-gradient(135deg, #D4A574 0%, #B8895A 100%)",
            boxShadow: "0 1px 3px rgba(184, 137, 90, 0.4)",
          }}
        >
          <svg width="7" height="7" viewBox="0 0 10 10" fill="none" aria-hidden>
            <path
              d="M2 5.5L4 7.5L8 3"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      )}

      <FrameMockup frame={frame} />

      <div className="mt-1.5 px-1">
        <p className="text-[10.5px] font-semibold tracking-tight text-[#3F2A35]">
          {frame.name}
        </p>
        <p className="text-[8.5px] text-[#8C7783]">{frame.tagline}</p>
      </div>
    </motion.button>
  );
}
