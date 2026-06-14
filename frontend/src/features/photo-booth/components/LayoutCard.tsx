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
 * Mini print mockup with paper texture, celestial stamp, and print footer.
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
        active ? "bg-white" : "bg-white/60 hover:bg-white"
      }`}
      style={{
        boxShadow: active
          ? "0 1px 2px rgba(60, 30, 40, 0.05), 0 8px 22px rgba(60, 30, 40, 0.09), 0 0 0 1.5px rgba(212, 165, 116, 0.55), 0 0 28px -4px rgba(212, 165, 116, 0.3)"
          : "0 1px 2px rgba(60, 30, 40, 0.03), 0 2px 6px rgba(60, 30, 40, 0.04)",
        border: "1px solid rgba(225, 210, 195, 0.5)",
      }}
    >
      {/* Category corner badge (themed layouts) */}
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

      {/* Selected micro-label (top-left) */}
      {active && (
        <motion.div
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute left-2 top-2 z-20 flex items-center gap-1.5 rounded-full px-2 py-0.5"
          style={{
            background: "rgba(212, 165, 116, 0.18)",
            border: "1px solid rgba(212, 165, 116, 0.35)",
          }}
        >
          <span
            className="h-1 w-1 rounded-full"
            style={{ background: "#9D7B3F" }}
          />
          <span
            className="text-[8px] font-semibold tracking-[0.2em] uppercase"
            style={{ color: "#9D7B3F" }}
          >
            Dipilih
          </span>
        </motion.div>
      )}

      {/* Preview area - mini print mockup */}
      <div className="relative aspect-[4/3] w-full overflow-hidden p-4">
        {/* Warm gradient backdrop */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(250, 245, 238, 0.6) 0%, rgba(245, 230, 220, 0.3) 100%)",
          }}
          aria-hidden
        />

        {/* Print mockup container */}
        <div
          className="relative h-full w-full rounded-[2px] p-2"
          style={{
            background: "linear-gradient(180deg, #FFFCF8 0%, #FAF5EE 100%)",
            boxShadow:
              "inset 0 0 0 1px rgba(225, 210, 195, 0.5), 0 1px 3px rgba(60, 30, 40, 0.04)",
          }}
        >
          {/* Celestial stamp (top-right of print) */}
          <div className="absolute right-1.5 top-1.5 flex items-center gap-0.5 opacity-60">
            <svg width="4" height="4" viewBox="0 0 10 10" fill="none" aria-hidden>
              <path
                d="M5 0L5.7 4.3L10 5L5.7 5.7L5 10L4.3 5.7L0 5L4.3 4.3L5 0Z"
                fill="#D4A574"
              />
            </svg>
            <svg width="3" height="3" viewBox="0 0 10 10" fill="none" aria-hidden>
              <path
                d="M5 0L5.7 4.3L10 5L5.7 5.7L5 10L4.3 5.7L0 5L4.3 4.3L5 0Z"
                fill="#D4A574"
                opacity="0.6"
              />
            </svg>
          </div>

          {/* The actual layout shape */}
          <div className="relative h-full w-full">
            <MiniPreview layoutId={layout.id as LayoutId} className="h-full w-full" />
          </div>

          {/* Print footer (bottom of mockup) */}
          <div
            className="absolute bottom-1 left-1.5 right-1.5 flex items-center justify-between text-[5.5px] tracking-[0.15em] uppercase"
            style={{ color: "#B89A8A" }}
          >
            <div className="flex items-center gap-0.5">
              <svg width="3" height="3" viewBox="0 0 10 10" fill="none" aria-hidden>
                <path
                  d="M5 0L5.7 4.3L10 5L5.7 5.7L5 10L4.3 5.7L0 5L4.3 4.3L5 0Z"
                  fill="#D4A574"
                  opacity="0.7"
                />
              </svg>
              <span>Constella</span>
            </div>
            <span className="italic" style={{ color: "#C5A39A" }}>
              14 jun
            </span>
          </div>
        </div>
      </div>

      {/* Meta - cleaner hierarchy */}
      <div
        className="flex items-baseline justify-between border-t px-3 py-2.5"
        style={{ borderColor: "rgba(225, 210, 195, 0.4)" }}
      >
        <div>
          <p className="text-[12.5px] font-semibold tracking-tight text-[#3F2A35]">
            {layout.label}
          </p>
          <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-[#8C7783]">
            <span>{layout.requiredShots} pose</span>
            <span style={{ color: "#D4A574" }}>·</span>
            <span className="italic">{tagForLayout(layout)}</span>
          </div>
        </div>
        {/* Tiny constellation glyph as accent */}
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          aria-hidden
          className="shrink-0 opacity-40 transition-opacity group-hover:opacity-70"
        >
          <path
            d="M5 0L5.7 4.3L10 5L5.7 5.7L5 10L4.3 5.7L0 5L4.3 4.3L5 0Z"
            fill="#D4A574"
          />
        </svg>
      </div>
    </motion.button>
  );
}
