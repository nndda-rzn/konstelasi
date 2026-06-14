"use client";

import { RATIOS, type RatioKey } from "../constants";
import { usePhotoboothStore } from "../store/usePhotoboothStore";

/**
 * RatioSelector - Slim segmented control for 5 aspect ratios.
 */
export function RatioSelector() {
  const selectedRatio = usePhotoboothStore((s) => s.selectedRatio);
  const setSelectedRatio = usePhotoboothStore((s) => s.setSelectedRatio);

  return (
    <div className="flex w-full rounded-md border border-black/10 bg-[#FAFAFA] p-0.5">
      {RATIOS.map((r) => {
        const active = selectedRatio === r.key;
        return (
          <button
            key={r.key}
            onClick={() => setSelectedRatio(r.key as RatioKey)}
            className={`flex flex-1 items-center justify-center rounded px-1.5 py-1.5 text-[10px] font-semibold transition-colors ${
              active
                ? "bg-white text-[#3F2A35] shadow-sm"
                : "text-[#8C7783] hover:text-[#3F2A35]"
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
