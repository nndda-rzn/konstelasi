"use client";

import { motion } from "framer-motion";
import { usePhotoBoothStore, selectRequiredShots } from "../photoBoothStore";

/**
 * CapturedThumbs - Compact row of thumbnails shown between preview and
 * capture bar once photos are captured.
 */
export function CapturedThumbs() {
  const captured = usePhotoBoothStore((s) => s.capturedFrames);
  const required = usePhotoBoothStore(selectRequiredShots);

  if (captured.length === 0) return null;

  return (
    <div className="flex justify-center gap-1.5">
      {captured.map((p, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="h-10 w-10 overflow-hidden rounded-md border border-black/10 bg-black/5"
        >
          <img src={p} alt="" className="h-full w-full object-cover" />
        </motion.div>
      ))}
      {Array.from({ length: required - captured.length }).map((_, i) => (
        <div
          key={`e${i}`}
          className="h-10 w-10 rounded-md border border-dashed border-black/15 bg-[#FAFAFA]"
        />
      ))}
    </div>
  );
}
