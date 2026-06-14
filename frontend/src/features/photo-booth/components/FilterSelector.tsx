"use client";

import {
  PHOTO_FILTERS,
  usePhotoBoothStore,
} from "../photoBoothStore";
import type { FilterId } from "../photoBooth.config";

/**
 * FilterSelector - Compact 3-column grid of small filter chips.
 * Each chip is ~72-84px tall: a 48-56px square thumbnail + small label.
 * If no captured frame is available, the thumbnail is a neutral
 * placeholder rather than a large empty box.
 */
export function FilterSelector() {
  const selected = usePhotoBoothStore((s) => s.selectedFilter);
  const set = usePhotoBoothStore((s) => s.setSelectedFilter);
  const captured = usePhotoBoothStore((s) => s.capturedFrames);

  const thumb = captured[0];

  return (
    <div className="grid grid-cols-3 gap-2">
      {Object.values(PHOTO_FILTERS).map((f) => {
        const active = selected === f.id;
        return (
          <button
            key={f.id}
            onClick={() => set(f.id as FilterId)}
            title={f.label}
            className={`flex flex-col items-center gap-1 rounded-md border bg-white px-1 py-1.5 transition-colors ${
              active
                ? "border-[#E63946]/40 bg-[#E63946]/[0.04]"
                : "border-black/10 hover:border-black/20"
            }`}
          >
            <div
              className="h-12 w-12 shrink-0 overflow-hidden rounded-sm bg-gradient-to-br from-[#F5F1EE] to-[#E8E2DD]"
              aria-hidden={!thumb}
            >
              {thumb ? (
                <img
                  src={thumb}
                  alt=""
                  className="h-full w-full object-cover"
                  style={{ filter: f.cssFilter }}
                />
              ) : null}
            </div>
            <span
              className={`text-[9px] font-semibold leading-none ${
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
