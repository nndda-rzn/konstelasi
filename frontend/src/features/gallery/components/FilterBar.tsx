"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { GalleryFilter } from "../hooks/useGallery";

const FILTER_OPTIONS: { key: GalleryFilter; label: string }[] = [
  { key: "all", label: "Semua" },
  { key: "canvas", label: "Canvas" },
  { key: "story", label: "Story" },
];

interface FilterBarProps {
  filter: GalleryFilter;
  setFilter: (f: GalleryFilter) => void;
}

export function FilterBar({ filter, setFilter }: FilterBarProps) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="overflow-hidden border-t border-[#E6B8A2]/10"
    >
      <div className="mx-auto flex max-w-7xl gap-2 px-6 py-3">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setFilter(opt.key)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
              filter === opt.key
                ? "bg-gradient-to-r from-[#9D0208] to-[#E63946] text-white shadow-sm"
                : "border border-[#E6B8A2]/30 bg-white/50 text-[#5A3E4C]/55 hover:border-[#E6B8A2]/50"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
