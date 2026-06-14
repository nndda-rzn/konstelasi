"use client";

import { useState } from "react";
import { usePhotoBoothStore } from "../photoBoothStore";
import { getTemplateById } from "../config/templates";
import { EditorTabs, type EditorTab } from "./editor/EditorTabs";
import { FilterSelector } from "./FilterSelector";
import { TemplateSelector } from "./editor/TemplateSelector";
import { TemplateSubOptions } from "./editor/TemplateSubOptions";
import { StickerPanel } from "./editor/StickerPanel";
import { CaptionPanel } from "./editor/CaptionPanel";

/**
 * ResultEditorPanel - Right-side editor for the result page.
 *
 * Tabs: Template · Filter · Stiker · Caption
 * The Frame tab is removed; all frame styling is part of the
 * Template's sub-options.
 */
export function ResultEditorPanel() {
  const [tab, setTab] = useState<EditorTab>("template");
  const caption = usePhotoBoothStore((s) => s.caption);
  const setCaption = usePhotoBoothStore((s) => s.setCaption);
  const stickers = usePhotoBoothStore((s) => s.stickers);
  const addSticker = usePhotoBoothStore((s) => s.addSticker);
  const removeSticker = usePhotoBoothStore((s) => s.removeSticker);
  const selectedTemplateId = usePhotoBoothStore((s) => s.selectedTemplateId);

  const selectedTemplate =
    selectedTemplateId ? getTemplateById(selectedTemplateId) : null;

  return (
    <aside className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm divide-y divide-black/[0.06]">
      <div className="p-4">
        <EditorTabs tab={tab} setTab={setTab} />
      </div>

      <div className="min-h-[260px] max-h-[60vh] overflow-y-auto p-4">
        {tab === "template" && (
          <>
            <TemplateSelector />
            {selectedTemplate && (
              <TemplateSubOptions template={selectedTemplate} />
            )}
          </>
        )}
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
