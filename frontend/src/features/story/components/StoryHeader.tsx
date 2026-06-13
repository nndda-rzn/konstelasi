"use client";

import {
  ArrowLeft,
  BookOpen,
  Clock,
  Download,
  Film,
  Image as ImageIcon,
  LayoutGrid,
  List,
  Lock,
  Settings,
  Share2,
  Sparkles,
  Users,
} from "lucide-react";
import ScrapbookThemePicker from "@/features/story/components/ScrapbookThemePicker";
import { ViewModeTabs, type StoryViewMode } from "./storyHeader/ViewModeTabs";
import { StoryTitleSection } from "./storyHeader/StoryTitleSection";
import { StorySearchBar } from "./storyHeader/StorySearchBar";
import { StoryHeaderActions } from "./storyHeader/StoryHeaderActions";

export type { StoryViewMode } from "./storyHeader/ViewModeTabs";

const VIEW_MODES: Array<{ mode: StoryViewMode; icon: any; label: string }> = [
  { mode: "canvas", icon: LayoutGrid, label: "Canvas" },
  { mode: "timeline", icon: Clock, label: "Timeline" },
  { mode: "reading", icon: BookOpen, label: "Reading" },
  { mode: "gallery", icon: ImageIcon, label: "Gallery" },
  { mode: "outline", icon: List, label: "Outline" },
  { mode: "cinematic", icon: Film, label: "Cinematic" },
];

interface Props {
  story: {
    id?: string;
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
  onToggleStatus?: (nextStatus: "DRAFT" | "PUBLISHED") => void;
  scrapbookTheme?: string | null;
  onScrapbookThemeChange?: (nextJson: string) => void;
  showInsightsMenu: boolean;
  onToggleInsights: () => void;
  activeInsight: string | null;
  showExport: boolean;
  onToggleExport: () => void;
  onAddScene: () => void;
  onBack: () => void;
}

export default function StoryHeader(props: Props) {
  const {
    story,
    scrapbookFontClass,
    searchQuery,
    onSearchQueryChange,
    viewMode,
    onViewModeChange,
    showSettings,
    onToggleSettings,
    onToggleStatus,
    scrapbookTheme,
    onScrapbookThemeChange,
    showInsightsMenu,
    onToggleInsights,
    activeInsight,
    showExport,
    onToggleExport,
    onAddScene,
    onBack,
  } = props;

  return (
    <div className="border-b border-[#E6B8A2]/15 dark:border-[#E63946]/10 bg-white/72 dark:bg-[#1a1625]/72 backdrop-blur-2xl shadow-sm">
      <div className="px-6 py-3 flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 text-[#5A3E4C]/30 dark:text-[#e2d9f3]/30 hover:text-[#5A3E4C]/60 dark:hover:text-[#e2d9f3]/60 hover:bg-[#FFB4A2]/10 dark:hover:bg-[#E63946]/10 rounded-lg transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <StoryTitleSection
          story={story}
          scrapbookFontClass={scrapbookFontClass}
        />

        <ViewModeTabs
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
          modes={VIEW_MODES}
        />

        <div className="flex-1" />

        <StorySearchBar
          query={searchQuery}
          onChange={onSearchQueryChange}
        />

        <StoryHeaderActions
          scrapbookTheme={scrapbookTheme}
          onScrapbookThemeChange={onScrapbookThemeChange}
          onToggleInsights={onToggleInsights}
          showInsightsMenu={showInsightsMenu}
          activeInsight={activeInsight}
          onToggleExport={onToggleExport}
          showExport={showExport}
          onAddScene={onAddScene}
          showSettings={showSettings}
          onToggleSettings={onToggleSettings}
          storyStatus={story?.status}
          onToggleStatus={onToggleStatus}
        />
      </div>
    </div>
  );
}
