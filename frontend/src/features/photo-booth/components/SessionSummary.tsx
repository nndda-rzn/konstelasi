"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { usePhotoBoothStore, PHOTO_LAYOUTS, PHOTO_RATIOS } from "../photoBoothStore";
import { tagForLayout } from "../photoBooth.config";

/**
 * SessionSummary - Compact strip showing the active session settings.
 * Layout · Format · Pose · Timer — inline, refined, Constella-styled.
 */
export function SessionSummary() {
  const selectedLayoutId = usePhotoBoothStore((s) => s.selectedLayoutId);
  const selectedRatioId = usePhotoBoothStore((s) => s.selectedRatioId);
  const selectedTimer = usePhotoBoothStore((s) => s.selectedTimer);

  const layout = selectedLayoutId ? PHOTO_LAYOUTS[selectedLayoutId] : null;
  const ratio = PHOTO_RATIOS[selectedRatioId];

  const items = useMemo(() => {
    const out: { label: string; value: string; italic?: boolean }[] = [];
    if (layout) {
      out.push({ label: "Layout", value: layout.label });
    }
    out.push({ label: "Format", value: ratio.name, italic: true });
    if (layout) {
      out.push({ label: "Pose", value: `${layout.requiredShots}` });
    }
    out.push({ label: "Timer", value: `${selectedTimer}s` });
    return out;
  }, [layout, ratio.name, selectedTimer]);

  if (!layout) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[11px]"
    >
      {/* Layout eyebrow */}
      <div className="flex items-center gap-1.5">
        <svg
          width="7"
          height="7"
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
          className="text-[9.5px] font-semibold tracking-[0.22em] uppercase"
          style={{ color: "#9D7B3F" }}
        >
          Sesi
        </span>
      </div>

      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <span
            className="text-[9.5px] font-medium tracking-[0.18em] uppercase"
            style={{ color: "#9D7B8A" }}
          >
            {item.label}
          </span>
          <span
            className={`text-[12px] font-medium tracking-tight ${
              item.italic ? "italic" : ""
            }`}
            style={{ color: "#3F2A35" }}
          >
            {item.value}
          </span>
        </div>
      ))}

      {/* Decorative star tail */}
      <div className="flex items-center gap-0.5 opacity-60">
        <svg width="5" height="5" viewBox="0 0 10 10" fill="none" aria-hidden>
          <path
            d="M5 0L5.7 4.3L10 5L5.7 5.7L5 10L4.3 5.7L0 5L4.3 4.3L5 0Z"
            fill="#D4A574"
            opacity="0.7"
          />
        </svg>
        <svg width="4" height="4" viewBox="0 0 10 10" fill="none" aria-hidden>
          <path
            d="M5 0L5.7 4.3L10 5L5.7 5.7L5 10L4.3 5.7L0 5L4.3 4.3L5 0Z"
            fill="#D4A574"
            opacity="0.4"
          />
        </svg>
      </div>
    </motion.div>
  );
}

// Keep tagForLayout import (used by parent) - hack: just re-export
export { tagForLayout };
