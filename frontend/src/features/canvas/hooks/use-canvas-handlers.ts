"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import type {
  Connection,
  Edge,
  Node,
  NodeChange,
} from "@xyflow/react";
import { useCanvasActions } from "../context/CanvasActionsContext";
import { useEdgeOperations } from "./useEdgeOperations";
import { usePositionPersistence } from "./usePositionPersistence";
import { useCanvasUndoRedo } from "./use-canvas-undo-redo";
import { useCanvasMutations } from "./use-canvas-mutations";
import { useCanvasUI } from "./use-canvas-ui";
import type { Note } from "../types";

type SetNodes = React.Dispatch<React.SetStateAction<Node[]>>;
type SetEdges = React.Dispatch<React.SetStateAction<Edge[]>>;

interface UseCanvasHandlersOptions {
  nodes: Node[];
  edges: Edge[];
  setNodes: SetNodes;
  setEdges: SetEdges;
  onNodesChange: (changes: NodeChange<Node>[]) => void;
  data: { getNotes?: Note[] } | undefined;
  batchUpdateNotes: ReturnType<typeof useCanvasMutations>["batchUpdateNotes"];
}

/**
 * useCanvasHandlers - All 9 canvas event handlers in one place.
 * Returns a CanvasActions object suitable for CanvasActionsProvider.
 */
export function useCanvasHandlers({
  nodes,
  edges,
  setNodes,
  setEdges,
  onNodesChange,
  data,
  batchUpdateNotes,
}: UseCanvasHandlersOptions) {
  const ui = useCanvasUI();
  const { deleteNote } = useCanvasMutations();
  const { pushSnapshot, applyUndo, applyRedo } = useCanvasUndoRedo();
  const { queueChanges: queueLayoutChanges } = usePositionPersistence({
    batchUpdate: batchUpdateNotes,
  });
  const {
    onConnect: onConnectBase,
    onEdgesDelete: onEdgesDeleteBase,
  } = useEdgeOperations({
    setEdges: setEdges as any,
    getSourceColor: (sourceId: string): string | undefined => {
      const sourceNode = nodes.find((n) => n.id === sourceId);
      return sourceNode?.data?.color as string | undefined;
    },
  });

  const handleNodeDoubleClick = useCallback(
    (nodeId: string) => {
      const note = data?.getNotes?.find((n: Note) => n.id === nodeId);
      if (note) ui.setSelectedNote(note);
    },
    [data, ui]
  );

  const handleUpdateCache = useCallback(
    (
      nodeId: string,
      newTitle?: string,
      newContent?: string,
      newImages?: Note["images"],
      color?: string,
      mood?: string
    ) => {
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === nodeId) {
            return {
              ...n,
              data: {
                ...n.data,
                title: newTitle ?? n.data.title,
                content: newContent ?? n.data.content,
                images: newImages ?? n.data.images,
                color: color ?? n.data.color,
                mood: mood ?? n.data.mood,
              },
            };
          }
          return n;
        })
      );
    },
    [setNodes]
  );

  const performNodesDelete = useCallback(
    (nodesToDelete: Node[]) => {
      pushSnapshot(nodes, edges);
      nodesToDelete.forEach((node) => {
        deleteNote({ variables: { id: node.id } })
          .then(() => toast.success("Note deleted"))
          .catch((err) => {
            console.error(err);
            toast.error("Failed to delete note");
          });
      });
      ui.setSelectedNote(null);
    },
    [deleteNote, pushSnapshot, nodes, edges, ui]
  );

  const handleNodesDelete = useCallback(
    (nodesToDelete: Node[]) => {
      if (nodesToDelete.length > 1) {
        ui.setPendingDelete(nodesToDelete);
        return;
      }
      performNodesDelete(nodesToDelete);
    },
    [performNodesDelete, ui]
  );

  const handleDeleteSuccess = useCallback(
    (nodeId: string) => {
      ui.setSelectedNote(null);
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) =>
        eds.filter((e) => e.source !== nodeId && e.target !== nodeId)
      );
    },
    [setNodes, setEdges, ui]
  );

  const handleNodesChange = useCallback(
    (changes: NodeChange<Node>[]) => {
      onNodesChange(changes);
      queueLayoutChanges(changes);
    },
    [onNodesChange, queueLayoutChanges]
  );

  const handleConnect = useCallback(
    (connection: Connection) => {
      pushSnapshot(nodes, edges);
      onConnectBase(connection);
    },
    [pushSnapshot, nodes, edges, onConnectBase]
  );

  const handleEdgesDelete = useCallback(
    (edgesToDelete: Edge[]) => {
      pushSnapshot(nodes, edges);
      onEdgesDeleteBase(edgesToDelete);
    },
    [pushSnapshot, nodes, edges, onEdgesDeleteBase]
  );

  const downloadImage = useCallback(async () => {
    const { toPng } = await import("html-to-image");
    const canvasElement = document.querySelector(".react-flow") as HTMLElement;
    if (!canvasElement) return;

    toPng(canvasElement, {
      backgroundColor: "#F7F1EA",
      quality: 1,
      pixelRatio: 2,
    })
      .then((dataUrl) => {
        const a = document.createElement("a");
        a.setAttribute(
          "download",
          `Constella_Export_${new Date().toISOString().split("T")[0]}.png`
        );
        a.setAttribute("href", dataUrl);
        a.click();
      })
      .catch((err) => {
        console.error("Failed to export canvas", err);
      });
  }, []);

  const closeSelectedNote = useCallback(() => {
    ui.setSelectedNote(null);
  }, [ui]);

  return {
    handleNodeDoubleClick,
    handleNodesDelete,
    handleDeleteSuccess,
    handleUpdateCache,
    handleNodesChange,
    handleConnect,
    handleEdgesDelete,
    downloadImage,
    closeSelectedNote,
    applyUndo: () => applyUndo(setNodes, setEdges),
    applyRedo: () => applyRedo(setNodes, setEdges),
  };
}
