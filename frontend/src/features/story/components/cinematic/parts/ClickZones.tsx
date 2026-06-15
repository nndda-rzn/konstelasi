"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface ClickZonesProps {
  onPrev: () => void;
  onNext: () => void;
}

/**
 * ClickZones - Two invisible buttons (left and right thirds) that
 * trigger prev/next. Hover shows a faint chevron hint.
 */
export function ClickZones({ onPrev, onNext }: ClickZonesProps) {
  return (
    <>
      <button
        onClick={onPrev}
        aria-label="Sebelumnya"
        className="absolute left-0 top-16 bottom-32 w-1/3 z-[5] cursor-pointer group flex items-center justify-start pl-4"
      >
        <ChevronLeft className="w-8 h-8 text-white/0 group-hover:text-white/40 transition-opacity" />
      </button>
      <button
        onClick={onNext}
        aria-label="Selanjutnya"
        className="absolute right-0 top-16 bottom-32 w-1/3 z-[5] cursor-pointer group flex items-center justify-end pr-4"
      >
        <ChevronRight className="w-8 h-8 text-white/0 group-hover:text-white/40 transition-opacity" />
      </button>
    </>
  );
}
