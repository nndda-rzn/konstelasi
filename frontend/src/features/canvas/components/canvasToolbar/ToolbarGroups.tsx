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
    <div className="flex items-center bg-white/70 border border-[#FFB4A2]/20 rounded-lg p-0.5 shadow-sm">
      <GroupedIconButton
        active={viewMode === "canvas"}
        onClick={() => onChange("canvas")}
        title="Canvas"
        ariaLabel="Tampilan canvas"
      >
        <LayoutTemplate className="w-4 h-4" />
      </GroupedIconButton>
      <GroupedIconButton
        active={viewMode === "thread"}
        onClick={() => onChange("thread")}
        title="Thread"
        ariaLabel="Tampilan thread"
      >
        <List className="w-4 h-4" />
      </GroupedIconButton>
      <GroupedIconButton
        active={viewMode === "timeline"}
        onClick={() => onChange("timeline")}
        title="Timeline"
        ariaLabel="Tampilan timeline"
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
    <div className="flex items-center bg-white/70 border border-[#FFB4A2]/20 rounded-lg p-0.5 shadow-sm">
      <GroupedIconButton
        active={activePanel === "tag"}
        onClick={() => onToggle("tag")}
        title="Tags"
        ariaLabel="Buka panel tags"
        badge={selectedTagFiltersCount}
      >
        <TagIcon className="w-4 h-4" />
      </GroupedIconButton>
      <GroupedIconButton
        active={activePanel === "stats"}
        onClick={() => onToggle("stats")}
        title="Statistik"
        ariaLabel="Buka panel statistik"
      >
        <BarChart3 className="w-4 h-4" />
      </GroupedIconButton>
      <GroupedIconButton
        active={activePanel === "calendar"}
        onClick={() => onToggle("calendar")}
        title="Kalender"
        ariaLabel="Buka panel kalender"
      >
        <CalendarDays className="w-4 h-4" />
      </GroupedIconButton>
      <GroupedIconButton
        active={activePanel === "archive"}
        onClick={() => onToggle("archive")}
        title="Arsip"
        ariaLabel="Buka panel arsip"
      >
        <Archive className="w-4 h-4" />
      </GroupedIconButton>
      <GroupedIconButton
        active={activePanel === "export"}
        onClick={() => onToggle("export")}
        title="Export"
        ariaLabel="Buka panel export"
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
      title="Auto-Organize: rapikan node otomatis"
      aria-label="Rapikan layout otomatis"
      className="p-2 rounded-lg bg-white/70 border border-[#FFB4A2]/20 shadow-sm text-[#5A3E4C]/60 hover:text-[#FF8FA3] hover:bg-white hover:border-[#FF8FA3]/30 transition-all"
    >
      <Wand2 className="w-4 h-4" />
    </button>
  );
}
