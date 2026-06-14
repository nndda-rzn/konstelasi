"use client";

import { motion } from "framer-motion";
import { usePhotoboothStore } from "../store/usePhotoboothStore";
import { FILTERS, type LayoutDef } from "../constants";

interface CapturedThumbsProps {
  layoutDef: LayoutDef;
}

/**
 * CapturedThumbs - Displays small thumbnails of photos taken so far.
 */
export function CapturedThumbs({ layoutDef }: CapturedThumbsProps) {
  const capturedPhotos = usePhotoboothStore((s) => s.capturedPhotos);
  const selectedFilter = usePhotoboothStore((s) => s.selectedFilter);
  
  const filterCss = FILTERS.find((f) => f.key === selectedFilter)?.css || "";

  if (capturedPhotos.length === 0) return null;

  return (
    <div className="flex justify-center gap-3">
      {capturedPhotos.map((p, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="h-14 w-[74px] overflow-hidden rounded-lg border-2 border-[#E63946]/30 shadow-md bg-black/5"
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
          className="h-14 w-[74px] rounded-lg border-2 border-dashed border-[#FFB8C0]/40 bg-white/30"
        />
      ))}
    </div>
  );
}
