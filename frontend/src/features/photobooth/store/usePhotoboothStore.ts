"use client";

import { create } from "zustand";
import type { FilterKey, LayoutKey, EditTab, StickerItem } from "../constants";

export type Stage =
  | "landing"
  | "setup"
  | "countdown"
  | "flash"
  | "edit"
  | "saving"
  | "done";

interface PhotoboothState {
  // State machine
  stage: Stage;
  setStage: (stage: Stage) => void;

  // Captured photos
  capturedPhotos: string[];
  addPhoto: (photo: string) => void;
  clearPhotos: () => void;

  // Final processed photo
  finalPhoto: string | null;
  setFinalPhoto: (photo: string | null) => void;

  // Camera settings
  facingMode: "user" | "environment";
  toggleFacingMode: () => void;

  // Editing settings
  selectedFilter: FilterKey;
  setSelectedFilter: (filter: FilterKey) => void;

  selectedLayout: LayoutKey;
  setSelectedLayout: (layout: LayoutKey) => void;

  selectedTimer: number;
  setSelectedTimer: (timer: number) => void;

  selectedStripColor: string;
  setSelectedStripColor: (color: string) => void;

  caption: string;
  setCaption: (caption: string) => void;

  // Stickers
  stickers: StickerItem[];
  addSticker: (emoji: string) => void;
  removeSticker: (id: string) => void;
  updateStickerPosition: (id: string, x: number, y: number) => void;
  clearStickers: () => void;

  // UI state
  activeTab: EditTab;
  setActiveTab: (tab: EditTab) => void;

  // Capture process state
  processing: boolean;
  setProcessing: (processing: boolean) => void;

  countdown: number | null;
  setCountdown: (countdown: number | null) => void;

  isCapturing: boolean;
  setIsCapturing: (capturing: boolean) => void;

  // Reset action
  resetSession: () => void;
}

export const usePhotoboothStore = create<PhotoboothState>((set) => ({
  // State machine
  stage: "landing",
  setStage: (stage) => set({ stage }),

  // Captured photos
  capturedPhotos: [],
  addPhoto: (photo) =>
    set((state) => ({ capturedPhotos: [...state.capturedPhotos, photo] })),
  clearPhotos: () => set({ capturedPhotos: [] }),

  // Final processed photo
  finalPhoto: null,
  setFinalPhoto: (finalPhoto) => set({ finalPhoto }),

  // Camera settings
  facingMode: "user",
  toggleFacingMode: () =>
    set((state) => ({
      facingMode: state.facingMode === "user" ? "environment" : "user",
    })),

  // Editing settings
  selectedFilter: "normal",
  setSelectedFilter: (selectedFilter) => set({ selectedFilter }),

  selectedLayout: "strip4",
  setSelectedLayout: (selectedLayout) => set({ selectedLayout }),

  selectedTimer: 3,
  setSelectedTimer: (selectedTimer) => set({ selectedTimer }),

  selectedStripColor: "white",
  setSelectedStripColor: (selectedStripColor) => set({ selectedStripColor }),

  caption: "",
  setCaption: (caption) => set({ caption }),

  // Stickers
  stickers: [],
  addSticker: (emoji) =>
    set((state) => ({
      stickers: [
        ...state.stickers,
        {
          id: `${Date.now()}-${Math.random()}`,
          emoji,
          x: 50,
          y: 50,
        },
      ],
    })),
  removeSticker: (id) =>
    set((state) => ({
      stickers: state.stickers.filter((s) => s.id !== id),
    })),
  updateStickerPosition: (id, x, y) =>
    set((state) => ({
      stickers: state.stickers.map((s) => (s.id === id ? { ...s, x, y } : s)),
    })),
  clearStickers: () => set({ stickers: [] }),

  // UI state
  activeTab: "filter",
  setActiveTab: (activeTab) => set({ activeTab }),

  // Capture process state
  processing: false,
  setProcessing: (processing) => set({ processing }),

  countdown: null,
  setCountdown: (countdown) => set({ countdown }),

  isCapturing: false,
  setIsCapturing: (isCapturing) => set({ isCapturing }),

  // Reset
  resetSession: () =>
    set({
      stage: "setup",
      capturedPhotos: [],
      finalPhoto: null,
      stickers: [],
      caption: "",
      isCapturing: false,
      countdown: null,
      processing: false,
    }),
}));
