"use client";

import { create } from "zustand";

export type CanvasViewMode = "canvas" | "thread" | "timeline";

export type ActivePanel =
  | "tag"
  | "search"
  | "stats"
  | "archive"
  | "export"
  | "calendar"
  | null;

interface CanvasUIState {
  // View mode
  viewMode: CanvasViewMode;
  setViewMode: (mode: CanvasViewMode) => void;

  // Active overlay panel (mutually exclusive)
  activePanel: ActivePanel;
  togglePanel: (panel: Exclude<ActivePanel, null>) => void;
  closePanel: () => void;
  openPanel: (panel: Exclude<ActivePanel, null>) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Selected note
  selectedNote: any | null;
  setSelectedNote: (note: any | null) => void;

  // Pending multi-delete confirmation
  pendingDelete: any[];
  setPendingDelete: (nodes: any[]) => void;
  clearPendingDelete: () => void;
}

export const useCanvasUIStore = create<CanvasUIState>((set) => ({
  viewMode: "canvas",
  setViewMode: (viewMode) => set({ viewMode }),

  activePanel: null,
  togglePanel: (panel) =>
    set((s) => ({
      activePanel: s.activePanel === panel ? null : panel,
    })),
  closePanel: () => set({ activePanel: null }),
  openPanel: (panel) => set({ activePanel: panel }),

  searchQuery: "",
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  selectedNote: null,
  setSelectedNote: (selectedNote) => set({ selectedNote }),

  pendingDelete: [],
  setPendingDelete: (pendingDelete) => set({ pendingDelete }),
  clearPendingDelete: () => set({ pendingDelete: [] }),
}));
