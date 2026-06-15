"use client";

import { useEffect, useState } from "react";

/**
 * useNoteForm - Manages the form state for a single note
 * (title, content, color, type, mood, titleFont, tags, images).
 * Resets all fields whenever the note prop changes.
 */
export function useNoteForm(note: any) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [color, setColor] = useState(note?.color || "default");
  const [noteTags, setNoteTags] = useState<any[]>(note?.tags || []);
  const [noteType, setNoteType] = useState<string>(note?.type || "text");
  const [mood, setMood] = useState<string>(note?.mood || "");
  const [titleFont, setTitleFont] = useState<string>(note?.titleFont || "");

  useEffect(() => {
    setTitle(note?.title || "");
    setContent(note?.content || "");
    setColor(note?.color || "default");
    setNoteTags(note?.tags || []);
    setNoteType(note?.type || "text");
    setMood(note?.mood || "");
    setTitleFont(note?.titleFont || "");
  }, [note]);

  return {
    title,
    setTitle,
    content,
    setContent,
    color,
    setColor,
    noteTags,
    setNoteTags,
    noteType,
    setNoteType,
    mood,
    setMood,
    titleFont,
    setTitleFont,
  };
}
