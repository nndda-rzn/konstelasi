"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, X } from "lucide-react";
import type { MediaItem } from "../hooks/useGallery";
import { LightboxInfo } from "./LightboxInfo";

interface LightboxProps {
  image: MediaItem | null;
  onClose: () => void;
  onNavigate: (note: MediaItem["note"]) => void;
}

export function Lightbox({ image, onClose, onNavigate }: LightboxProps) {
  return (
    <AnimatePresence>
      {image && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            layoutId={image.id}
            className="relative max-h-[88vh] max-w-[90vw] overflow-hidden rounded-3xl border border-white/10 bg-[#1a1625]/90 shadow-2xl backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
          >
            <img
              src={image.imageUrl}
              alt={image.caption || ""}
              className="max-h-[75vh] w-auto object-contain"
            />
            <LightboxInfo
              image={image}
              onNavigate={onNavigate}
              onClose={onClose}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
