"use client";

import { useEffect } from "react";
import TiptapEditor from "@/features/canvas/components/TiptapEditor";
import SaveIndicator from "@/features/canvas/components/SaveIndicator";
import ContentStats from "@/features/canvas/components/ContentStats";
import NoteTimestamps from "@/features/canvas/components/NoteTimestamps";
import TitleFontPicker from "@/features/canvas/components/TitleFontPicker";
import VersionPanel from "@/features/canvas/panels/VersionPanel";
import DrawingCanvas from "./DrawingCanvas";
import BacklinksPanel from "@/features/notes/components/BacklinksPanel";
import { toast } from "@/lib/toast";
import { notify } from "@/lib/toast";
import { useNoteEditor } from "./sidebar/useNoteEditor";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { NoteMetadataSection } from "./sidebar/NoteMetadataSection";
import { AttachmentsSection } from "./sidebar/AttachmentsSection";

interface NoteEditorSidebarProps {
  note: any;
  allNotes?: any[];
  onClose: () => void;
  onDeleteSuccess: (nodeId: string) => void;
  onUpdateCache: (
    nodeId: string,
    title?: string,
    content?: string,
    newImages?: any[],
    color?: string,
    mood?: string
  ) => void;
  onNavigate?: (nodeId: string) => void;
}

/**
 * NoteEditorSidebar - Inspector panel for editing a single note.
 * Rendered as a flex child in DiaryCanvas layout (not absolute).
 * Sticky header, scrollable content, warm editorial palette.
 */
export default function NoteEditorSidebar({
  note,
  allNotes = [],
  onClose,
  onDeleteSuccess,
  onUpdateCache,
  onNavigate,
}: NoteEditorSidebarProps) {
  const editor = useNoteEditor({ note, onUpdateCache, onDeleteSuccess });

  // Esc closes the sidebar (unless user is in nested modal/drawing)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (editor.showVersions || editor.showDrawing) return;
      onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, editor.showVersions, editor.showDrawing]);

  if (!note) return null;

  const handleDeleteWithConfirm = () => {
    toast("Delete this note and all its connections?", {
      action: {
        label: "Delete",
        onClick: editor.handleDeleteNode,
      },
    });
  };

  const handleArchiveWithToast = async () => {
    await editor.handleArchiveNode();
    notify.success("Note archived");
  };

  const handleRemoveImage = (imageId: string) => {
    toast("Remove this image?", {
      action: {
        label: "Remove",
        onClick: () => editor.deleteImage(imageId),
      },
    });
  };

  return (
    <>
      <aside className="w-[420px] flex-shrink-0 border-l border-[rgba(47,39,48,0.08)] bg-[#FFFCF8] h-full flex flex-col z-50 min-h-0">
        {/* Sticky header */}
        <div className="sticky top-0 z-10 flex h-[64px] flex-shrink-0 items-center justify-between border-b border-[rgba(47,39,48,0.07)] bg-[#FFFCF8]/95 px-6 backdrop-blur">
          <SidebarHeader
            showVersions={editor.showVersions}
            onToggleVersions={() => editor.setShowVersions(!editor.showVersions)}
            onOpenDrawing={() => editor.setShowDrawing(true)}
            onArchive={handleArchiveWithToast}
            onDelete={handleDeleteWithConfirm}
            onClose={onClose}
          />
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Title */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[11px] font-medium uppercase tracking-[0.14em] text-[#9A8F95]">
                Title
              </label>
              <TitleFontPicker
                value={editor.titleFont}
                onChange={editor.setTitleFont}
              />
            </div>
            <input
              ref={editor.titleRef}
              type="text"
              className="w-full bg-[#FAF7F2] border border-[rgba(47,39,48,0.08)] rounded-[14px] text-[#2F2730] text-lg font-semibold px-4 py-3 placeholder-[#9A8F95] focus:outline-none focus:ring-1 focus:ring-[#C99A45]/40 focus:border-[#C99A45]/50 transition-colors"
              style={editor.titleFont ? { fontFamily: editor.titleFont } : undefined}
              value={editor.title}
              onChange={(e) => editor.setTitle(e.target.value)}
              placeholder="Untitled note"
            />
            <NoteTimestamps
              createdAt={note?.createdAt}
              updatedAt={note?.updatedAt}
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-[0.14em] text-[#9A8F95] mb-2">
              Content
            </label>
            <TiptapEditor content={editor.content} onChange={editor.setContent} />
            <div className="flex items-center justify-between mt-2 gap-2">
              <SaveIndicator
                status={editor.saveStatus}
                lastSavedAt={editor.lastSavedAt}
              />
              <ContentStats content={editor.content} />
            </div>
            {editor.showVersions && (
              <VersionPanel
                noteId={note.id}
                isOpen={editor.showVersions}
                onClose={() => editor.setShowVersions(false)}
                onRestore={() => {
                  editor.setShowVersions(false);
                  onClose();
                }}
              />
            )}
          </div>

          <NoteMetadataSection
            mood={editor.mood}
            setMood={editor.setMood}
            color={editor.color}
            setColor={editor.setColor}
            noteType={editor.noteType}
            setNoteType={editor.setNoteType}
            noteTags={editor.noteTags}
            availableTags={editor.availableTags}
            onAddTag={editor.handleAddTag}
            onRemoveTag={editor.handleRemoveTag}
          />

          <AttachmentsSection
            images={editor.images}
            uploading={editor.uploading}
            onUpload={editor.uploadFromInputEvent}
            onRemove={handleRemoveImage}
          />

          {/* Backlinks */}
          <div className="border-t border-[rgba(47,39,48,0.08)] pt-6 pb-4">
            <BacklinksPanel
              note={note}
              allNotes={allNotes}
              onNavigate={(id) => onNavigate?.(id)}
            />
          </div>
        </div>
      </aside>

      <DrawingCanvas
        isOpen={editor.showDrawing}
        onClose={() => editor.setShowDrawing(false)}
      />
    </>
  );
}
