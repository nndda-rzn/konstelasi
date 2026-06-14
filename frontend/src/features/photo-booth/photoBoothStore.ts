"use client";

import { create } from "zustand";
import {
  PHOTO_LAYOUTS,
  PHOTO_THEMES,
  type EffectId,
} from "./photoBooth.config";
import type { ComposeResult, GalleryMetadata, Sticker } from "./photoBooth.types";

/**
 * Re-export types from store/types.ts for consumers.
 */
export type {
  CapturePhase,
  FlowMode,
  SessionStep,
  ConfigSlice,
  CaptureSlice,
  UiSlice,
  CameraSlice,
  EditorSlice,
  GallerySlice,
  PhotoBoothState,
} from "./store/types";

import type {
  RatioId,
  LayoutId,
  QualityId,
  BackgroundId,
  ThemeId,
  FilterId,
  Stage,
  Mode,
} from "./photoBooth.config";
import type { FrameId } from "./config/frames";

/**
 * Re-export selectors from store/selectors.ts for consumers.
 */
export {
  selectPhotoRatio,
  selectPhotoLayout,
  selectRequiredShots,
  selectPhotoTheme,
  selectIsSessionActive,
} from "./store/selectors";

// Re-export config constants for convenience from store consumers.
export {
  PHOTO_RATIOS,
  PHOTO_LAYOUTS,
  PHOTO_FILTERS,
  PHOTO_THEMES,
  PHOTO_BACKGROUNDS,
  PHOTO_EFFECTS,
  PHOTO_QUALITIES,
  LAYOUT_DECORATIONS,
  FRAME_COLORS,
  RATIO_LIST,
  LAYOUT_LIST,
  TIMERS,
} from "./photoBooth.config";

// Re-export frame config
export {
  FRAME_STYLES,
  FRAME_MAP,
  DEFAULT_FRAME_ID,
} from "./config/frames";
export type { FrameId, FrameStyle, FrameDecor } from "./config/frames";

/** Legacy alias for backward compat. */
import type { CapturePhase, FlowMode, SessionStep } from "./store/types";

interface PhotoBoothState {
  /* ----- Mode & stage ----- */
  mode: Mode;
  stage: Stage;
  setMode: (mode: Mode) => void;
  setStage: (stage: Stage) => void;

  /* ----- Flow mode (multi-step) ----- */
  flowMode: FlowMode;
  sessionStep: SessionStep;
  setFlowMode: (m: FlowMode) => void;
  setSessionStep: (s: SessionStep) => void;

  /* ----- Capture phase (state machine) ----- */
  phase: CapturePhase;
  setPhase: (p: CapturePhase) => void;
  errorMessage: string | null;
  setErrorMessage: (m: string | null) => void;

  /* ----- Selected config ----- */
  selectedRatioId: RatioId;
  selectedLayoutId: LayoutId;
  selectedQuality: QualityId;
  selectedTheme: ThemeId;
  selectedBackground: BackgroundId;
  selectedFilter: FilterId;
  selectedEffect: EffectId;
  selectedTimer: number;
  selectedFrame: FrameId;
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
  setSelectedFrame: (f: FrameId) => void;
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
  | "flowMode"
  | "sessionStep"
  | "phase"
  | "errorMessage"
  | "selectedRatioId"
  | "selectedLayoutId"
  | "selectedQuality"
  | "selectedTheme"
  | "selectedBackground"
  | "selectedFilter"
  | "selectedEffect"
  | "selectedTimer"
  | "selectedFrame"
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
  flowMode: "welcome",
  sessionStep: "choose-layout",
  phase: "idle",
  errorMessage: null,
  selectedRatioId: "square",
  selectedLayoutId: "strip4",
  selectedQuality: "standard",
  selectedTheme: "white",
  selectedBackground: "none",
  selectedFilter: "normal",
  selectedEffect: "off",
  selectedTimer: 3,
  selectedFrame: "softDiary",
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
  setFlowMode: (flowMode) => set({ flowMode }),
  setSessionStep: (sessionStep) => set({ sessionStep }),

  setPhase: (phase) => set({ phase }),
  setErrorMessage: (errorMessage) => set({ errorMessage }),

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
  setSelectedFrame: (f) => set({ selectedFrame: f }),
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
      phase: "idle",
      flowMode: "session",
      sessionStep: "camera",
      errorMessage: null,
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


