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
    toast("Hapus catatan ini beserta semua linknya?", {
      action: {
        label: "Hapus",
        onClick: editor.handleDeleteNode,
      },
    });
  };

  const handleArchiveWithToast = async () => {
    await editor.handleArchiveNode();
    notify.success("Catatan diarsipkan");
  };

  const handleRemoveImage = (imageId: string) => {
    toast("Hapus gambar ini?", {
      action: {
        label: "Hapus",
        onClick: () => editor.deleteImage(imageId),
      },
    });
  };

  return (
    <>
      <div className="absolute top-0 right-0 h-full w-[400px] bg-white/95 backdrop-blur-2xl shadow-2xl shadow-pink-200/30 border-l border-[#FFB4A2]/15 z-50 flex flex-col pt-16 animate-slide-in-right">
        <div className="absolute top-16 left-0 w-px h-full bg-gradient-to-b from-[#FF8FA3]/40 via-[#FFB4A2]/10 to-transparent" />

        <SidebarHeader
          showVersions={editor.showVersions}
          onToggleVersions={() => editor.setShowVersions(!editor.showVersions)}
          onOpenDrawing={() => editor.setShowDrawing(true)}
          onArchive={handleArchiveWithToast}
          onDelete={handleDeleteWithConfirm}
          onClose={onClose}
        />

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Title */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-[#5A3E4C]/40 uppercase tracking-wider">
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
              className="w-full bg-white/60 border border-[#FFB4A2]/20 rounded-xl text-[#4A2F3C] text-lg font-semibold px-4 py-3 placeholder-[#5A3E4C]/30 focus:outline-none focus:ring-2 focus:ring-[#FF8FA3]/30 focus:border-[#FF8FA3]/30 transition-all hover:bg-white/80"
              style={editor.titleFont ? { fontFamily: editor.titleFont } : undefined}
              value={editor.title}
              onChange={(e) => editor.setTitle(e.target.value)}
              placeholder="Untitled Note"
            />
            <NoteTimestamps
              createdAt={note?.createdAt}
              updatedAt={note?.updatedAt}
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-semibold text-[#5A3E4C]/40 uppercase tracking-wider mb-2">
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
          <div className="border-t border-[#FFB4A2]/15 pt-6 pb-4">
            <BacklinksPanel
              note={note}
              allNotes={allNotes}
              onNavigate={(id) => onNavigate?.(id)}
            />
          </div>
        </div>
      </div>

      <DrawingCanvas
        isOpen={editor.showDrawing}
        onClose={() => editor.setShowDrawing(false)}
      />
    </>
  );
}
