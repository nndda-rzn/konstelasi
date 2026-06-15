"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client/react";
import { UPDATE_NOTE_CONTENT } from "@/graphql/mutations";
import { AUTO_SAVE_DELAY } from "./sidebarConstants";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

interface UseAutoSaveParams {
  note: any;
  title: string;
  content: string;
  color: string;
  noteType: string;
  mood: string;
  titleFont: string;
  onSaved?: (noteId: string, title: string, content: string, color: string, mood: string) => void;
}

/**
 * useAutoSave - Debounced auto-save for note content. Only
 * persists when the current fields differ from the source note.
 */
export function useAutoSave({
  note,
  title,
  content,
  color,
  noteType,
  mood,
  titleFont,
  onSaved,
}: UseAutoSaveParams) {
  const [updateNoteContent] = useMutation(UPDATE_NOTE_CONTENT);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);

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
            onSaved?.(note.id, title, content, color, mood);
          })
          .catch(() => setSaveStatus("error"));
      }
    }, AUTO_SAVE_DELAY);
    return () => clearTimeout(handler);
  }, [title, content, color, noteType, mood, titleFont, note, updateNoteContent, onSaved]);

  return { saveStatus, lastSavedAt };
}
