"use client";

import { useEffect } from "react";
import { toast, notify } from "@/lib/toast";
import BacklinksPanel from "@/features/notes/components/BacklinksPanel";
import DrawingCanvas from "./DrawingCanvas";
import { useNoteEditor } from "./sidebar/useNoteEditor";
import { useEditorShortcuts } from "./editorSections/useEditorShortcuts";
import { EditorHeader } from "./editorSections/EditorHeader";
import { EditorTitleSection } from "./editorSections/EditorTitleSection";
import { EditorContentSection } from "./editorSections/EditorContentSection";
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

  useEditorShortcuts({
    onClose,
    isBlocked: editor.showVersions || editor.showDrawing,
  });

  if (!note) return null;

  const handleDeleteWithConfirm = () => {
    toast("Delete this note and all its connections?", {
      action: { label: "Delete", onClick: editor.handleDeleteNode },
    });
  };

  const handleArchiveWithToast = async () => {
    await editor.handleArchiveNode();
    notify.success("Note archived");
  };

  const handleRemoveImage = (imageId: string) => {
    toast("Remove this image?", {
      action: { label: "Remove", onClick: () => editor.deleteImage(imageId) },
    });
  };

  return (
    <>
      <aside className="w-[420px] flex-shrink-0 border-l border-[rgba(47,39,48,0.08)] bg-[#FFFCF8] h-full flex flex-col z-50 min-h-0">
        <EditorHeader
          showVersions={editor.showVersions}
          onToggleVersions={() => editor.setShowVersions(!editor.showVersions)}
          onOpenDrawing={() => editor.setShowDrawing(true)}
          onArchive={handleArchiveWithToast}
          onDelete={handleDeleteWithConfirm}
          onClose={onClose}
        />

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          <EditorTitleSection
            title={editor.title}
            setTitle={editor.setTitle}
            titleFont={editor.titleFont}
            setTitleFont={editor.setTitleFont}
            titleRef={editor.titleRef}
            createdAt={note?.createdAt}
            updatedAt={note?.updatedAt}
          />

          <EditorContentSection
            content={editor.content}
            setContent={editor.setContent}
            saveStatus={editor.saveStatus}
            lastSavedAt={editor.lastSavedAt}
            noteId={note.id}
            showVersions={editor.showVersions}
            onCloseVersions={() => editor.setShowVersions(false)}
            onRestoreVersion={() => {
              editor.setShowVersions(false);
              onClose();
            }}
          />

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
