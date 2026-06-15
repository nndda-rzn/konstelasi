"use client";

import { SidebarHeader } from "../sidebar/SidebarHeader";

interface EditorHeaderProps {
  showVersions: boolean;
  onToggleVersions: () => void;
  onOpenDrawing: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onClose: () => void;
}

/**
 * EditorHeader - Sticky top bar of the note editor sidebar.
 */
export function EditorHeader({
  showVersions,
  onToggleVersions,
  onOpenDrawing,
  onArchive,
  onDelete,
  onClose,
}: EditorHeaderProps) {
  return (
    <div className="sticky top-0 z-10 flex h-[64px] flex-shrink-0 items-center justify-between border-b border-[rgba(47,39,48,0.07)] bg-[#FFFCF8]/95 px-6 backdrop-blur">
      <SidebarHeader
        showVersions={showVersions}
        onToggleVersions={onToggleVersions}
        onOpenDrawing={onOpenDrawing}
        onArchive={onArchive}
        onDelete={onDelete}
        onClose={onClose}
      />
    </div>
  );
}
