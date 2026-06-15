import type { StateCreator } from "zustand";
import type { CameraSlice, PhotoBoothState } from "../types";

export const createCameraSlice: StateCreator<
  PhotoBoothState,
  [],
  [],
  CameraSlice
> = (set) => ({
  facingMode: "user",
  isCameraReady: false,
  isGridEnabled: true,

  toggleFacingMode: () =>
    set((s) => ({
      facingMode: s.facingMode === "user" ? "environment" : "user",
    })),
  setCameraReady: (b) => set({ isCameraReady: b }),
  setGridEnabled: (b) => set({ isGridEnabled: b }),
});
