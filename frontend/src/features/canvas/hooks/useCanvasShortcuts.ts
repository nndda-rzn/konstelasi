"use client";

import { useEffect } from "react";

interface UseCanvasShortcutsParams {
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  onCreateAtCenter: () => void;
  onUndo: () => void;
  onRedo: () => void;
}

/**
 * useCanvasShortcuts - Encapsulates all global keyboard shortcuts.
 * - Ctrl/Cmd+F: focus search
 * - N: create new note at center
 * - Ctrl/Cmd+Z: undo
 * - Ctrl/Cmd+Shift+Z: redo
 */
export const useCanvasShortcuts = ({
  searchInputRef,
  onCreateAtCenter,
  onUndo,
  onRedo,
}: UseCanvasShortcutsParams) => {
  // Ctrl/Cmd+F: focus search
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "f") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [searchInputRef]);

  // N: create new note (only when not typing in an input/textarea)
  useEffect(() => {
    const handleN = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTyping =
        !!target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if (
        !isTyping &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey &&
        e.key.toLowerCase() === "n"
      ) {
        e.preventDefault();
        onCreateAtCenter();
      }
    };

    window.addEventListener("keydown", handleN);
    return () => window.removeEventListener("keydown", handleN);
  }, [onCreateAtCenter]);

  // Ctrl/Cmd+Z: undo; Ctrl/Cmd+Shift+Z: redo
  useEffect(() => {
    const handleUndoRedo = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey) || e.key.toLowerCase() !== "z") return;
      const target = e.target as HTMLElement | null;
      const isTyping =
        !!target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if (isTyping) return;
      e.preventDefault();
      if (e.shiftKey) onRedo();
      else onUndo();
    };

    window.addEventListener("keydown", handleUndoRedo);
    return () => window.removeEventListener("keydown", handleUndoRedo);
  }, [onUndo, onRedo]);
};
