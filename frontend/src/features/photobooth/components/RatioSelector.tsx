"use client";

import { Maximize2, Square, Smartphone, Monitor, Tv } from "lucide-react";
import { RATIOS } from "../constants";
import { usePhotoboothStore } from "../store/usePhotoboothStore";

const ICONS = {
  square: Square,
  portrait: RectangleVertical,
  story: Smartphone,
  landscape: Monitor,
  ultrawide: Tv
};

// RectangleVertical fallback if not in lucide
function RectangleVertical(props: any) {
  return <Square {...props} className={props.className + " scale-x-75"} />;
}

export function RatioSelector() {
  const selectedRatio = usePhotoboothStore((s) => s.selectedRatio);
  const setSelectedRatio = usePhotoboothStore((s) => s.setSelectedRatio);

  return (
    <div className="space-y-3">
      <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#6D5561]">
        <Maximize2 className="h-3.5 w-3.5" />
        Rasio Frame
      </p>
      <div className="flex flex-wrap gap-2">
        {RATIOS.map((r) => {
          const Icon = ICONS[r.key as keyof typeof ICONS] || Square;
          return (
            <button
              key={r.key}
              onClick={() => setSelectedRatio(r.key)}
              className={`flex flex-1 min-w-[80px] flex-col items-center gap-1.5 rounded-2xl border py-2.5 transition-all ${
                selectedRatio === r.key
                  ? "border-[#E63946]/40 bg-[#E63946]/6 text-[#E63946]"
                  : "border-[#FFB8C0]/25 bg-white/50 text-[#6D5561]"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="text-[10px] font-bold">{r.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
