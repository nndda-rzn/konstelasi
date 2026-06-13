"use client";

import { BookOpen } from "lucide-react";

interface ReadingHeaderProps {
  storyTitle: string;
  currentIndex: number;
  total: number;
}

/**
 * ReadingHeader - Top bar with story title and progress counter.
 */
export function ReadingHeader({
  storyTitle,
  currentIndex,
  total,
}: ReadingHeaderProps) {
  return (
    <div className="flex items-center justify-between px-8 py-4 border-b border-[#FFB8C0]/10 dark:border-[#E63946]/10">
      <div className="flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-[#E63946]" />
        <span className="text-xs font-medium text-[#5A3E4C]/60 dark:text-[#e2d9f3]/50">
          {storyTitle}
        </span>
      </div>
      <span className="text-[10px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30">
        {currentIndex + 1} / {total}
      </span>
    </div>
  );
}
