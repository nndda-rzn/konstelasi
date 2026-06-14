"use client";

import { create } from "zustand";
import {
  PHOTO_RATIOS,
  PHOTO_LAYOUTS,
  PHOTO_FILTERS,
  PHOTO_THEMES,
  PHOTO_BACKGROUNDS,
  PHOTO_EFFECTS,
  type RatioId,
  type LayoutId,
  type QualityId,
  type BackgroundId,
  type ThemeId,
  type FilterId,
  type EffectId,
  type Stage,
  type Mode,
  type PhotoRatio,
  type PhotoLayout,
} from "./photoBooth.config";
import type { Sticker, ComposeResult, GalleryMetadata } from "./photoBooth.types";

interface PhotoBoothState {
  /* ----- Mode & stage ----- */
  mode: Mode;
  stage: Stage;
  setMode: (mode: Mode) => void;
  setStage: (stage: Stage) => void;

  /* ----- Selected config ----- */
  selectedRatioId: RatioId;
  selectedLayoutId: LayoutId;
  selectedQuality: QualityId;
  selectedTheme: ThemeId;
  selectedBackground: BackgroundId;
  selectedFilter: FilterId;
  selectedEffect: EffectId;
  selectedTimer: number;
  caption: string;
  setSelectedRatio: (id: RatioId) => void;
  setSelectedLayout: (id: LayoutId) => void;
  setSelectedQuality: (q: QualityId) => void;
  setSelectedTheme: (t: ThemeId) => void;
  setSelectedBackground: (bg: BackgroundId) => void;
  setSelectedFilter: (f: FilterId) => void;
  setSelectedEffect: (e: EffectId) => void;
  cycleSelectedEffect: () => void;
  setSelectedTimer: (n: number) => void;
  setCaption: (c: string) => void;

  /* ----- Camera state ----- */
  facingMode: "user" | "environment";
  toggleFacingMode: () => void;
  isCameraReady: boolean;
  setCameraReady: (b: boolean) => void;
  isGridEnabled: boolean;
  setGridEnabled: (b: boolean) => void;

  /* ----- Capture process ----- */
  capturedFrames: string[];
  addFrame: (dataUrl: string) => void;
  clearFrames: () => void;
  isCapturing: boolean;
  setIsCapturing: (b: boolean) => void;
  countdown: number | null;
  setCountdown: (n: number | null) => void;
  processing: boolean;
  setProcessing: (b: boolean) => void;

  /* ----- Result ----- */
  composed: ComposeResult | null;
  setComposed: (c: ComposeResult | null) => void;

  /* ----- Stickers ----- */
  stickers: Sticker[];
  addSticker: (emoji: string) => void;
  removeSticker: (id: string) => void;
  updateStickerPosition: (id: string, x: number, y: number) => void;
  clearStickers: () => void;

  /* ----- Gallery ----- */
  gallery: GalleryMetadata[];
  addGalleryItem: (item: GalleryMetadata) => void;
  removeGalleryItem: (id: string) => void;

  /* ----- UI state ----- */
  isAuthPromptOpen: boolean;
  setAuthPromptOpen: (b: boolean) => void;
  isMoreSettingsOpen: boolean;
  setMoreSettingsOpen: (b: boolean) => void;
  isSettingsSheetOpen: boolean;
  setSettingsSheetOpen: (b: boolean) => void;

  /* ----- Reset ----- */
  resetSession: () => void;
  resetAll: () => void;
}

const defaultState: Pick<
  PhotoBoothState,
  | "mode"
  | "stage"
  | "selectedRatioId"
  | "selectedLayoutId"
  | "selectedQuality"
  | "selectedTheme"
  | "selectedBackground"
  | "selectedFilter"
  | "selectedEffect"
  | "selectedTimer"
  | "caption"
  | "facingMode"
  | "isCameraReady"
  | "isGridEnabled"
  | "capturedFrames"
  | "isCapturing"
  | "countdown"
  | "processing"
  | "composed"
  | "stickers"
  | "gallery"
  | "isAuthPromptOpen"
  | "isMoreSettingsOpen"
  | "isSettingsSheetOpen"
> = {
  mode: "camera",
  stage: "landing",
  selectedRatioId: "square",
  selectedLayoutId: "strip4",
  selectedQuality: "standard",
  selectedTheme: "white",
  selectedBackground: "none",
  selectedFilter: "normal",
  selectedEffect: "off",
  selectedTimer: 3,
  caption: "",
  facingMode: "user",
  isCameraReady: false,
  isGridEnabled: true,
  capturedFrames: [],
  isCapturing: false,
  countdown: null,
  processing: false,
  composed: null,
  stickers: [],
  gallery: [],
  isAuthPromptOpen: false,
  isMoreSettingsOpen: false,
  isSettingsSheetOpen: false,
};

