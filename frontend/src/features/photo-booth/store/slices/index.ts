import { create } from "zustand";
import type { PhotoBoothState } from "../types";
import { DEFAULT_TEMPLATE_ID } from "../../config/templates";
import { createConfigSlice } from "./config.slice";
import { createCaptureSlice } from "./capture.slice";
import { createUiSlice } from "./ui.slice";
import { createCameraSlice } from "./camera.slice";
import { createEditorSlice } from "./editor.slice";
import { createGallerySlice } from "./gallery.slice";

export const createPhotoBoothStore = () =>
  create<PhotoBoothState>()((...a) => ({
    ...createConfigSlice(...a),
    ...createCaptureSlice(...a),
    ...createUiSlice(...a),
    ...createCameraSlice(...a),
    ...createEditorSlice(...a),
    ...createGallerySlice(...a),

    resetSession: () =>
      a[0]({
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

    resetAll: () => {
      const set = a[0];
      // This is a bit manual but safest for composed state reset
      set({
        // UI
        mode: "camera",
        stage: "landing",
        flowMode: "welcome",
        sessionStep: "choose-layout",
        isAuthPromptOpen: false,
        isMoreSettingsOpen: false,
        isSettingsSheetOpen: false,
        // Config
        selectedRatioId: "square",
        selectedLayoutId: "strip4",
        selectedQuality: "standard",
        selectedTheme: "white",
        selectedBackground: "none",
        selectedFilter: "normal",
        selectedEffect: "off",
        selectedTimer: 3,
        selectedFrame: "softDiary",
        selectedTemplateId: DEFAULT_TEMPLATE_ID,
        caption: "",
        // Capture
        phase: "idle",
        errorMessage: null,
        capturedFrames: [],
        isCapturing: false,
        countdown: null,
        processing: false,
        // Camera
        facingMode: "user",
        isCameraReady: false,
        isGridEnabled: true,
        // Editor
        composed: null,
        stickers: [],
        // Gallery
        gallery: [],
      });
    },
  }));
