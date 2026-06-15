"use client";

import { useNoteImageUpload } from "@/features/canvas/hooks/useNoteImageUpload";
import { useStoryNodeForm } from "./use-story-node-form";
import { useStoryNodeAutoSave } from "./use-story-node-autosave";
import { useStoryNodeActions } from "./use-story-node-actions";

interface UseStoryNodeEditorParams {
  note: any;
  onUpdateCache: (
    nodeId: string,
    title?: string,
    content?: string,
    newImages?: any[],
    color?: string,
    mood?: string,
    extra?: any
  ) => void;
  onDeleteSuccess: () => void;
}

export const useStoryNodeEditor = ({
  note,
  onUpdateCache,
  onDeleteSuccess,
}: UseStoryNodeEditorParams) => {
  const form = useStoryNodeForm(note);
  const { images, uploading, uploadFromInputEvent, deleteImage } =
    useNoteImageUpload({
      noteId: note?.id,
      initialImages: note?.images || [],
      onImagesChange: (newImages) =>
        onUpdateCache(note.id, form.title, form.content, newImages),
    });

  useStoryNodeAutoSave({
    note,
    title: form.title,
    content: form.content,
    contentMasked: form.contentMasked,
    mood: form.mood,
    eventDate: form.eventDate,
    eventLocation: form.eventLocation,
    unlockDate: form.unlockDate,
    onSaved: (id, t, c, mood, extra) =>
      onUpdateCache(id, t, c, undefined, undefined, mood, extra),
    onNotFound: onDeleteSuccess,
  });

  const { handleToggleLock, handleDelete } = useStoryNodeActions(
    note?.id ?? "",
    form.isLocked,
    onDeleteSuccess
  );

  return {
    title: form.title,
    setTitle: form.setTitle,
    content: form.content,
    setContent: form.setContent,
    contentMasked: form.contentMasked,
    mood: form.mood,
    setMood: form.setMood,
    isLocked: form.isLocked,
    eventDate: form.eventDate,
    setEventDate: form.setEventDate,
    eventLocation: form.eventLocation,
    setEventLocation: form.setEventLocation,
    unlockDate: form.unlockDate,
    setUnlockDate: form.setUnlockDate,
    focusMode: form.focusMode,
    setFocusMode: form.setFocusMode,
    metadata: form.metadata,
    images,
    uploading,
    handleToggleLock,
    handleDelete,
    handleMetadataChange: form.handleMetadataChange,
    uploadFromInputEvent,
    deleteImage,
  };
};
