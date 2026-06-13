"use client";

import { Lock, Globe, Users, Sparkles } from "lucide-react";

interface StoryTitleSectionProps {
  story: {
    title?: string;
    subtitle?: string | null;
    status?: string;
    privacyLevel?: string;
  } | null;
  scrapbookFontClass: string;
}

const PRIVACY_ICON: Record<string, any> = {
  private: Lock,
  friends_only: Users,
  public: Globe,
};

/**
 * StoryTitleSection - Story title + subtitle + privacy/status indicators.
 */
export function StoryTitleSection({
  story,
  scrapbookFontClass,
}: StoryTitleSectionProps) {
  const PrivacyIcon = story?.privacyLevel
    ? PRIVACY_ICON[story.privacyLevel] || Lock
    : Lock;
  const isPublished = story?.status?.toLowerCase() === "published";

  return (
    <div className="flex items-center gap-3 min-w-0">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FFB4A2] to-[#FF8FA3] flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="min-w-0">
          <h1
            className={`text-sm font-bold text-[#4A2F3C] dark:text-[#e2d9f3] truncate max-w-[200px] ${scrapbookFontClass}`}
          >
            {story?.title || "Untitled Story"}
          </h1>
          {story?.subtitle && (
            <p className="text-[10px] text-[#5A3E4C]/50 dark:text-[#e2d9f3]/40 truncate max-w-[200px]">
              {story.subtitle}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFB4A2]/10 text-[10px] font-medium text-[#FF8FA3]">
          <PrivacyIcon className="w-2.5 h-2.5" />
          {story?.privacyLevel?.toLowerCase().replace("_", " ")}
        </span>
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
            isPublished
              ? "bg-emerald-50 text-emerald-600"
              : "bg-amber-50 text-amber-600"
          }`}
        >
          {story?.status?.toLowerCase()}
        </span>
      </div>
    </div>
  );
}
