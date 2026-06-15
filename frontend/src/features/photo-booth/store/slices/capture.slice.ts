import type { StateCreator } from "zustand";
import type { CaptureSlice, PhotoBoothState } from "../types";

export const createCaptureSlice: StateCreator<
  PhotoBoothState,
  [],
  [],
  CaptureSlice
> = (set) => ({
  phase: "idle",
  errorMessage: null,
  capturedFrames: [],
  isCapturing: false,
  countdown: null,
  processing: false,

  setPhase: (phase) => set({ phase }),
  setErrorMessage: (errorMessage) => set({ errorMessage }),
  addFrame: (dataUrl) =>
    set((s) => ({ capturedFrames: [...s.capturedFrames, dataUrl] })),
  clearFrames: () => set({ capturedFrames: [] }),
  setIsCapturing: (b) => set({ isCapturing: b }),
  setCountdown: (n) => set({ countdown: n }),
  setProcessing: (b) => set({ processing: b }),
});
