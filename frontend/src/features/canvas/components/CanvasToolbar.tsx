'use client';

import { RefObject } from 'react';
import {
  Sparkles,
  Search,
  Download,
  LayoutTemplate,
  List,
  Tag as TagIcon,
  Clock,
  BarChart3,
  Archive,
  Wand2,
  Undo2,
  Redo2,
  CalendarDays,
} from 'lucide-react';
import StreakWidget from '@/features/canvas/components/StreakWidget';

export type CanvasViewMode = 'canvas' | 'thread' | 'timeline';
export type CanvasActivePanel =
  | 'tag'
  | 'search'
  | 'stats'
  | 'archive'
  | 'export'
  | 'calendar'
  | null;

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

/** Icon-only button inside a grouped container. Active state uses pink tint. */
function GroupedIconButton({
  active,
  onClick,
  title,
  ariaLabel,
  children,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  ariaLabel: string;
  children: React.ReactNode;
  badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      aria-label={ariaLabel}
      aria-pressed={active}
      className={`relative p-1.5 rounded-lg transition-all ${
        active
          ? 'bg-white text-[#FF8FA3] shadow-sm'
          : 'text-[#5A3E4C]/50 hover:text-[#5A3E4C] hover:bg-white/60'
      }`}
    >
      {children}
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#FF8FA3] text-white text-[9px] flex items-center justify-center font-bold ring-2 ring-[#FFFAF7]">
          {badge}
        </span>
      )}
    </button>
  );
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
      {/* ── LEFT: Brand + Undo/Redo + Search ── */}
      <div className="flex items-center gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2 pr-3 border-r border-[#FFB4A2]/20">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF8FA3] to-[#FFB4A2] flex items-center justify-center shadow-md shadow-pink-300/40">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <h1 className="text-base font-bold bg-gradient-to-r from-[#FF8FA3] via-[#FFB4A2] to-[#FFD6A5] bg-clip-text text-transparent tracking-tight hidden sm:block">
            Konstelasi
          </h1>
        </div>

        {/* Undo/Redo */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            aria-label="Undo"
            className={`p-1.5 rounded-lg transition-all ${
              canUndo
                ? 'text-[#5A3E4C]/60 hover:text-[#5A3E4C] hover:bg-[#FFB4A2]/15'
                : 'text-[#5A3E4C]/15 cursor-not-allowed'
            }`}
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Shift+Z)"
            aria-label="Redo"
            className={`p-1.5 rounded-lg transition-all ${
              canRedo
                ? 'text-[#5A3E4C]/60 hover:text-[#5A3E4C] hover:bg-[#FFB4A2]/15'
                : 'text-[#5A3E4C]/15 cursor-not-allowed'
            }`}
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="hidden md:flex items-center relative ml-1">
          <Search className="w-3.5 h-3.5 text-[#5A3E4C]/40 absolute left-3 z-10 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Cari catatan..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            onFocus={onActivateSearchPanel}
            aria-label="Cari catatan"
            className="w-56 bg-white/70 border border-[#FFB4A2]/20 rounded-full pl-8 pr-3 py-1.5 text-sm text-[#5A3E4C] placeholder-[#5A3E4C]/35 focus:outline-none focus:ring-2 focus:ring-[#FF8FA3]/30 focus:border-[#FF8FA3]/40 focus:bg-white transition-all hover:bg-white/90"
          />
          <kbd className="hidden lg:inline-block absolute right-2.5 px-1.5 py-0.5 text-[10px] font-mono text-[#5A3E4C]/40 bg-[#FFB4A2]/10 rounded">
            ⌘F
          </kbd>
        </div>
      </div>

      {/* ── RIGHT: View modes + Actions + Streak ── */}
      <div className="flex items-center gap-2">
        {/* View Mode Group */}
        <div className="flex items-center bg-white/70 border border-[#FFB4A2]/20 rounded-lg p-0.5 shadow-sm">
          <GroupedIconButton
            active={viewMode === 'canvas'}
            onClick={() => onViewModeChange('canvas')}
            title="Canvas"
            ariaLabel="Tampilan canvas"
          >
            <LayoutTemplate className="w-4 h-4" />
          </GroupedIconButton>
          <GroupedIconButton
            active={viewMode === 'thread'}
            onClick={() => onViewModeChange('thread')}
            title="Thread"
            ariaLabel="Tampilan thread"
          >
            <List className="w-4 h-4" />
          </GroupedIconButton>
          <GroupedIconButton
            active={viewMode === 'timeline'}
            onClick={() => onViewModeChange('timeline')}
            title="Timeline"
            ariaLabel="Tampilan timeline"
          >
            <Clock className="w-4 h-4" />
          </GroupedIconButton>
        </div>

        {/* Auto Layout (standalone) */}
        <button
          onClick={onApplyAutoLayout}
          title="Auto-Organize: rapikan node otomatis"
          aria-label="Rapikan layout otomatis"
          className="p-2 rounded-lg bg-white/70 border border-[#FFB4A2]/20 shadow-sm text-[#5A3E4C]/60 hover:text-[#FF8FA3] hover:bg-white hover:border-[#FF8FA3]/30 transition-all"
        >
          <Wand2 className="w-4 h-4" />
        </button>

        {/* Panel Group: Tags / Stats / Calendar / Archive / Export */}
        <div className="flex items-center bg-white/70 border border-[#FFB4A2]/20 rounded-lg p-0.5 shadow-sm">
          <GroupedIconButton
            active={activePanel === 'tag'}
            onClick={() => onTogglePanel('tag')}
            title="Tags"
            ariaLabel="Buka panel tags"
            badge={selectedTagFiltersCount}
          >
            <TagIcon className="w-4 h-4" />
          </GroupedIconButton>
          <GroupedIconButton
            active={activePanel === 'stats'}
            onClick={() => onTogglePanel('stats')}
            title="Statistik"
            ariaLabel="Buka panel statistik"
          >
            <BarChart3 className="w-4 h-4" />
          </GroupedIconButton>
          <GroupedIconButton
            active={activePanel === 'calendar'}
            onClick={() => onTogglePanel('calendar')}
            title="Kalender"
            ariaLabel="Buka panel kalender"
          >
            <CalendarDays className="w-4 h-4" />
          </GroupedIconButton>
          <GroupedIconButton
            active={activePanel === 'archive'}
            onClick={() => onTogglePanel('archive')}
            title="Arsip"
            ariaLabel="Buka panel arsip"
          >
            <Archive className="w-4 h-4" />
          </GroupedIconButton>
          <GroupedIconButton
            active={activePanel === 'export'}
            onClick={() => onTogglePanel('export')}
            title="Export"
            ariaLabel="Buka panel export"
          >
            <Download className="w-4 h-4" />
          </GroupedIconButton>
        </div>

        {/* Streak (subtle, hidden on small screens) */}
        <div className="hidden lg:block pl-1 border-l border-[#FFB4A2]/20 ml-1">
          <StreakWidget />
        </div>
      </div>
    </div>
  );
}
