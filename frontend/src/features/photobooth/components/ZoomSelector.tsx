"use client";

import { ZOOM_LEVELS } from "../constants";
import { usePhotoboothStore } from "../store/usePhotoboothStore";

export function ZoomSelector() {
  const selectedZoom = usePhotoboothStore((s) => s.zoomLevel);
  const setZoomLevel = usePhotoboothStore((s) => s.setZoomLevel);

  return (
    <div className="space-y-3">
      <p className="text-[11px] font-bold uppercase tracking-widest text-[#6D5561]">Sudut Pandang</p>
      <div className="grid grid-cols-4 gap-2">
        {ZOOM_LEVELS.map((z) => (
          <button
            key={z.key}
            onClick={() => setZoomLevel(z.key)}
            className={`rounded-xl border py-2 text-center transition-all ${
              selectedZoom === z.key
                ? "border-[#E63946]/40 bg-[#E63946]/6 text-[#E63946] font-bold"
                : "border-[#FFB8C0]/25 bg-white/50 text-[#6D5561] text-[10px]"
            }`}
          >
            <span className={selectedZoom === z.key ? "text-[10px]" : ""}>{z.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
