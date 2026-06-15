import type { StateCreator } from "zustand";
import type { ConfigSlice, PhotoBoothState } from "../types";
import { DEFAULT_TEMPLATE_ID } from "../../config/templates";
import type { EffectId } from "../../photoBooth.config";

export const createConfigSlice: StateCreator<
  PhotoBoothState,
  [],
  [],
  ConfigSlice
> = (set) => ({
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

  setSelectedRatio: (id) => set({ selectedRatioId: id }),
  setSelectedLayout: (id) => set({ selectedLayoutId: id }),
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
  setSelectedTemplate: (id) => set({ selectedTemplateId: id }),
  setCaption: (c) => set({ caption: c }),
});
