import type { StateCreator } from "zustand";
import type { PhotoBoothState, UiSlice } from "../types";

export const createUiSlice: StateCreator<
  PhotoBoothState,
  [],
  [],
  UiSlice
> = (set) => ({
  mode: "camera",
  stage: "landing",
  flowMode: "welcome",
  sessionStep: "choose-layout",
  isAuthPromptOpen: false,
  isMoreSettingsOpen: false,
  isSettingsSheetOpen: false,

  setMode: (mode) => set({ mode }),
  setStage: (stage) => set({ stage }),
  setFlowMode: (flowMode) => set({ flowMode }),
  setSessionStep: (sessionStep) => set({ sessionStep }),
  setAuthPromptOpen: (b) => set({ isAuthPromptOpen: b }),
  setMoreSettingsOpen: (b) => set({ isMoreSettingsOpen: b }),
  setSettingsSheetOpen: (b) => set({ isSettingsSheetOpen: b }),
});