export const usePhotoBoothStore = create<PhotoBoothState>((set) => ({
  ...defaultState,

  setMode: (mode) => set({ mode }),
  setStage: (stage) => set({ stage }),

  setSelectedRatio: (id) => set({ selectedRatioId: id }),
  setSelectedLayout: (id) => {
    set({ selectedLayoutId: id });
  },
  setSelectedQuality: (q) => set({ selectedQuality: q }),
  setSelectedTheme: (t) => set({ selectedTheme: t }),
  setSelectedBackground: (bg) => set({ selectedBackground: bg }),
  setSelectedFilter: (f) => set({ selectedFilter: f }),
  setSelectedEffect: (e) => set({ selectedEffect: e }),
  cycleSelectedEffect: () =>
    set((s) => {
      const order: EffectId[] = ["off", "soft", "warm"];
      const next = order[(order.indexOf(s.selectedEffect) + 1) % order.length];
      return { selectedEffect: next };
    }),
  setSelectedTimer: (n) => set({ selectedTimer: n }),
  setCaption: (c) => set({ caption: c }),

  toggleFacingMode: () =>
    set((s) => ({
      facingMode: s.facingMode === "user" ? "environment" : "user",
    })),
  setCameraReady: (b) => set({ isCameraReady: b }),
  setGridEnabled: (b) => set({ isGridEnabled: b }),

  addFrame: (dataUrl) =>
    set((s) => ({ capturedFrames: [...s.capturedFrames, dataUrl] })),
  clearFrames: () => set({ capturedFrames: [] }),
  setIsCapturing: (b) => set({ isCapturing: b }),
  setCountdown: (n) => set({ countdown: n }),
  setProcessing: (b) => set({ processing: b }),

  setComposed: (c) => set({ composed: c }),

  addSticker: (emoji) =>
    set((s) => ({
      stickers: [
        ...s.stickers,
        { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, emoji, x: 50, y: 50 },
      ],
    })),
  removeSticker: (id) =>
    set((s) => ({ stickers: s.stickers.filter((st) => st.id !== id) })),
  updateStickerPosition: (id, x, y) =>
    set((s) => ({
      stickers: s.stickers.map((st) =>
        st.id === id ? { ...st, x, y } : st
      ),
    })),
  clearStickers: () => set({ stickers: [] }),

  addGalleryItem: (item) =>
    set((s) => ({ gallery: [item, ...s.gallery] })),
  removeGalleryItem: (id) =>
    set((s) => ({ gallery: s.gallery.filter((g) => g.id !== id) })),

  setAuthPromptOpen: (b) => set({ isAuthPromptOpen: b }),
  setMoreSettingsOpen: (b) => set({ isMoreSettingsOpen: b }),
  setSettingsSheetOpen: (b) => set({ isSettingsSheetOpen: b }),

  resetSession: () =>
    set({
      stage: "setup",
      capturedFrames: [],
      composed: null,
      stickers: [],
      caption: "",
      isAuthPromptOpen: false,
      isMoreSettingsOpen: false,
      isSettingsSheetOpen: false,
      isCapturing: false,
      countdown: null,
      processing: false,
    }),
  resetAll: () => set({ ...defaultState }),
}));

/* ------------------------------------------------------------------ */
/*  Convenience selectors                                                */
/* ------------------------------------------------------------------ */

export const selectPhotoRatio = (s: PhotoBoothState): PhotoRatio =>
  PHOTO_RATIOS[s.selectedRatioId];
export const selectPhotoLayout = (s: PhotoBoothState): PhotoLayout =>
  PHOTO_LAYOUTS[s.selectedLayoutId];
export const selectRequiredShots = (s: PhotoBoothState): number =>
  PHOTO_LAYOUTS[s.selectedLayoutId].requiredShots;
export const selectPhotoTheme = (s: PhotoBoothState) =>
  PHOTO_THEMES[s.selectedTheme];

// Re-export config constants for convenience from store consumers.
export {
  PHOTO_RATIOS,
  PHOTO_LAYOUTS,
  PHOTO_FILTERS,
  PHOTO_THEMES,
  PHOTO_BACKGROUNDS,
  PHOTO_EFFECTS,
  PHOTO_QUALITIES,
  RATIO_LIST,
  LAYOUT_LIST,
  TIMERS,
} from "./photoBooth.config";
