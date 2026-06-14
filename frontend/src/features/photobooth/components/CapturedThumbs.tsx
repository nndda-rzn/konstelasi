"use client";

import { motion } from "framer-motion";
import { usePhotoboothStore } from "../store/usePhotoboothStore";
import { FILTERS, type LayoutDef } from "../constants";

interface CapturedThumbsProps {
  layoutDef: LayoutDef;
}

/**
 * CapturedThumbs - Compact row of small thumbnails shown once photos
 * are captured. Sits between preview and control bar.
 */
export function CapturedThumbs({ layoutDef }: CapturedThumbsProps) {
  const capturedPhotos = usePhotoboothStore((s) => s.capturedPhotos);
  const selectedFilter = usePhotoboothStore((s) => s.selectedFilter);

  const filterCss = FILTERS.find((f) => f.key === selectedFilter)?.css || "";

  if (capturedPhotos.length === 0) return null;

  return (
    <div className="flex justify-center gap-1.5">
      {capturedPhotos.map((p, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="h-10 w-10 overflow-hidden rounded-md border border-black/10 bg-black/5"
        >
          <img
            src={p}
            alt=""
            className="h-full w-full object-cover"
            style={{ filter: filterCss }}
          />
        </motion.div>
      ))}
      {Array.from({
        length: layoutDef.shots - capturedPhotos.length,
      }).map((_, i) => (
        <div
          key={`e${i}`}
          className="h-10 w-10 rounded-md border border-dashed border-black/15 bg-[#FAFAFA]"
        />
      ))}
    </div>
  );
}
