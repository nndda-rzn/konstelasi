'use client';

import {
  ArrowLeft,
  Settings,
  Lock,
  Globe,
  Users,
  LayoutGrid,
  Clock,
  BookOpen,
  Image,
  List,
  Film,
  Download,
  Sparkles,
  Search,
} from 'lucide-react';

export type StoryViewMode =
  | 'canvas'
  | 'timeline'
  | 'reading'
  | 'gallery'
  | 'outline'
  | 'cinematic';

const VIEW_MODES: Array<{ mode: StoryViewMode; icon: any; label: string }> = [
  { mode: 'canvas', icon: LayoutGrid, label: 'Canvas' },
  { mode: 'timeline', icon: Clock, label: 'Timeline' },
  { mode: 'reading', icon: BookOpen, label: 'Reading' },
  { mode: 'gallery', icon: Image, label: 'Gallery' },
  { mode: 'outline', icon: List, label: 'Outline' },
  { mode: 'cinematic', icon: Film, label: 'Cinematic' },
];

interface Props {
  story: {
    title?: string;
    subtitle?: string | null;
    status?: string;
    privacyLevel?: string;
  } | null;
  scrapbookFontClass: string;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  viewMode: StoryViewMode;
  onViewModeChange: (mode: StoryViewMode) => void;
  showSettings: boolean;
  onToggleSettings: () => void;
  showInsightsMenu: boolean;
  onToggleInsights: () => void;
  activeInsight: string | null;
  showExport: boolean;
  onToggleExport: () => void;
  onAddScene: () => void;
  onBack: () => void;
}

export default function StoryHeader({
  story,
  scrapbookFontClass,
  searchQuery,
  onSearchQueryChange,
  viewMode,
  onViewModeChange,
  showSettings,
  onToggleSettings,
  showInsightsMenu,
  onToggleInsights,
  activeInsight,
  showExport,
  onToggleExport,
  onAddScene,
  onBack,
}: Props) {
  const PrivIcon =
    story?.privacyLevel === 'private'
      ? Lock
      : story?.privacyLevel === 'friends_only'
        ? Users
        : Globe;

  return (
    <div className="flex items-center justify-between px-5 py-3 border-b border-[#FFB8C0]/10 dark:border-[#E63946]/10 bg-white/80 dark:bg-[#1a1625]/80 backdrop-blur-xl z-10">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          aria-label="Kembali ke daftar story"
          className="p-2 rounded-lg hover:bg-[#FFB8C0]/10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#5A3E4C]/60 dark:text-[#e2d9f3]/60" />
        </button>
        <div>
          <h1 className={`text-sm font-bold text-[#4A2F3C] dark:text-[#e2d9f3] ${scrapbookFontClass}`}>
            {story?.title || 'Loading...'}
          </h1>
          {story?.subtitle && (
            <p className="text-[10px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30">{story.subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-1.5 ml-3">
          <PrivIcon className="w-3 h-3 text-[#5A3E4C]/30" />
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              story?.status?.toLowerCase() === 'draft'
                ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
            }`}
          >
            {story?.status}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center relative">
          <Search className="w-3.5 h-3.5 text-[#5A3E4C]/30 absolute left-2.5 z-10" />
          <input
            type="text"
            placeholder="Cari scene..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            aria-label="Cari scene"
            className="w-44 bg-white/60 dark:bg-[#1a1625]/60 border border-[#FFB8C0]/15 rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#4A2F3C] dark:text-[#e2d9f3] placeholder-[#5A3E4C]/30 focus:outline-none focus:ring-1 focus:ring-[#E63946]/40 focus:border-[#E63946]/40 transition-all"
          />
        </div>

        <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-[#FFB8C0]/10 dark:bg-[#E63946]/10">
          {VIEW_MODES.map(({ mode, icon: ModeIcon, label }) => (
            <button
              key={mode}
              onClick={() => onViewModeChange(mode)}
              title={label}
              aria-label={`Tampilan ${label}`}
              aria-pressed={viewMode === mode}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === mode
                  ? 'bg-white dark:bg-[#2a2438] shadow-sm text-[#E63946]'
                  : 'text-[#5A3E4C]/40 dark:text-[#e2d9f3]/40 hover:text-[#5A3E4C]/70'
              }`}
            >
              <ModeIcon className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>

        <button
          onClick={onAddScene}
          className="px-3 py-1.5 rounded-xl bg-[#E63946]/10 hover:bg-[#E63946]/20 text-[#E63946] text-xs font-medium transition-all"
        >
          + Add Scene
        </button>

        <div
          className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/60 dark:bg-[#1a1625]/60 border border-[#FFB8C0]/15 text-[10px] font-medium text-[#5A3E4C]/50 dark:text-[#e2d9f3]/40"
          role="status"
          aria-live="polite"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#E63946] shadow-[0_0_8px_rgba(230,57,70,0.6)] animate-pulse" />
          Auto-saving
        </div>

        <button
          onClick={onToggleSettings}
          aria-label="Buka setelan story"
          aria-pressed={showSettings}
          className={`p-2 rounded-lg transition-all ${
            showSettings
              ? 'bg-[#E63946]/10 text-[#E63946]'
              : 'hover:bg-[#FFB8C0]/10 text-[#5A3E4C]/60 dark:text-[#e2d9f3]/60'
          }`}
        >
          <Settings className="w-4 h-4" />
        </button>

        <button
          onClick={onToggleInsights}
          aria-label="Buka panel insights"
          aria-pressed={showInsightsMenu}
          className={`p-2 rounded-lg transition-all relative ${
            activeInsight
              ? 'bg-[#7C83FD]/10 text-[#7C83FD]'
              : 'hover:bg-[#FFB8C0]/10 text-[#5A3E4C]/60 dark:text-[#e2d9f3]/60'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          {activeInsight && (
            <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#7C83FD]" />
          )}
        </button>

        <button
          onClick={onToggleExport}
          aria-label="Buka panel export"
          aria-pressed={showExport}
          className={`p-2 rounded-lg transition-all ${
            showExport
              ? 'bg-[#E63946]/10 text-[#E63946]'
              : 'hover:bg-[#FFB8C0]/10 text-[#5A3E4C]/60 dark:text-[#e2d9f3]/60'
          }`}
        >
          <Download className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
