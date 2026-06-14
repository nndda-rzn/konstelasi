"use client";

import { motion } from "framer-motion";
import { usePhotoBoothStore, selectRequiredShots } from "../photoBoothStore";

/**
 * PoseProgress - Visual pose tracker with slots.
 * Always shows all required slots: empty (dashed) or filled (thumbnail).
 * Active slot (currently being captured) gets a subtle highlight.
 */
export function PoseProgress() {
  const captured = usePhotoBoothStore((s) => s.capturedFrames);
  const required = usePhotoBoothStore(selectRequiredShots);
  const phase = usePhotoBoothStore((s) => s.phase);

  const isActive = phase === "countdown" || phase === "capturing";
  const nextSlot = captured.length;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-[9.5px] font-medium tracking-[0.22em] uppercase" style={{ color: "#9D7B8A" }}>
        Pose · <span className="text-[#9D7B3F]">{captured.length}</span> / {required}
      </div>
      <div className="flex items-center gap-1.5">
        {Array.from({ length: required }).map((_, i) => {
          const isCaptured = i < captured.length;
          const isNext = i === nextSlot && isActive;
          return (
            <motion.div
              key={i}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              transition={{ duration: 0.3, delay: isCaptured ? 0 : i * 0.04 }}
              className="relative h-9 w-9 overflow-hidden rounded-md"
              style={{
                border: isNext
                  ? "1.5px solid #D4A574"
                  : isCaptured
                    ? "1px solid rgba(212, 165, 116, 0.4)"
                    : "1px dashed rgba(212, 165, 116, 0.25)",
                background: isCaptured
                  ? "transparent"
                  : "rgba(255, 245, 247, 0.6)",
                boxShadow: isNext
                  ? "0 0 0 3px rgba(212, 165, 116, 0.2), 0 1px 2px rgba(60, 30, 40, 0.05)"
                  : "none",
              }}
            >
              {isCaptured && captured[i] && (
                <img
                  src={captured[i]}
                  alt=""
                  className="h-full w-full object-cover"
                />
              )}
              {!isCaptured && !isNext && (
                <div className="flex h-full w-full items-center justify-center text-[10px] text-[#B89A8A]">
                  {i + 1}
                </div>
              )}
              {isNext && (
                <motion.div
                  className="flex h-full w-full items-center justify-center"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
                    <path
                      d="M5 0L5.7 4.3L10 5L5.7 5.7L5 10L4.3 5.7L0 5L4.3 4.3L5 0Z"
                      fill="#9D7B3F"
                    />
                  </svg>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// Re-export under old name for compatibility
export { PoseProgress as CapturedThumbs };
