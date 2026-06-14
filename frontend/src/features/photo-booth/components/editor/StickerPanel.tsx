"use client";

import { X } from "lucide-react";
import { EMOJI_PALETTE } from "../../photoBooth.types";
import type { Sticker } from "../../photoBooth.types";

/**
 * StickerPanel - Emoji picker and active sticker list.
 */
export function StickerPanel({
  stickers,
  onAdd,
  onRemove,
}: {
  stickers: Sticker[];
  onAdd: (emoji: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-8 gap-1">
        {EMOJI_PALETTE.map((e) => (
          <button
            key={e}
            onClick={() => onAdd(e)}
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
                onClick={() => onRemove(s.id)}
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
