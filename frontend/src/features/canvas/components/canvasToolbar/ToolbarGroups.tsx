"use client";

import {
  Archive,
  BarChart3,
  CalendarDays,
  Clock,
  Download,
  LayoutTemplate,
  List,
  Tag as TagIcon,
  Wand2,
} from "lucide-react";
import { GroupedIconButton } from "./GroupedIconButton";
import type { CanvasViewMode, CanvasActivePanel } from "./canvasToolbarTypes";

interface ViewModeGroupProps {
  viewMode: CanvasViewMode;
  onChange: (mode: CanvasViewMode) => void;
}

export function ViewModeGroup({ viewMode, onChange }: ViewModeGroupProps) {
  return (
    <div className="flex items-center bg-[#F7F1EA]/70 border border-[rgba(47,39,48,0.06)] rounded-[10px] p-0.5">
      <GroupedIconButton
        active={viewMode === "canvas"}
        onClick={() => onChange("canvas")}
        title="Canvas"
        ariaLabel="Canvas view"
      >
        <LayoutTemplate className="w-4 h-4" />
      </GroupedIconButton>
      <GroupedIconButton
        active={viewMode === "thread"}
        onClick={() => onChange("thread")}
        title="Thread"
        ariaLabel="Thread view"
      >
        <List className="w-4 h-4" />
      </GroupedIconButton>
      <GroupedIconButton
        active={viewMode === "timeline"}
        onClick={() => onChange("timeline")}
        title="Timeline"
        ariaLabel="Timeline view"
      >
        <Clock className="w-4 h-4" />
      </GroupedIconButton>
    </div>
  );
}

interface PanelGroupProps {
  activePanel: CanvasActivePanel;
  onToggle: (panel: Exclude<CanvasActivePanel, null>) => void;
  selectedTagFiltersCount: number;
}

export function PanelGroup({
  activePanel,
  onToggle,
  selectedTagFiltersCount,
}: PanelGroupProps) {
  return (
    <div className="flex items-center bg-[#F7F1EA]/70 border border-[rgba(47,39,48,0.06)] rounded-[10px] p-0.5">
      <GroupedIconButton
        active={activePanel === "tag"}
        onClick={() => onToggle("tag")}
        title="Tags"
        ariaLabel="Open tags panel"
        badge={selectedTagFiltersCount}
      >
        <TagIcon className="w-4 h-4" />
      </GroupedIconButton>
      <GroupedIconButton
        active={activePanel === "stats"}
        onClick={() => onToggle("stats")}
        title="Statistics"
        ariaLabel="Open statistics panel"
      >
        <BarChart3 className="w-4 h-4" />
      </GroupedIconButton>
      <GroupedIconButton
        active={activePanel === "calendar"}
        onClick={() => onToggle("calendar")}
        title="Calendar"
        ariaLabel="Open calendar panel"
      >
        <CalendarDays className="w-4 h-4" />
      </GroupedIconButton>
      <GroupedIconButton
        active={activePanel === "archive"}
        onClick={() => onToggle("archive")}
        title="Archive"
        ariaLabel="Open archive panel"
      >
        <Archive className="w-4 h-4" />
      </GroupedIconButton>
      <GroupedIconButton
        active={activePanel === "export"}
        onClick={() => onToggle("export")}
        title="Export"
        ariaLabel="Open export panel"
      >
        <Download className="w-4 h-4" />
      </GroupedIconButton>
    </div>
  );
}

interface AutoLayoutButtonProps {
  onClick: () => void;
}

export function AutoLayoutButton({ onClick }: AutoLayoutButtonProps) {
  return (
    <button
      onClick={onClick}
      title="Auto-organize"
      aria-label="Auto-organize layout"
      className="p-2 rounded-[10px] bg-[#F7F1EA]/70 border border-[rgba(47,39,48,0.06)] text-[#6F626A] hover:text-[#B84A5A] hover:bg-[#FFFCF8] hover:border-[#C99A45]/40 transition-colors"
    >
      <Wand2 className="w-4 h-4" />
    </button>
  );
}
