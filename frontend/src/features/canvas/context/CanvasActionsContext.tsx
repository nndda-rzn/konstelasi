"use client";

import { createContext, useContext } from "react";
import type { Connection, Edge, Node, NodeChange } from "@xyflow/react";
import type { Note } from "../types";

/**
 * CanvasActions - Bundle of all canvas event handlers, passed via
 * context to children (panels, sidebars, modals) so they don't
 * need to be prop-drilled through every layer.
 */
export interface CanvasActions {
  handleNodeDoubleClick: (nodeId: string) => void;
  handleNodesDelete: (nodesToDelete: Node[]) => void;
  handleDeleteSuccess: (nodeId: string) => void;
  handleUpdateCache: (
    nodeId: string,
    newTitle?: string,
    newContent?: string,
    newImages?: Note["images"],
    color?: string,
    mood?: string
  ) => void;
  handleNodesChange: (changes: NodeChange<Node>[]) => void;
  handleConnect: (connection: Connection) => void;
  handleEdgesDelete: (edgesToDelete: Edge[]) => void;
  downloadImage: () => void;
  closeSelectedNote: () => void;
  applyUndo: () => void;
  applyRedo: () => void;
}

const CanvasActionsContext = createContext<CanvasActions | null>(null);

export const CanvasActionsProvider = CanvasActionsContext.Provider;

export function useCanvasActions(): CanvasActions {
  const ctx = useContext(CanvasActionsContext);
  if (!ctx) {
    throw new Error(
      "useCanvasActions must be used inside <CanvasActionsProvider>"
    );
  }
  return ctx;
}
