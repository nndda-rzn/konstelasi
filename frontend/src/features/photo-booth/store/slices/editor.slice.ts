import type { StateCreator } from "zustand";
import type { EditorSlice, PhotoBoothState } from "../types";

export const createEditorSlice: StateCreator<
  PhotoBoothState,
  [],
  [],
  EditorSlice
> = (set) => ({
  composed: null,
  stickers: [],

  setComposed: (c) => set({ composed: c }),
  addSticker: (emoji) =>
    set((s) => ({
      stickers: [
        ...s.stickers,
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          emoji,
          x: 50,
          y: 50,
        },
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
});
