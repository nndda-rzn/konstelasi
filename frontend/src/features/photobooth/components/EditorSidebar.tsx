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
 * EditorSidebar - Tabs (filter/color/sticker) + caption input + action buttons.
 * Pure composition: subscribes to store; calls parent handlers for save/download/retake.
 */
export function EditorSidebar({
  onSave,
  onDownload,
  onRetake,
}: EditorSidebarProps) {
  const activeTab = usePhotoboothStore((s) => s.activeTab);

  return (
    <div className="flex flex-col gap-4">
      <EditorTabs />
      {activeTab === "filter" && <FilterPanel />}
      {activeTab === "color" && <ColorPanel />}
      {activeTab === "sticker" && <StickerPanel />}
      <CaptionInput />
      <EditorActions
        onSave={onSave}
        onDownload={onDownload}
        onRetake={onRetake}
      />
    </div>
  );
}
