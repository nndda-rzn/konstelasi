"use client";

import { motion } from "framer-motion";
import { usePhotoBoothStore } from "../photoBoothStore";
import type { LayoutId, PhotoLayout } from "../photoBooth.config";
import { tagForLayout } from "../photoBooth.config";
import { MiniPreview } from "./MiniPreview";

interface LayoutCardProps {
  layout: PhotoLayout;
  category?: "classic" | "themed" | "wide";
}

/**
 * LayoutCard - A curated gallery sample of a photo booth print style.
 * Looks like a mini printed keepsake, not a placeholder block.
 */
export function LayoutCard({ layout, category }: LayoutCardProps) {
  const selected = usePhotoBoothStore((s) => s.selectedLayoutId);
  const setSelectedLayout = usePhotoBoothStore((s) => s.setSelectedLayout);
  const active = selected === layout.id;

  return (
    <motion.button
      onClick={() => setSelectedLayout(layout.id as LayoutId)}
      whileHover={{ y: -2 }}
      whileTap={{ y: 0, scale: 0.99 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className={`group relative flex flex-col items-stretch overflow-hidden rounded-2xl text-left transition-all duration-300 ${
        active
          ? "bg-white"
          : "bg-white/60 hover:bg-white"
      }`}
      style={{
        boxShadow: active
          ? "0 1px 2px rgba(60, 30, 40, 0.05), 0 8px 20px rgba(60, 30, 40, 0.08), 0 0 0 1.5px rgba(212, 165, 116, 0.5), 0 0 24px -4px rgba(212, 165, 116, 0.25)"
          : "0 1px 2px rgba(60, 30, 40, 0.03), 0 2px 6px rgba(60, 30, 40, 0.04)",
        border: "1px solid rgba(225, 210, 195, 0.5)",
      }}
    >
      {/* Category corner mark (themed layouts) */}
      {category === "themed" && (
        <div
          className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-full px-1.5 py-0.5"
          style={{
            background: "rgba(212, 165, 116, 0.12)",
            border: "1px solid rgba(212, 165, 116, 0.25)",
          }}
        >
          <svg width="6" height="6" viewBox="0 0 10 10" fill="none" aria-hidden>
            <path
              d="M5 0L5.7 4.3L10 5L5.7 5.7L5 10L4.3 5.7L0 5L4.3 4.3L5 0Z"
              fill="#D4A574"
            />
          </svg>
          <span
            className="text-[8px] font-semibold tracking-[0.15em] uppercase"
            style={{ color: "#9D7B3F" }}
          >
            Themed
          </span>
        </div>
      )}

      {/* Selected check (top-right when active) */}
      {active && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 380, damping: 20 }}
          className="absolute right-2 top-2 z-20 flex h-5 w-5 items-center justify-center rounded-full"
          style={{
            background: "linear-gradient(135deg, #D4A574 0%, #B8895A 100%)",
            boxShadow: "0 2px 6px rgba(184, 137, 90, 0.4)",
          }}
        >
          <svg
            width="9"
            height="9"
            viewBox="0 0 10 10"
            fill="none"
            aria-hidden
          >
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

      {/* Preview area - more dominant */}
      <div className="relative aspect-[4/3] w-full overflow-hidden p-4">
        {/* Subtle warm gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(250, 245, 238, 0.6) 0%, rgba(245, 230, 220, 0.3) 100%)",
          }}
          aria-hidden
        />
        <div className="relative h-full w-full">
          <MiniPreview layoutId={layout.id as LayoutId} className="h-full w-full" />
        </div>
      </div>

      {/* Meta - cleaner hierarchy */}
      <div
        className="border-t px-3 py-2.5"
        style={{ borderColor: "rgba(225, 210, 195, 0.4)" }}
      >
        <p className="text-[12.5px] font-semibold tracking-tight text-[#3F2A35]">
          {layout.label}
        </p>
        <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-[#8C7783]">
          <span>{layout.requiredShots} pose</span>
          <span style={{ color: "#D4A574" }}>·</span>
          <span className="italic">{tagForLayout(layout)}</span>
        </div>
      </div>
    </motion.button>
  );
}
