"use client";

import { createContext, useContext } from "react";
import type { Note } from "../types";

/**
 * CanvasDataContext - Shares the notes query result and refetch
 * with child panels without prop-drilling. Populated by DiaryCanvas
 * after useCanvasData resolves.
 */
export interface CanvasData {
  notes: Note[];
  refetch: () => void;
}

const CanvasDataContext = createContext<CanvasData | null>(null);

export const CanvasDataProvider = CanvasDataContext.Provider;

export function useCanvasData2(): CanvasData {
  const ctx = useContext(CanvasDataContext);
  if (!ctx) {
    throw new Error("useCanvasData2 must be used inside <CanvasDataProvider>");
  }
  return ctx;
}
