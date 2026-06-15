"use client";

import { Download, X } from "lucide-react";

interface ExportHeaderProps {
  onClose: () => void;
}

/**
 * ExportHeader - The header bar of the export panel with title
 * and close button.
 */
export function ExportHeader({ onClose }: ExportHeaderProps) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-[#FFB8C0]/10 dark:border-[#E63946]/10">
      <div className="flex items-center gap-2">
        <Download className="w-4 h-4 text-[#E63946]" />
        <h3 className="text-sm font-semibold text-[#4A2F3C] dark:text-[#e2d9f3]">
          Export Story
        </h3>
      </div>
      <button
        onClick={onClose}
        className="p-1.5 rounded-lg hover:bg-[#FFB8C0]/10 transition-colors"
      >
        <X className="w-4 h-4 text-[#5A3E4C]/60 dark:text-[#e2d9f3]/60" />
      </button>
    </div>
  );
}
