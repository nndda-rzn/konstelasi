"use client";

import { useState, useEffect, useRef } from "react";
import { useMutation } from "@apollo/client/react";
import {
  UPDATE_NOTE_CONTENT,
  DELETE_NOTE,
  ARCHIVE_NOTE,
} from "@/graphql/mutations";
import { useTags } from "@/context/TagContext";
import { useNoteImageUpload } from "@/features/canvas/hooks/useNoteImageUpload";
import { AUTO_SAVE_DELAY } from "./sidebarConstants";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

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
 * useNoteEditor - Encapsulates all note editor state + mutations + auto-save.
 * Manages: title, content, color, type, mood, titleFont, tags, images.
 * Handles: auto-save debounce, reset on note change, focus management.
 */
export const useNoteEditor = ({
  note,
  onUpdateCache,
  onDeleteSuccess,
}: UseNoteEditorParams) => {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [color, setColor] = useState(note?.color || "default");
  const [noteTags, setNoteTags] = useState<any[]>(note?.tags || []);
  const [noteType, setNoteType] = useState<string>(note?.type || "text");
  const [mood, setMood] = useState<string>(note?.mood || "");
  const [titleFont, setTitleFont] = useState<string>(note?.titleFont || "");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const [showVersions, setShowVersions] = useState(false);
  const [showDrawing, setShowDrawing] = useState(false);

  const titleRef = useRef<HTMLInputElement>(null);
  const { tags, assignTagsToNote, removeTagFromNote } = useTags();
  const [updateNoteContent] = useMutation(UPDATE_NOTE_CONTENT);
  const [deleteNoteMut] = useMutation(DELETE_NOTE);
  const [archiveNote] = useMutation(ARCHIVE_NOTE);

  const { images, setImages, uploading, uploadFromInputEvent, deleteImage } =
    useNoteImageUpload({
      noteId: note?.id,
      initialImages: note?.images || [],
      onImagesChange: (newImages) =>
        onUpdateCache(note.id, title, content, newImages),
    });

  // Auto-focus title on open
  useEffect(() => {
    if (note?.id) {
      const timer = setTimeout(() => titleRef.current?.focus(), 120);
      return () => clearTimeout(timer);
    }
  }, [note?.id]);

  // Reset state on note change
  useEffect(() => {
    setTitle(note?.title || "");
    setContent(note?.content || "");
    setColor(note?.color || "default");
    setImages(note?.images || []);
    setNoteTags(note?.tags || []);
    setNoteType(note?.type || "text");
    setMood(note?.mood || "");
    setTitleFont(note?.titleFont || "");
  }, [note]);

  // Auto-save (debounced)
  useEffect(() => {
    if (!note) return;
    const handler = setTimeout(() => {
      const isDirty =
        title !== note.title ||
        content !== note.content ||
        color !== (note.color || "default") ||
        noteType !== (note.type || "text") ||
        mood !== (note.mood || "") ||
        titleFont !== (note.titleFont || "");
      if (isDirty) {
        setSaveStatus("saving");
        updateNoteContent({
          variables: {
            input: {
              id: note.id,
              title,
              content,
              color,
              type: noteType,
              mood,
              titleFont,
            },
          },
        })
          .then(() => {
            setSaveStatus("saved");
            setLastSavedAt(Date.now());
          })
          .catch(() => setSaveStatus("error"));
        onUpdateCache(note.id, title, content, undefined, color, mood);
      }
    }, AUTO_SAVE_DELAY);
    return () => clearTimeout(handler);
  }, [
    title,
    content,
    color,
    noteType,
    mood,
    titleFont,
    note,
    updateNoteContent,
    onUpdateCache,
  ]);

  // Tag management
  const handleAddTag = async (tag: any) => {
    await assignTagsToNote(note.id, [tag.id]);
    setNoteTags([...noteTags, tag]);
  };

  const handleRemoveTag = async (tagId: string) => {
    await removeTagFromNote(note.id, tagId);
    setNoteTags(noteTags.filter((t) => t.id !== tagId));
  };

  // Note operations
  const handleDeleteNode = async () => {
    await deleteNoteMut({
      variables: { id: note.id },
      update(cache) {
        cache.modify({
          fields: {
            getNotes(existingNotes = [], { readField }) {
              return existingNotes.filter(
                (noteRef: any) => note.id !== readField("id", noteRef)
              );
            },
          },
        });
      },
    });
    onDeleteSuccess(note.id);
  };

  const handleArchiveNode = async () => {
    await archiveNote({
      variables: { id: note.id },
      update(cache) {
        cache.modify({
          fields: {
            getNotes(existingNotes = [], { readField }) {
              return existingNotes.filter(
                (noteRef: any) => note.id !== readField("id", noteRef)
              );
            },
          },
        });
      },
    });
    onDeleteSuccess(note.id);
  };

  return {
    // Form state
    title,
    setTitle,
    content,
    setContent,
    color,
    setColor,
    noteType,
    setNoteType,
    mood,
    setMood,
    titleFont,
    setTitleFont,
    noteTags,
    saveStatus,
    lastSavedAt,
    showVersions,
    setShowVersions,
    showDrawing,
    setShowDrawing,
    // Refs
    titleRef,
    // Tag data
    availableTags: tags.filter(
      (t: any) => !noteTags.some((nt: any) => nt.id === t.id)
    ),
    // Image data
    images,
    uploading,
    uploadFromInputEvent,
    deleteImage,
    // Handlers
    handleAddTag,
    handleRemoveTag,
    handleDeleteNode,
    handleArchiveNode,
  };
};
