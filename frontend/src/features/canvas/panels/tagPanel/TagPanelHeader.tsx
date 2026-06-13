"use client";

import { Tag as TagIcon, X } from "lucide-react";

interface TagPanelHeaderProps {
  onClose: () => void;
}

/**
 * TagPanelHeader - Top bar with title and close.
 */
export function TagPanelHeader({ onClose }: TagPanelHeaderProps) {
  return (
    <div className="flex items-center justify-between p-5 border-b border-[#FFB4A2]/15">
      <div className="flex items-center gap-2">
        <TagIcon className="w-4 h-4 text-[#FF8FA3]" />
        <h2 className="text-lg font-bold text-[#4A2F3C]">Tags</h2>
      </div>
      <button
        onClick={onClose}
        className="p-2 text-[#5A3E4C]/30 hover:text-[#5A3E4C]/60 hover:bg-[#FFB4A2]/10 rounded-lg transition-all"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
