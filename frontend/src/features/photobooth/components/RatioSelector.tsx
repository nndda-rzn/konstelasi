"use client";

import { RATIOS, type RatioKey } from "../constants";
import { usePhotoboothStore } from "../store/usePhotoboothStore";

/**
 * RatioSelector - Slim segmented control for 5 aspect ratios.
 * Single horizontal row, h-7, no per-item card.
 */
export function RatioSelector() {
  const selectedRatio = usePhotoboothStore((s) => s.selectedRatio);
  const setSelectedRatio = usePhotoboothStore((s) => s.setSelectedRatio);

  return (
    <div className="flex w-full rounded-xl border border-[#FFB8C0]/20 bg-white/55 p-0.5 backdrop-blur-md">
      {RATIOS.map((r) => {
        const active = selectedRatio === r.key;
        return (
          <button
            key={r.key}
            onClick={() => setSelectedRatio(r.key as RatioKey)}
            className={`flex flex-1 items-center justify-center rounded-lg px-1.5 py-1.5 text-[10px] font-bold transition-all ${
              active
                ? "bg-[#E63946] text-white shadow-sm"
                : "text-[#6D5561] hover:text-[#3F2A35]"
            }`}
            title={r.desc}
          >
            {r.label}
          </button>
        );
      })}
    </div>
  );
}
