"use client";

import { usePhotoboothStore } from "../store/usePhotoboothStore";
import { EditorTabs } from "./editorSidebar/EditorTabs";
import {
  FilterPanel,
  ColorPanel,
  StickerPanel,
} from "./editorSidebar/FilterColorStickerPanels";
import { CaptionInput } from "./editorSidebar/CaptionInput";
import { EditorActions } from "./editorSidebar/EditorActions";

interface EditorSidebarProps {
  onSave: () => void;
  onDownload: () => void;
  onRetake: () => void;
}

/**
 * EditorSidebar - Single unified panel with divided sections.
 * Tabs → content → caption → actions. Width set by parent grid (360px).
 */
export function EditorSidebar({
  onSave,
  onDownload,
  onRetake,
}: EditorSidebarProps) {
  const activeTab = usePhotoboothStore((s) => s.activeTab);

  return (
    <aside className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm divide-y divide-black/[0.06]">
      <div className="p-4">
        <EditorTabs />
      </div>

      <div className="min-h-[180px] p-4">
        {activeTab === "filter" && <FilterPanel />}
        {activeTab === "color" && <ColorPanel />}
        {activeTab === "sticker" && <StickerPanel />}
      </div>

      <div className="p-4">
        <CaptionInput />
      </div>

      <div className="p-4">
        <EditorActions
          onSave={onSave}
          onDownload={onDownload}
          onRetake={onRetake}
        />
      </div>
    </aside>
  );
}
