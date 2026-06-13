"use client";

import { RefObject } from "react";
import StreakWidget from "@/features/canvas/components/StreakWidget";
import { CanvasToolbarBrand } from "./canvasToolbar/CanvasToolbarBrand";
import { HistoryControls } from "./canvasToolbar/HistoryControls";
import { SearchInput } from "./canvasToolbar/SearchInput";
import {
  ViewModeGroup,
  PanelGroup,
  AutoLayoutButton,
} from "./canvasToolbar/ToolbarGroups";
import type { CanvasViewMode, CanvasActivePanel } from "./canvasToolbar/canvasToolbarTypes";

export type { CanvasViewMode, CanvasActivePanel } from "./canvasToolbar/canvasToolbarTypes";

interface Props {
  searchInputRef: RefObject<HTMLInputElement | null>;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  viewMode: CanvasViewMode;
  onViewModeChange: (mode: CanvasViewMode) => void;
  activePanel: CanvasActivePanel;
  onTogglePanel: (panel: Exclude<CanvasActivePanel, null>) => void;
  onActivateSearchPanel: () => void;
  selectedTagFiltersCount: number;
  onApplyAutoLayout: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}

export default function CanvasToolbar({
  searchInputRef,
  searchQuery,
  onSearchQueryChange,
  viewMode,
  onViewModeChange,
  activePanel,
  onTogglePanel,
  onActivateSearchPanel,
  selectedTagFiltersCount,
  onApplyAutoLayout,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}: Props) {
  return (
    <div className="absolute top-0 left-0 right-0 h-14 bg-[#FFFAF7]/85 backdrop-blur-2xl border-b border-[#FFB4A2]/20 shadow-sm shadow-pink-100/30 z-10 flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <CanvasToolbarBrand />
        <HistoryControls
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={onUndo}
          onRedo={onRedo}
        />
        <SearchInput
          searchInputRef={searchInputRef}
          searchQuery={searchQuery}
          onChange={onSearchQueryChange}
          onFocus={onActivateSearchPanel}
        />
      </div>

      <div className="flex items-center gap-2">
        <ViewModeGroup viewMode={viewMode} onChange={onViewModeChange} />
        <AutoLayoutButton onClick={onApplyAutoLayout} />
        <PanelGroup
          activePanel={activePanel}
          onToggle={onTogglePanel}
          selectedTagFiltersCount={selectedTagFiltersCount}
        />
        <div className="hidden lg:block pl-1 border-l border-[#FFB4A2]/20 ml-1">
          <StreakWidget />
        </div>
      </div>
    </div>
  );
}
