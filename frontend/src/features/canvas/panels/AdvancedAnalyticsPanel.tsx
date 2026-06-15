"use client";

import { X, BarChart3 } from "lucide-react";
import { useAnalytics } from "./analytics/useAnalytics";
import { OverviewStats } from "./analytics/OverviewStats";
import { Last30DaysChart } from "./analytics/Last30DaysChart";
import { DayOfWeekChart } from "./analytics/DayOfWeekChart";
import { MoodDistribution } from "./analytics/MoodDistribution";
import { TopTags } from "./analytics/TopTags";
import { MostConnected } from "./analytics/MostConnected";

interface AnalyticsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notes: any[];
}

export default function AdvancedAnalyticsPanel({ isOpen, onClose, notes }: AnalyticsPanelProps) {
  const analytics = useAnalytics(notes);
  if (!isOpen || !analytics) return null;

  return (
    <div className="absolute top-4 right-4 w-[400px] max-h-[85vh] bg-white/95 dark:bg-[#2a2438]/95 backdrop-blur-xl rounded-2xl border border-[#FFB4A2]/20 dark:border-[#FF8FA3]/10 shadow-[0_20px_60px_rgba(0,0,0,0.1)] z-50 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#FFB4A2]/10 dark:border-[#FF8FA3]/10">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[#FF8FA3]" />
          <h3 className="text-sm font-semibold text-[#4A2F3C] dark:text-[#e2d9f3]">Analytics</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-[#FFB4A2]/10 transition-colors"
        >
          <X className="w-4 h-4 text-[#5A3E4C]/60 dark:text-[#e2d9f3]/60" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
        <OverviewStats analytics={analytics} />
        <Last30DaysChart analytics={analytics} />
        <DayOfWeekChart analytics={analytics} />
        <MoodDistribution analytics={analytics} totalNotes={analytics.totalNotes} />
        <TopTags analytics={analytics} />
        <MostConnected analytics={analytics} />
      </div>
    </div>
  );
}
