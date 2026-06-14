/**
 * Photo Booth Store - Types.
 */

import type {
  RatioId,
  LayoutId,
  QualityId,
  BackgroundId,
  ThemeId,
  FilterId,
  EffectId,
  Stage,
  Mode,
} from "../photoBooth.config";
import type { ComposeResult, GalleryMetadata, Sticker } from "../photoBooth.types";

/**
 * CapturePhase - explicit state machine for the capture session.
 * idle → countdown → capturing → processing → result
 * any state → error (on failure) → idle (on retry)
 */
export type CapturePhase =
  | "idle"
  | "countdown"
  | "capturing"
  | "processing"
  | "result"
  | "error";

/**
 * FlowMode - top-level screen for the photobooth experience.
 * welcome  → entry/start screen
 * session  → in-progress capture (layout → format → camera)
 * result   → finished, editing/saving
 */
export type FlowMode = "welcome" | "session" | "result";

/**
 * SessionStep - sub-step within the 'session' FlowMode.
 */
export type SessionStep =
  | "choose-layout"
  | "choose-format"
  | "camera";

/* ----- Config slice ----- */
export interface ConfigSlice {
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
}

/* ----- Capture slice ----- */
export interface CaptureSlice {
  phase: CapturePhase;
  setPhase: (p: CapturePhase) => void;
  errorMessage: string | null;
  setErrorMessage: (m: string | null) => void;
  capturedFrames: string[];
  addFrame: (dataUrl: string) => void;
  clearFrames: () => void;
  isCapturing: boolean;
  setIsCapturing: (b: boolean) => void;
  countdown: number | null;
  setCountdown: (n: number | null) => void;
  processing: boolean;
  setProcessing: (b: boolean) => void;
}

/* ----- UI slice ----- */
export interface UiSlice {
  mode: Mode;
  stage: Stage;
  setMode: (mode: Mode) => void;
  setStage: (stage: Stage) => void;
  flowMode: FlowMode;
  sessionStep: SessionStep;
  setFlowMode: (m: FlowMode) => void;
  setSessionStep: (s: SessionStep) => void;
  isAuthPromptOpen: boolean;
  setAuthPromptOpen: (b: boolean) => void;
  isMoreSettingsOpen: boolean;
  setMoreSettingsOpen: (b: boolean) => void;
  isSettingsSheetOpen: boolean;
  setSettingsSheetOpen: (b: boolean) => void;
}

/* ----- Camera slice ----- */
export interface CameraSlice {
  facingMode: "user" | "environment";
  toggleFacingMode: () => void;
  isCameraReady: boolean;
  setCameraReady: (b: boolean) => void;
  isGridEnabled: boolean;
  setGridEnabled: (b: boolean) => void;
}

/* ----- Editor slice ----- */
export interface EditorSlice {
  composed: ComposeResult | null;
  setComposed: (c: ComposeResult | null) => void;
  stickers: Sticker[];
  addSticker: (emoji: string) => void;
  removeSticker: (id: string) => void;
  updateStickerPosition: (id: string, x: number, y: number) => void;
  clearStickers: () => void;
}

/* ----- Gallery slice ----- */
export interface GallerySlice {
  gallery: GalleryMetadata[];
  addGalleryItem: (item: GalleryMetadata) => void;
  removeGalleryItem: (id: string) => void;
}

/* ----- Combined state ----- */
export type PhotoBoothState = ConfigSlice &
  CaptureSlice &
  UiSlice &
  CameraSlice &
  EditorSlice &
  GallerySlice & {
    resetSession: () => void;
    resetAll: () => void;
  };
