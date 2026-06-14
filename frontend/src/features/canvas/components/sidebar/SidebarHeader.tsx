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

export function SidebarHeader({
  showVersions,
  onToggleVersions,
  onOpenDrawing,
  onArchive,
  onDelete,
  onClose,
}: SidebarHeaderProps) {
  return (
    <div className="flex items-center justify-between px-0">
      <h2 className="text-[15px] font-semibold tracking-tight text-[#2F2730]">
        Edit note
      </h2>
      <div className="flex gap-1">
        <button
          onClick={onToggleVersions}
          className={`p-2 rounded-[10px] transition-colors ${
            showVersions
              ? "text-[#B84A5A] bg-[#B84A5A]/8"
              : "text-[#9A8F95] hover:text-[#2F2730] hover:bg-[#F3ECE4]"
          }`}
          title="Version history"
        >
          <History className="w-4 h-4" />
        </button>
        <button
          onClick={onOpenDrawing}
          className="p-2 rounded-[10px] text-[#9A8F95] hover:text-[#2F2730] hover:bg-[#F3ECE4] transition-colors"
          title="Drawing canvas"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={onArchive}
          className="p-2 rounded-[10px] text-[#9A8F95] hover:text-[#C99A45] hover:bg-[#FAF3E0] transition-colors"
          title="Archive"
        >
          <Archive className="w-4 h-4" />
        </button>
        <button
          onClick={onDelete}
          className="p-2 rounded-[10px] text-[#9A8F95] hover:text-[#B84A5A] hover:bg-[#FBEFEC] transition-colors"
          title="Delete note"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        <button
          onClick={onClose}
          className="p-2 rounded-[10px] text-[#9A8F95] hover:text-[#2F2730] hover:bg-[#F3ECE4] transition-colors"
          title="Close editor"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
