"use client";

import { useState } from "react";
import {
  BarChart3,
  Check,
  Download,
  Plus,
  Settings,
  Share2,
} from "lucide-react";
import ScrapbookThemePicker from "@/features/story/components/ScrapbookThemePicker";

interface StoryHeaderActionsProps {
  scrapbookTheme?: string | null;
  onScrapbookThemeChange?: (nextJson: string) => void;
  onToggleInsights: () => void;
  showInsightsMenu: boolean;
  activeInsight: string | null;
  onToggleExport: () => void;
  showExport: boolean;
  onAddScene: () => void;
  showSettings: boolean;
  onToggleSettings: () => void;
  storyStatus?: string;
  onToggleStatus?: (nextStatus: "DRAFT" | "PUBLISHED") => void;
}

/**
 * StoryHeaderActions - Action buttons cluster: insights, theme, export, add, settings.
 */
export function StoryHeaderActions({
  scrapbookTheme,
  onScrapbookThemeChange,
  onToggleInsights,
  showInsightsMenu,
  activeInsight,
  onToggleExport,
  showExport,
  onAddScene,
  showSettings,
  onToggleSettings,
  storyStatus,
  onToggleStatus,
}: StoryHeaderActionsProps) {
  const [themePickerOpen, setThemePickerOpen] = useState(false);

  const handleToggleStatus = () => {
    if (!onToggleStatus) return;
    const next = storyStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    onToggleStatus(next);
  };

  return (
    <div className="flex items-center gap-1.5">
      {/* Insights toggle */}
      <button
        onClick={onToggleInsights}
        className={`p-2 rounded-lg transition-all ${
          showInsightsMenu || activeInsight
            ? "text-[#FF8FA3] bg-[#FF8FA3]/10"
            : "text-[#5A3E4C]/30 hover:text-[#5A3E4C]/60 hover:bg-[#FFB4A2]/10"
        }`}
        title="Insights"
      >
        <BarChart3 className="w-4 h-4" />
      </button>

      {/* Scrapbook theme picker */}
      {onScrapbookThemeChange && (
        <div className="relative">
          <button
            onClick={() => setThemePickerOpen(!themePickerOpen)}
            className="p-2 text-[#5A3E4C]/30 hover:text-[#5A3E4C]/60 hover:bg-[#FFB4A2]/10 rounded-lg transition-all"
            title="Tema Scrapbook"
          >
            <Share2 className="w-4 h-4" />
          </button>
          {themePickerOpen && (
            <ScrapbookThemePicker
              value={scrapbookTheme}
              onChange={(json) => {
                onScrapbookThemeChange(json);
                setThemePickerOpen(false);
              }}
            />
          )}
        </div>
      )}

      {/* Export toggle */}
      <button
        onClick={onToggleExport}
        className={`p-2 rounded-lg transition-all ${
          showExport
            ? "text-[#FF8FA3] bg-[#FF8FA3]/10"
            : "text-[#5A3E4C]/30 hover:text-[#5A3E4C]/60 hover:bg-[#FFB4A2]/10"
        }`}
        title="Export"
      >
        <Download className="w-4 h-4" />
      </button>

      {/* Add scene */}
      <button
        onClick={onAddScene}
        className="p-2 text-white bg-gradient-to-r from-[#FF8FA3] to-[#FFB4A2] rounded-lg hover:from-[#FF7A8A] hover:to-[#FF8FA3] transition-all shadow-sm"
        title="Tambah Scene"
      >
        <Plus className="w-4 h-4" />
      </button>

      {/* Status toggle (draft/published) */}
      {onToggleStatus && (
        <button
          onClick={handleToggleStatus}
          className="p-2 text-[#5A3E4C]/30 hover:text-[#5A3E4C]/60 hover:bg-[#FFB4A2]/10 rounded-lg transition-all"
          title="Toggle Status"
        >
          <Check className="w-4 h-4" />
        </button>
      )}

      {/* Settings toggle */}
      <button
        onClick={onToggleSettings}
        className={`p-2 rounded-lg transition-all ${
          showSettings
            ? "text-[#FF8FA3] bg-[#FF8FA3]/10"
            : "text-[#5A3E4C]/30 hover:text-[#5A3E4C]/60 hover:bg-[#FFB4A2]/10"
        }`}
        title="Settings"
      >
        <Settings className="w-4 h-4" />
      </button>
    </div>
  );
}
