import type { StateCreator } from "zustand";
import type { GallerySlice, PhotoBoothState } from "../types";

export const createGallerySlice: StateCreator<
  PhotoBoothState,
  [],
  [],
  GallerySlice
> = (set) => ({
  gallery: [],

  addGalleryItem: (item) =>
    set((s) => ({ gallery: [item, ...s.gallery] })),
  removeGalleryItem: (id) =>
    set((s) => ({ gallery: s.gallery.filter((g) => g.id !== id) })),
});
