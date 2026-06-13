"use client";

import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client/react";
import { UPDATE_NOTE_CONTENT, DELETE_NOTE } from "@/graphql/mutations";
import { TOGGLE_NODE_LOCK } from "@/graphql/story";
import { notify } from "@/lib/toast";
import { useNoteImageUpload } from "@/features/canvas/hooks/useNoteImageUpload";
import { toDateTimeInputValue } from "./dateHelpers";

const AUTO_SAVE_DELAY = 800;

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

/**
 * useStoryNodeEditor - Manages all state + mutations + auto-save for the editor.
 */
export const useStoryNodeEditor = ({
  note,
  onUpdateCache,
  onDeleteSuccess,
}: UseStoryNodeEditorParams) => {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [contentMasked, setContentMasked] = useState(
    Boolean(
      note?.isTimeLocked &&
        (note?.content === null || note?.content === undefined)
    )
  );
  const [mood, setMood] = useState(note?.mood || "");
  const [isLocked, setIsLocked] = useState(note?.isLocked || false);
  const [eventDate, setEventDate] = useState(
    note?.eventDate ? note.eventDate.split("T")[0] : ""
  );
  const [eventLocation, setEventLocation] = useState(
    note?.eventLocation || ""
  );
  const [unlockDate, setUnlockDate] = useState(
    toDateTimeInputValue(note?.unlockDate)
  );
  const [focusMode, setFocusMode] = useState(false);

  // Parse metadata
  let initialMetadata: any = {};
  try {
    if (note?.storyMetadata) initialMetadata = JSON.parse(note.storyMetadata);
  } catch {}
  const [metadata, setMetadata] = useState(initialMetadata);

  // Mutations
  const [updateContent] = useMutation(UPDATE_NOTE_CONTENT);
  const [deleteNoteMut] = useMutation(DELETE_NOTE);
  const [toggleLock] = useMutation(TOGGLE_NODE_LOCK);

  // Image upload
  const { images, setImages, uploading, uploadFromInputEvent, deleteImage } =
    useNoteImageUpload({
      noteId: note?.id,
      initialImages: note?.images || [],
      onImagesChange: (newImages) =>
        onUpdateCache(note.id, title, content, newImages),
    });

  // Reset on note change
  useEffect(() => {
    if (note) {
      setTitle(note.title || "");
      setContent(note.content || "");
      setContentMasked(
        Boolean(
          note.isTimeLocked &&
            (note.content === null || note.content === undefined)
        )
      );
      setMood(note.mood || "");
      setIsLocked(note.isLocked || false);
      setEventDate(note.eventDate ? note.eventDate.split("T")[0] : "");
      setEventLocation(note.eventLocation || "");
      setUnlockDate(toDateTimeInputValue(note.unlockDate));
      setImages(note.images || []);
      try {
        setMetadata(note.storyMetadata ? JSON.parse(note.storyMetadata) : {});
      } catch {
        setMetadata({});
      }
    }
  }, [note?.id]);

  // Auto-save debounce
  useEffect(() => {
    if (!note) return;
    const handler = setTimeout(async () => {
      const nextUnlockDate = unlockDate
        ? new Date(unlockDate).toISOString()
        : null;
      const nextIsTimeLocked = Boolean(
        nextUnlockDate && new Date(nextUnlockDate).getTime() > Date.now()
      );
      const input: any = {
        id: note.id,
        title,
        mood: mood || undefined,
        eventDate: eventDate || undefined,
        eventLocation: eventLocation || undefined,
        unlockDate: nextUnlockDate,
      };
      if (!contentMasked) input.content = content;
      try {
        await updateContent({ variables: { input } });
        onUpdateCache(
          note.id,
          title,
          contentMasked ? undefined : content,
          undefined,
          undefined,
          mood,
          {
            unlockDate: nextUnlockDate,
            isTimeLocked: nextIsTimeLocked,
          }
        );
      } catch (err: any) {
        if (
          err?.message?.includes("not found") ||
          err?.message?.includes("Not Found")
        ) {
          onDeleteSuccess();
          return;
        }
        console.error("Auto-save failed:", err);
      }
    }, AUTO_SAVE_DELAY);
    return () => clearTimeout(handler);
  }, [title, content, contentMasked, mood, eventDate, eventLocation, unlockDate]);

  // Handlers
  const handleToggleLock = async () => {
    try {
      await toggleLock({ variables: { noteId: note.id } });
      setIsLocked(!isLocked);
      notify.success(isLocked ? "Node dibuka" : "Node dikunci");
    } catch {
      notify.error("Gagal mengubah lock");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteNoteMut({ variables: { id: note.id } });
      notify.success("Node dihapus");
      onDeleteSuccess();
    } catch {
      notify.error("Gagal menghapus node");
    }
  };

  const handleMetadataChange = (key: string, value: string) => {
    setMetadata((prev: any) => ({ ...prev, [key]: value }));
  };

  return {
    // State
    title,
    setTitle,
    content,
    setContent,
    contentMasked,
    mood,
    setMood,
    isLocked,
    eventDate,
    setEventDate,
    eventLocation,
    setEventLocation,
    unlockDate,
    setUnlockDate,
    focusMode,
    setFocusMode,
    metadata,
    images,
    uploading,
    // Handlers
    handleToggleLock,
    handleDelete,
    handleMetadataChange,
    uploadFromInputEvent,
    deleteImage,
  };
};
