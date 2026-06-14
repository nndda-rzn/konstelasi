"use client";

import { usePhotoboothStore } from "../../store/usePhotoboothStore";
import { FILTERS, STRIP_COLORS, EMOJI_PALETTE } from "../../constants";
import { X } from "lucide-react";

/**
 * FilterPanel - 3-column grid of filter thumbnails.
 */
export function FilterPanel() {
  const selectedFilter = usePhotoboothStore((s) => s.selectedFilter);
  const setSelectedFilter = usePhotoboothStore((s) => s.setSelectedFilter);
  const capturedPhotos = usePhotoboothStore((s) => s.capturedPhotos);

  const hasThumb = !!capturedPhotos[0];

  return (
    <div className="grid grid-cols-3 gap-1.5">
      {FILTERS.map((f) => {
        const active = selectedFilter === f.key;
        return (
          <button
            key={f.key}
            onClick={() => setSelectedFilter(f.key)}
            className={`flex flex-col items-center gap-1 rounded border bg-white p-1.5 transition-colors ${
              active
                ? "border-[#E63946]/50 ring-1 ring-[#E63946]/20"
                : "border-black/10 hover:border-black/20"
            }`}
          >
            <div className="aspect-square w-full overflow-hidden rounded-sm bg-[#FAFAFA]">
              {hasThumb ? (
                <img
                  src={capturedPhotos[0]}
                  alt=""
                  className="h-full w-full object-cover"
                  style={{ filter: f.css }}
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

/**
 * ColorPanel - Frame color picker (only for strip/grid layouts).
 */
export function ColorPanel() {
  const selectedStripColor = usePhotoboothStore(
    (s) => s.selectedStripColor
  );
  const setSelectedStripColor = usePhotoboothStore(
    (s) => s.setSelectedStripColor
  );
  const selectedLayout = usePhotoboothStore((s) => s.selectedLayout);

  if (selectedLayout === "single") {
    return (
      <p className="py-4 text-center text-[11px] text-[#8C7783]">
        Warna frame hanya untuk mode Strip/Grid.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-1.5">
      {STRIP_COLORS.map((c) => {
        const active = selectedStripColor === c.key;
        return (
          <button
            key={c.key}
            onClick={() => setSelectedStripColor(c.key)}
            className={`flex items-center gap-2 rounded border bg-white p-2 text-left transition-colors ${
              active
                ? "border-[#E63946]/50 ring-1 ring-[#E63946]/20"
                : "border-black/10 hover:border-black/20"
            }`}
          >
            <div
              className="h-7 w-7 shrink-0 rounded"
              style={{
                backgroundColor: c.bg,
                border: c.key === "white" ? "1px solid #e5e5e5" : "1px solid rgba(0,0,0,0.06)",
              }}
            />
            <p
              className={`text-[12px] font-medium ${
                active ? "text-[#E63946]" : "text-[#3F2A35]"
              }`}
            >
              {c.label}
            </p>
          </button>
        );
      })}
    </div>
  );
}

/**
 * StickerPanel - Emoji palette + active stickers.
 */
export function StickerPanel() {
  const stickers = usePhotoboothStore((s) => s.stickers);
  const addSticker = usePhotoboothStore((s) => s.addSticker);
  const removeSticker = usePhotoboothStore((s) => s.removeSticker);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-8 gap-1">
        {EMOJI_PALETTE.map((e) => (
          <button
            key={e}
            onClick={() => addSticker(e)}
            className="flex h-8 w-8 items-center justify-center rounded text-lg text-[#3F2A35] hover:bg-[#FAFAFA]"
          >
            {e}
          </button>
        ))}
      </div>
      {stickers.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6D5561]">
            Aktif ({stickers.length})
          </p>
          <div className="flex flex-wrap gap-1">
            {stickers.map((s) => (
              <button
                key={s.id}
                onClick={() => removeSticker(s.id)}
                className="flex items-center gap-1 rounded border border-black/10 bg-white px-1.5 py-0.5 text-xs hover:bg-[#FAFAFA]"
              >
                <span>{s.emoji}</span>
                <X className="h-2.5 w-2.5 text-[#8C7783]" />
              </button>
            ))}
          </div>
        </div>
      )}
      <p className="text-[10px] text-[#8C7783]">
        Klik emoji untuk menambah. Geser di preview untuk memposisikan.
      </p>
    </div>
  );
}
