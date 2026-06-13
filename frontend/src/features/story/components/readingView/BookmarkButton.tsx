"use client";

import { Bookmark } from "lucide-react";

interface BookmarkButtonProps {
  isBookmarked: boolean;
  onToggle: () => void;
  disabled: boolean;
}

/**
 * BookmarkButton - Toggle bookmark for a reading node.
 */
export function BookmarkButton({
  isBookmarked,
  onToggle,
  disabled,
}: BookmarkButtonProps) {
  if (disabled) return null;

  return (
    <button
      onClick={onToggle}
      title={isBookmarked ? "Hapus bookmark" : "Tambah bookmark"}
      aria-label="Toggle bookmark"
      className={`shrink-0 p-2 rounded-lg transition-all hover:scale-110 ${
        isBookmarked
          ? "bg-[#FFB8C0]/20 text-[#E63946]"
          : "hover:bg-[#FFB8C0]/10 text-[#5A3E4C]/40 dark:text-[#e2d9f3]/40"
      }`}
    >
      <Bookmark
        className="w-5 h-5"
        fill={isBookmarked ? "currentColor" : "none"}
      />
    </button>
  );
}
