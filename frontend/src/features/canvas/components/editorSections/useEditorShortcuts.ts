"use client";

import { useEffect } from "react";

interface UseEditorShortcutsParams {
  onClose: () => void;
  isBlocked: boolean;
}

/**
 * useEditorShortcuts - Listens for the Escape key and triggers
 * onClose, unless isBlocked (e.g. while a nested modal is open).
 */
export function useEditorShortcuts({ onClose, isBlocked }: UseEditorShortcutsParams) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (isBlocked) return;
      onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, isBlocked]);
}
