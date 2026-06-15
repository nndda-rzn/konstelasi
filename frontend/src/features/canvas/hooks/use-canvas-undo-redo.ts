"use client";

import { useCallback } from "react";
import { useCanvasHistory } from "./useCanvasHistory";

/**
 * useCanvasUndoRedo - Wraps the raw useCanvasHistory with
 * apply() helpers that take the latest nodes/edges and apply
 * the snapshot to setNodes/setEdges from React Flow.
 */
export function useCanvasUndoRedo() {
  const { pushSnapshot, undo, redo, canUndo, canRedo } = useCanvasHistory();

  const applyUndo = useCallback(
    (setNodes: (n: any) => void, setEdges: (e: any) => void) => {
      const s = undo();
      if (s) {
        setNodes(s.nodes);
        setEdges(s.edges);
      }
    },
    [undo]
  );

  const applyRedo = useCallback(
    (setNodes: (n: any) => void, setEdges: (e: any) => void) => {
      const s = redo();
      if (s) {
        setNodes(s.nodes);
        setEdges(s.edges);
      }
    },
    [redo]
  );

  return { pushSnapshot, canUndo, canRedo, applyUndo, applyRedo };
}
