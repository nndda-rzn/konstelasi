"use client";

import { Archive, History, Pencil, Trash2, X } from "lucide-react";

interface SidebarHeaderProps {
  showVersions: boolean;
  onToggleVersions: () => void;
  onOpenDrawing: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onClose: () => void;
}

/**
 * SidebarHeader - Top bar of the note editor with action buttons.
 */
export function SidebarHeader({
  showVersions,
  onToggleVersions,
  onOpenDrawing,
  onArchive,
  onDelete,
  onClose,
}: SidebarHeaderProps) {
  return (
    <div className="flex items-center justify-between p-5 border-b border-[#FFB4A2]/15">
      <h2 className="text-lg font-bold bg-gradient-to-r from-[#FF8FA3] to-[#FFB4A2] bg-clip-text text-transparent">
        Edit Note
      </h2>
      <div className="flex gap-1.5">
        <button
          onClick={onToggleVersions}
          className={`p-2 rounded-lg transition-all ${
            showVersions
              ? "text-[#FF8FA3] bg-[#FF8FA3]/10"
              : "text-[#5A3E4C]/30 hover:text-[#5A3E4C]/60 hover:bg-[#FFB4A2]/10"
          }`}
          title="Riwayat Versi"
        >
          <History className="w-4 h-4" />
        </button>
        <button
          onClick={onOpenDrawing}
          className="p-2 text-[#5A3E4C]/30 hover:text-[#5A3E4C]/60 hover:bg-[#FFB4A2]/10 rounded-lg transition-all"
          title="Drawing Canvas"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={onArchive}
          className="p-2 text-[#5A3E4C]/30 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-all"
          title="Arsipkan"
        >
          <Archive className="w-4 h-4" />
        </button>
        <button
          onClick={onDelete}
          className="p-2 text-[#5A3E4C]/30 hover:text-[#FF6B9D] hover:bg-[#FF6B9D]/10 rounded-lg transition-all"
          title="Delete note"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        <button
          onClick={onClose}
          className="p-2 text-[#5A3E4C]/30 hover:text-[#5A3E4C]/60 hover:bg-[#FFB4A2]/10 rounded-lg transition-all"
          title="Close editor"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
