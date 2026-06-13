"use client";

import { motion } from "framer-motion";
import type { MediaItem } from "../hooks/useGallery";
import { CardOverlay } from "./CardOverlay";

interface ImageCardProps {
  image: MediaItem;
  index: number;
  staggerDelay: number;
  onSelect: (img: MediaItem) => void;
}

export function ImageCard({
  image,
  index,
  staggerDelay,
  onSelect,
}: ImageCardProps) {
  return (
    <motion.div
      layoutId={image.id}
      initial={{ opacity: 0, y: 24, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{
        delay: index * staggerDelay,
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="mb-4 break-inside-avoid"
    >
      <motion.button
        onClick={() => onSelect(image)}
        className="group relative w-full overflow-hidden rounded-2xl border border-white/60 bg-white/40 shadow-[0_8px_32px_rgba(84,45,55,0.08)] backdrop-blur-sm transition-shadow hover:shadow-[0_16px_48px_rgba(157,2,8,0.12)]"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
      >
        <img
          src={image.imageUrl}
          alt={image.caption || image.note?.title || ""}
          className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />
        <CardOverlay image={image} />
      </motion.button>
    </motion.div>
  );
}
