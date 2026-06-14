"use client";

import { useState } from "react";
import { usePhotoBoothStore } from "../photoBoothStore";
import { EditorTabs, type EditorTab } from "./editor/EditorTabs";
import { FilterSelector } from "./FilterSelector";
import { StickerPanel } from "./editor/StickerPanel";
import { CaptionPanel } from "./editor/CaptionPanel";

/**
 * ResultEditorPanel - Right-side editor for the result page.
 * Divided sections, underline tabs, no nested card-in-card.
 */
export function ResultEditorPanel() {
  const [tab, setTab] = useState<EditorTab>("filter");
  const caption = usePhotoBoothStore((s) => s.caption);
  const setCaption = usePhotoBoothStore((s) => s.setCaption);
  const stickers = usePhotoBoothStore((s) => s.stickers);
  const addSticker = usePhotoBoothStore((s) => s.addSticker);
  const removeSticker = usePhotoBoothStore((s) => s.removeSticker);

  return (
    <aside className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm divide-y divide-black/[0.06]">
      <div className="p-4">
        <EditorTabs tab={tab} setTab={setTab} />
      </div>

      <div className="min-h-[200px] p-4">
        {tab === "filter" && <FilterSelector />}
        {tab === "sticker" && (
          <StickerPanel
            onAdd={addSticker}
            onRemove={removeSticker}
            stickers={stickers}
          />
        )}
        {tab === "caption" && (
          <CaptionPanel value={caption} onChange={setCaption} />
        )}
      </div>
    </aside>
  );
}
