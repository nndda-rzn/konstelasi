"use client";

import { useState } from "react";
import { Palette, Smile, Type } from "lucide-react";
import { FilterSelector } from "./FilterSelector";
import { usePhotoBoothStore } from "../photoBoothStore";
import { EMOJI_PALETTE } from "../photoBooth.types";
import { X } from "lucide-react";

type ResultTab = "filter" | "sticker" | "caption";

/**
 * ResultEditorPanel - Right-side editor for the result page.
 * Divided sections, underline tabs, no nested card-in-card.
 */
export function ResultEditorPanel() {
  const [tab, setTab] = useState<ResultTab>("filter");
  const caption = usePhotoBoothStore((s) => s.caption);
  const setCaption = usePhotoBoothStore((s) => s.setCaption);
  const stickers = usePhotoBoothStore((s) => s.stickers);
  const addSticker = usePhotoBoothStore((s) => s.addSticker);
  const removeSticker = usePhotoBoothStore((s) => s.removeSticker);

  return (
    <aside className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm divide-y divide-black/[0.06]">
      <div className="p-4">
        <Tabs tab={tab} setTab={setTab} />
      </div>

      <div className="min-h-[200px] p-4">
        {tab === "filter" && <FilterSelector />}
        {tab === "sticker" && <StickerPanel onAdd={addSticker} onRemove={removeSticker} stickers={stickers} />}
        {tab === "caption" && <CaptionPanel value={caption} onChange={setCaption} />}
      </div>
    </aside>
  );
}

function Tabs({ tab, setTab }: { tab: ResultTab; setTab: (t: ResultTab) => void }) {
  const items: { key: ResultTab; label: string; icon: any }[] = [
    { key: "filter", label: "Filter", icon: Palette },
    { key: "sticker", label: "Stiker", icon: Smile },
    { key: "caption", label: "Caption", icon: Type },
  ];
  return (
    <div className="-mb-px flex gap-4">
      {items.map(({ key, label, icon: Icon }) => {
        const active = tab === key;
        return (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-1.5 border-b-2 pb-2 text-[12px] font-semibold transition-colors ${
              active
                ? "border-[#E63946] text-[#3F2A35]"
                : "border-transparent text-[#8C7783] hover:text-[#3F2A35]"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        );
      })}
    </div>
  );
}

function StickerPanel({
  stickers,
  onAdd,
  onRemove,
}: {
  stickers: ReturnType<typeof usePhotoBoothStore.getState>["stickers"];
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

function CaptionPanel({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor="photobooth-result-caption"
        className="block text-[10px] font-semibold uppercase tracking-wider text-[#6D5561]"
      >
        Caption
      </label>
      <input
        id="photobooth-result-caption"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Tulis caption..."
        maxLength={60}
        className="h-9 w-full rounded border border-black/10 bg-white px-3 text-[13px] text-[#3F2A35] outline-none placeholder:text-[#8C7783]/70 focus:border-[#E63946]/40"
      />
      <p className="text-[10px] text-[#8C7783]">
        Caption akan ditampilkan di area bawah hasil akhir.
      </p>
    </div>
  );
}
