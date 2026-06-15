"use client";

import { motion } from "framer-motion";
import { StarIcon } from "../shared/StarIcon";
import type { PhotoRatio } from "../../photoBooth.config";

interface FormatCardProps {
  ratio: PhotoRatio;
  active: boolean;
  isRecommended: boolean;
  onSelect: () => void;
}

/**
 * FormatCard - Single ratio option in the format picker grid.
 */
export function FormatCard({ ratio, active, isRecommended, onSelect }: FormatCardProps) {
  return (
    <motion.button
      onClick={onSelect}
      whileHover={{ y: -1 }}
      whileTap={{ y: 0, scale: 0.99 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className={`group relative flex flex-col items-stretch overflow-hidden rounded-xl p-3 text-left transition-all ${
        active ? "bg-white" : "bg-white/60 hover:bg-white"
      }`}
      style={{
        boxShadow: active
          ? "0 1px 2px rgba(60, 30, 40, 0.05), 0 6px 16px rgba(60, 30, 40, 0.07), 0 0 0 1.5px rgba(212, 165, 116, 0.5), 0 0 20px -4px rgba(212, 165, 116, 0.25)"
          : "0 1px 2px rgba(60, 30, 40, 0.03), 0 2px 5px rgba(60, 30, 40, 0.04)",
        border: "1px solid rgba(225, 210, 195, 0.5)",
      }}
    >
      {isRecommended && (
        <div
          className="absolute right-1.5 top-1.5 z-10 flex items-center gap-0.5 rounded-full px-1.5 py-0.5"
          style={{
            background: "rgba(212, 165, 116, 0.15)",
            border: "1px solid rgba(212, 165, 116, 0.3)",
          }}
        >
          <StarIcon size={5} color="#9D7B3F" />
          <span
            className="text-[7.5px] font-semibold tracking-[0.15em] uppercase"
            style={{ color: "#9D7B3F" }}
          >
            Rec
          </span>
        </div>
      )}

      {active && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 380, damping: 20 }}
          className="absolute right-1.5 top-1.5 z-20 flex h-4 w-4 items-center justify-center rounded-full"
          style={{
            background: "linear-gradient(135deg, #D4A574 0%, #B8895A 100%)",
            boxShadow: "0 2px 5px rgba(184, 137, 90, 0.4)",
          }}
        >
          <svg width="8" height="8" viewBox="0 0 10 10" fill="none" aria-hidden>
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

      <div className="mb-2.5 flex h-12 items-center justify-center">
        <div
          className="rounded-[2px]"
          style={{
            aspectRatio: `${ratio.aspectRatio}`,
            width: ratio.aspectRatio >= 1.5 ? 56 : ratio.aspectRatio >= 1 ? 44 : 28,
            background: active
              ? "linear-gradient(135deg, #FFE0E8 0%, #F0E2C5 100%)"
              : "linear-gradient(135deg, #FAF5EE 0%, #F0E8DD 100%)",
            boxShadow:
              "inset 0 0 0 1px rgba(255, 255, 255, 0.6), 0 1px 2px rgba(60, 30, 40, 0.05)",
          }}
        />
      </div>

      <div className="flex items-baseline justify-between">
        <div>
          <p className="text-[14px] font-semibold tracking-tight text-[#3F2A35]">
            {ratio.label}
          </p>
          <p className="mt-0.5 text-[10.5px] italic text-[#9D7B8A]">
            {ratio.name}
          </p>
        </div>
      </div>
    </motion.button>
  );
}
