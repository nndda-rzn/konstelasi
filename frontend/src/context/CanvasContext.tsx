"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { useCanvases } from "@/features/canvas/hooks/useCanvases";
import { useCanvasActions } from "@/features/canvas/hooks/useCanvasActions";
import type { Canvas } from "@/features/canvas/api/canvases";

export type { Canvas } from "@/features/canvas/api/canvases";

export interface CanvasContextType {
  canvases: Canvas[];
  selectedCanvasId: string | null;
  loading: boolean;
  setSelectedCanvasId: (id: string | null) => void;
  createCanvas: (
    name: string,
    description?: string,
    parentId?: string
  ) => Promise<void>;
  updateCanvas: (
    id: string,
    name: string,
    description?: string
  ) => Promise<void>;
  deleteCanvas: (id: string) => Promise<void>;
}

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export const useCanvas = () => {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error("useCanvas must be used within a CanvasProvider");
  }
  return context;
};

export const CanvasProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCanvasId, setSelectedCanvasId] = useState<string | null>(null);
  const [internalLoading, setInternalLoading] = useState<boolean>(true);

  // Data fetch (delegated)
  const { canvases, loading: queryLoading, refetch } = useCanvases({
    onLoaded: (list) => {
      setInternalLoading(false);
      // Auto-select first canvas if none selected
      setSelectedCanvasId((current) => current ?? (list[0]?.id ?? null));
    },
  });

  // CRUD actions (delegated)
  const { createCanvas, updateCanvas, deleteCanvas } = useCanvasActions({
    canvases,
    selectedCanvasId,
    setSelectedCanvasId,
    refetch,
  });

  // Adapter signatures to preserve old API (positional args)
  const handleCreateCanvas = useCallback(
    (name: string, description?: string, parentId?: string) =>
      createCanvas({ name, description, parentId }),
    [createCanvas]
  );

  const handleUpdateCanvas = useCallback(
    (id: string, name: string, description?: string) =>
      updateCanvas({ id, name, description }),
    [updateCanvas]
  );

  const handleDeleteCanvas = useCallback(
    (id: string) => deleteCanvas(id),
    [deleteCanvas]
  );

  const value = useMemo<CanvasContextType>(
    () => ({
      canvases,
      selectedCanvasId,
      loading: queryLoading || internalLoading,
      setSelectedCanvasId,
      createCanvas: handleCreateCanvas,
      updateCanvas: handleUpdateCanvas,
      deleteCanvas: handleDeleteCanvas,
    }),
    [
      canvases,
      selectedCanvasId,
      queryLoading,
      internalLoading,
      handleCreateCanvas,
      handleUpdateCanvas,
      handleDeleteCanvas,
    ]
  );

  return (
    <CanvasContext.Provider value={value}>{children}</CanvasContext.Provider>
  );
};
