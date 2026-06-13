"use client";

import { usePhotoboothStore } from "../../store/usePhotoboothStore";
import { FILTERS, STRIP_COLORS, EMOJI_PALETTE } from "../../constants";
import { X } from "lucide-react";

/**
 * FilterPanel - Grid of filter thumbnails (Mono, Sepia, etc).
 */
export function FilterPanel() {
  const selectedFilter = usePhotoboothStore((s) => s.selectedFilter);
  const setSelectedFilter = usePhotoboothStore((s) => s.setSelectedFilter);
  const capturedPhotos = usePhotoboothStore((s) => s.capturedPhotos);

  return (
    <div className="grid grid-cols-4 gap-2">
      {FILTERS.map((f) => (
        <button
          key={f.key}
          onClick={() => setSelectedFilter(f.key)}
          className={`flex flex-col items-center gap-1.5 rounded-2xl border p-2 transition-all ${
            selectedFilter === f.key
              ? "border-[#E63946]/40 bg-[#E63946]/6"
              : "border-[#FFB8C0]/20 bg-white/50 hover:border-[#FFB8C0]/40"
          }`}
        >
          {capturedPhotos[0] && (
            <div className="h-10 w-10 overflow-hidden rounded-lg">
              <img
                src={capturedPhotos[0]}
                alt=""
                className="h-full w-full object-cover"
                style={{ filter: f.css }}
              />
            </div>
          )}
          <span
            className={`text-[10px] font-semibold ${
              selectedFilter === f.key ? "text-[#E63946]" : "text-[#6D5561]"
            }`}
          >
            {f.label}
          </span>
        </button>
      ))}
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
      <p className="text-xs text-[#8C7783] text-center py-4">
        Warna frame hanya untuk mode Strip/Grid.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {STRIP_COLORS.map((c) => (
        <button
          key={c.key}
          onClick={() => setSelectedStripColor(c.key)}
          className={`rounded-2xl border p-3 text-left transition-all ${
            selectedStripColor === c.key
              ? "border-[#E63946]/40 bg-[#E63946]/6"
              : "border-[#FFB8C0]/20 bg-white/50 hover:border-[#FFB8C0]/40"
          }`}
        >
          <div
            className="mb-2 h-6 w-full rounded-lg"
            style={{
              backgroundColor: c.bg,
              border: c.key === "white" ? "1px solid #eee" : "none",
            }}
          />
          <p
            className={`text-xs font-bold ${
              selectedStripColor === c.key
                ? "text-[#E63946]"
                : "text-[#3F2A35]"
            }`}
          >
            {c.label}
          </p>
        </button>
      ))}
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
      <div className="grid grid-cols-8 gap-1.5">
        {EMOJI_PALETTE.map((e) => (
          <button
            key={e}
            onClick={() => addSticker(e)}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-xl hover:bg-[#FFE5E8]/60 transition-colors"
          >
            {e}
          </button>
        ))}
      </div>
      {stickers.length > 0 && (
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#6D5561]">
            Aktif ({stickers.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {stickers.map((s) => (
              <button
                key={s.id}
                onClick={() => removeSticker(s.id)}
                className="flex items-center gap-1 rounded-full border border-[#FFB8C0]/30 bg-white/60 px-2 py-1 text-sm hover:bg-red-50 hover:border-red-200 transition-all"
              >
                {s.emoji}
                <X className="h-3 w-3 text-[#8C7783]" />
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
