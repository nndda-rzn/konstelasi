"use client";

import { RATIO_LIST, usePhotoBoothStore } from "../photoBoothStore";
import { Square, Monitor, Smartphone, Tv, RectangleVertical } from "lucide-react";
import type { RatioId } from "../photoBooth.config";
import type { ComponentType } from "react";

const ICONS: Record<RatioId, ComponentType<{ className?: string }>> = {
  square: Square,
  portrait: RectangleVertical,
  story: Smartphone,
  wide: Monitor,
  ultraWide: Tv,
};

export function RatioSelector() {
  const selected = usePhotoBoothStore((s) => s.selectedRatioId);
  const set = usePhotoBoothStore((s) => s.setSelectedRatio);

  return (
    <div className="flex w-full gap-1 rounded-md border border-black/10 bg-[#FAFAFA] p-0.5">
      {RATIO_LIST.map((r) => {
        const Icon = ICONS[r.id] || Square;
        const active = selected === r.id;
        return (
          <button
            key={r.id}
            onClick={() => set(r.id)}
            title={r.name}
            className={`flex flex-1 flex-col items-center gap-0.5 rounded px-1.5 py-1.5 text-[10px] font-semibold transition-colors ${
              active
                ? "bg-white text-[#3F2A35] shadow-sm"
                : "text-[#8C7783] hover:text-[#3F2A35]"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            <span>{r.label}</span>
          </button>
        );
      })}
    </div>
  );
}
