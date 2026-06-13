"use client";

import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import type { MediaItem } from "../hooks/useGallery";
import { ImageCard } from "./ImageCard";

const STAGGER_DELAY = 0.04;

interface GalleryGridProps {
  images: MediaItem[];
  onSelect: (img: MediaItem) => void;
}

export function GalleryGrid({ images, onSelect }: GalleryGridProps) {
  return (
    <LayoutGroup>
      <motion.div className="columns-2 gap-4 sm:columns-3 lg:columns-4 xl:columns-5">
        <AnimatePresence mode="popLayout">
          {images.map((img, index) => (
            <ImageCard
              key={img.id}
              image={img}
              index={index}
              staggerDelay={STAGGER_DELAY}
              onSelect={onSelect}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </LayoutGroup>
  );
}
