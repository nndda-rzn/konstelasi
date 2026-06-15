"use client";

import { useCallback } from "react";
import { useCanvasUIStore } from "../store/useCanvasUIStore";

/**
 * useCanvasUI - Single composite hook for all UI state from the
 * zustand store. Replaces 13 individual selectors in DiaryCanvas
 * with one stable object reference per render.
 */
export function useCanvasUI() {
  const viewMode = useCanvasUIStore((s) => s.viewMode);
  const setViewMode = useCanvasUIStore((s) => s.setViewMode);
  const activePanel = useCanvasUIStore((s) => s.activePanel);
  const togglePanel = useCanvasUIStore((s) => s.togglePanel);
  const closePanel = useCanvasUIStore((s) => s.closePanel);
  const openPanel = useCanvasUIStore((s) => s.openPanel);
  const searchQuery = useCanvasUIStore((s) => s.searchQuery);
  const setSearchQuery = useCanvasUIStore((s) => s.setSearchQuery);
  const selectedNote = useCanvasUIStore((s) => s.selectedNote);
  const setSelectedNote = useCanvasUIStore((s) => s.setSelectedNote);
  const pendingDelete = useCanvasUIStore((s) => s.pendingDelete);
  const setPendingDelete = useCanvasUIStore((s) => s.setPendingDelete);
  const clearPendingDelete = useCanvasUIStore((s) => s.clearPendingDelete);

  const handleTogglePanel = useCallback(
    (panel: NonNullable<typeof activePanel>) => {
      togglePanel(panel);
    },
    [togglePanel]
  );

  return {
    viewMode,
    setViewMode,
    activePanel,
    togglePanel: handleTogglePanel,
    closePanel,
    openPanel,
    searchQuery,
    setSearchQuery,
    selectedNote,
    setSelectedNote,
    pendingDelete,
    setPendingDelete,
    clearPendingDelete,
  };
}
