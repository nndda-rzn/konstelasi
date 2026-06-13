"use client";

export type StoryViewMode =
  | "canvas"
  | "timeline"
  | "reading"
  | "gallery"
  | "outline"
  | "cinematic";

interface ViewModeTabsProps {
  viewMode: StoryViewMode;
  onViewModeChange: (mode: StoryViewMode) => void;
  modes: Array<{ mode: StoryViewMode; icon: any; label: string }>;
}

/**
 * ViewModeTabs - Tabbed navigation for canvas/timeline/reading/etc.
 */
export function ViewModeTabs({
  viewMode,
  onViewModeChange,
  modes,
}: ViewModeTabsProps) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-[#FFB4A2]/8 dark:bg-[#E63946]/8 border border-[#FFB4A2]/15 dark:border-[#E63946]/10">
      {modes.map(({ mode, icon: Icon, label }) => (
        <button
          key={mode}
          onClick={() => onViewModeChange(mode)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            viewMode === mode
              ? "bg-white dark:bg-[#2a2438] text-[#FF8FA3] shadow-sm"
              : "text-[#5A3E4C]/50 dark:text-[#e2d9f3]/40 hover:text-[#5A3E4C]/80 dark:hover:text-[#e2d9f3]/70"
          }`}
          title={label}
        >
          <Icon className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
