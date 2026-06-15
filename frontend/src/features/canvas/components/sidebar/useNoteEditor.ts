"use client";

import { useRef, useState, useEffect } from "react";
import { useTags } from "@/context/TagContext";
import { useNoteImageUpload } from "@/features/canvas/hooks/useNoteImageUpload";
import { useNoteForm } from "./use-note-form";
import { useAutoSave } from "./use-auto-save";
import { useNoteActions } from "./use-note-actions";

interface UseNoteEditorParams {
  note: any;
  onUpdateCache: (
    nodeId: string,
    title?: string,
    content?: string,
    newImages?: any[],
    color?: string,
    mood?: string
  ) => void;
  onDeleteSuccess: (nodeId: string) => void;
}

/**
 * useNoteEditor - Composes the note editor's state, auto-save,
 * tag management, image upload, and delete/archive actions.
 */
export const useNoteEditor = ({
  note,
  onUpdateCache,
  onDeleteSuccess,
}: UseNoteEditorParams) => {
  const form = useNoteForm(note);
  const { images, setImages, uploading, uploadFromInputEvent, deleteImage } =
    useNoteImageUpload({
      noteId: note?.id,
      initialImages: note?.images || [],
      onImagesChange: (newImages) =>
        onUpdateCache(note.id, form.title, form.content, newImages),
    });

  const { saveStatus, lastSavedAt } = useAutoSave({
    note,
    title: form.title,
    content: form.content,
    color: form.color,
    noteType: form.noteType,
    mood: form.mood,
    titleFont: form.titleFont,
    onSaved: (id, t, c, color, mood) =>
      onUpdateCache(id, t, c, undefined, color, mood),
  });

  const { tags, assignTagsToNote, removeTagFromNote } = useTags();
  const { handleDelete, handleArchive } = useNoteActions(
    note?.id ?? "",
    onDeleteSuccess
  );

  const titleRef = useRef<HTMLInputElement>(null);
  const [showVersions, setShowVersions] = useState(false);
  const [showDrawing, setShowDrawing] = useState(false);

  useEffect(() => {
    if (note?.id) {
      const timer = setTimeout(() => titleRef.current?.focus(), 120);
      return () => clearTimeout(timer);
    }
  }, [note?.id]);

  const handleAddTag = async (tag: any) => {
    await assignTagsToNote(note.id, [tag.id]);
    form.setNoteTags([...form.noteTags, tag]);
  };

  const handleRemoveTag = async (tagId: string) => {
    await removeTagFromNote(note.id, tagId);
    form.setNoteTags(form.noteTags.filter((t) => t.id !== tagId));
  };

  return {
    ...form,
    saveStatus,
    lastSavedAt,
    showVersions,
    setShowVersions,
    showDrawing,
    setShowDrawing,
    titleRef,
    availableTags: tags.filter(
      (t: any) => !form.noteTags.some((nt: any) => nt.id === t.id)
    ),
    images,
    setImages,
    uploading,
    uploadFromInputEvent,
    deleteImage,
    handleAddTag,
    handleRemoveTag,
    handleDeleteNode: handleDelete,
    handleArchiveNode: handleArchive,
  };
};
