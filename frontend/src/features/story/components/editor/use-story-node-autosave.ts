"use client";

import { useEffect } from "react";
import { useMutation } from "@apollo/client/react";
import { UPDATE_NOTE_CONTENT } from "@/graphql/mutations";

const AUTO_SAVE_DELAY = 800;

interface UseStoryNodeAutoSaveParams {
  note: any;
  title: string;
  content: string;
  contentMasked: boolean;
  mood: string;
  eventDate: string;
  eventLocation: string;
  unlockDate: string;
  onSaved: (noteId: string, title: string, content: string | undefined, mood: string, extra: { unlockDate: string | null; isTimeLocked: boolean }) => void;
  onNotFound: () => void;
}

/**
 * useStoryNodeAutoSave - Debounced auto-save for story node content.
 * Includes time-locked unlock date logic.
 */
export function useStoryNodeAutoSave({
  note,
  title,
  content,
  contentMasked,
  mood,
  eventDate,
  eventLocation,
  unlockDate,
  onSaved,
  onNotFound,
}: UseStoryNodeAutoSaveParams) {
  const [updateContent] = useMutation(UPDATE_NOTE_CONTENT);

  useEffect(() => {
    if (!note) return;
    const handler = setTimeout(async () => {
      const nextUnlockDate = unlockDate
        ? new Date(unlockDate).toISOString()
        : null;
      const nextIsTimeLocked = Boolean(
        nextUnlockDate && new Date(nextUnlockDate).getTime() > Date.now()
      );
      const input: Record<string, unknown> = {
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
        onSaved(
          note.id,
          title,
          contentMasked ? undefined : content,
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
          onNotFound();
          return;
        }
        console.error("Auto-save failed:", err);
      }
    }, AUTO_SAVE_DELAY);
    return () => clearTimeout(handler);
  }, [title, content, contentMasked, mood, eventDate, eventLocation, unlockDate]);
}
