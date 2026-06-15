"use client";

import { useEffect, useState } from "react";
import { toDateTimeInputValue } from "./dateHelpers";

function safeParseMetadata(json: string | undefined | null): Record<string, unknown> {
  if (!json) return {};
  try {
    return JSON.parse(json);
  } catch {
    return {};
  }
}

/**
 * useStoryNodeForm - Form state for a single story node:
 * title, content, mood, lock state, dates, focus mode, metadata.
 */
export function useStoryNodeForm(note: any) {
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
  const [metadata, setMetadata] = useState<Record<string, unknown>>(
    safeParseMetadata(note?.storyMetadata)
  );

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
      setMetadata(safeParseMetadata(note.storyMetadata));
    }
  }, [note?.id]);

  const handleMetadataChange = (key: string, value: string) => {
    setMetadata((prev) => ({ ...prev, [key]: value }));
  };

  return {
    title,
    setTitle,
    content,
    setContent,
    contentMasked,
    setContentMasked,
    mood,
    setMood,
    isLocked,
    setIsLocked,
    eventDate,
    setEventDate,
    eventLocation,
    setEventLocation,
    unlockDate,
    setUnlockDate,
    focusMode,
    setFocusMode,
    metadata,
    handleMetadataChange,
  };
}
