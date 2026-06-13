"use client";

import { create } from "zustand";

export type ViewMode =
  | "canvas"
  | "timeline"
  | "reading"
  | "gallery"
  | "outline"
  | "cinematic";

export type InsightKey =
  | "analytics"
  | "stats"
  | "emotional"
  | "timeline"
  | "versions"
  | "characters"
  | null;

interface StoryState {
  // UI state
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  // Panel visibility
  showSettings: boolean;
  toggleSettings: () => void;
  closeSettings: () => void;

  showNodeSelector: boolean;
  openNodeSelector: () => void;
  closeNodeSelector: () => void;

  showExport: boolean;
  toggleExport: () => void;
  closeExport: () => void;

  showInsightsMenu: boolean;
  toggleInsightsMenu: () => void;
  closeInsightsMenu: () => void;

  // Active insight panel
  activeInsight: InsightKey;
  setActiveInsight: (key: InsightKey) => void;
  closeInsight: () => void;

  // Selected node
  selectedNoteId: string | null;
  setSelectedNoteId: (id: string | null) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Drag tracking (prevents refetch race conditions)
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
}

export const useStoryStore = create<StoryState>((set) => ({
  viewMode: "canvas",
  setViewMode: (viewMode) => set({ viewMode }),

  showSettings: false,
  toggleSettings: () => set((s) => ({ showSettings: !s.showSettings })),
  closeSettings: () => set({ showSettings: false }),

  showNodeSelector: false,
  openNodeSelector: () => set({ showNodeSelector: true }),
  closeNodeSelector: () => set({ showNodeSelector: false }),

  showExport: false,
  toggleExport: () => set((s) => ({ showExport: !s.showExport })),
  closeExport: () => set({ showExport: false }),

  showInsightsMenu: false,
  toggleInsightsMenu: () =>
    set((s) => ({ showInsightsMenu: !s.showInsightsMenu })),
  closeInsightsMenu: () => set({ showInsightsMenu: false }),

  activeInsight: null,
  setActiveInsight: (activeInsight) => set({ activeInsight }),
  closeInsight: () => set({ activeInsight: null }),

  selectedNoteId: null,
  setSelectedNoteId: (selectedNoteId) => set({ selectedNoteId }),

  searchQuery: "",
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  isDragging: false,
  setIsDragging: (isDragging) => set({ isDragging }),
}));
