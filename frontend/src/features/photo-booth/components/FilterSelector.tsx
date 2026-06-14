"use client";

import {
  PHOTO_FILTERS,
  usePhotoBoothStore,
} from "../photoBoothStore";
import type { FilterId } from "../photoBooth.config";

export function FilterSelector() {
  const selected = usePhotoBoothStore((s) => s.selectedFilter);
  const set = usePhotoBoothStore((s) => s.setSelectedFilter);
  const captured = usePhotoBoothStore((s) => s.capturedFrames);

  return (
    <div className="grid grid-cols-3 gap-1.5">
      {Object.values(PHOTO_FILTERS).map((f) => {
        const active = selected === f.id;
        const thumb = captured[0];
        return (
          <button
            key={f.id}
            onClick={() => set(f.id as FilterId)}
            className={`flex flex-col items-center gap-1 rounded border bg-white p-1.5 transition-colors ${
              active
                ? "border-[#E63946]/50 ring-1 ring-[#E63946]/20"
                : "border-black/10 hover:border-black/20"
            }`}
          >
            <div className="aspect-square w-full overflow-hidden rounded-sm bg-[#FAFAFA]">
              {thumb ? (
                <img
                  src={thumb}
                  alt=""
                  className="h-full w-full object-cover"
                  style={{ filter: f.cssFilter }}
                />
              ) : (
                <div className="h-full w-full bg-[#FAFAFA]" />
              )}
            </div>
            <span
              className={`text-[10px] font-medium ${
                active ? "text-[#E63946]" : "text-[#6D5561]"
              }`}
            >
              {f.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
