"use client";

import TiptapEditor from "../TiptapEditor";
import SaveIndicator from "../SaveIndicator";
import ContentStats from "../ContentStats";
import VersionPanel from "@/features/canvas/panels/VersionPanel";

interface EditorContentSectionProps {
  content: string;
  setContent: (v: string) => void;
  saveStatus: "idle" | "saving" | "saved" | "error";
  lastSavedAt: number | null;
  noteId: string;
  showVersions: boolean;
  onCloseVersions: () => void;
  onRestoreVersion: () => void;
}

/**
 * EditorContentSection - Tiptap editor with save indicator,
 * content stats, and optional version history panel.
 */
export function EditorContentSection({
  content,
  setContent,
  saveStatus,
  lastSavedAt,
  noteId,
  showVersions,
  onCloseVersions,
  onRestoreVersion,
}: EditorContentSectionProps) {
  return (
    <div>
      <label className="block text-[11px] font-medium uppercase tracking-[0.14em] text-[#9A8F95] mb-2">
        Content
      </label>
      <TiptapEditor content={content} onChange={setContent} />
      <div className="flex items-center justify-between mt-2 gap-2">
        <SaveIndicator status={saveStatus} lastSavedAt={lastSavedAt} />
        <ContentStats content={content} />
      </div>
      {showVersions && (
        <VersionPanel
          noteId={noteId}
          isOpen={showVersions}
          onClose={onCloseVersions}
          onRestore={onRestoreVersion}
        />
      )}
    </div>
  );
}
