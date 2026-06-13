"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import type { Node } from "@xyflow/react";

interface UseNodeDeletionParams {
  deleteNote: any;
  pushSnapshot: (nodes: any[], edges: any[]) => void;
  setSelectedNote: (n: any) => void;
  setPendingDelete: (nodes: any[]) => void;
}

/**
 * useNodeDeletion - Multi-node deletion with confirmation flow.
 * - 1 node: delete immediately
 * - N nodes: open confirmation dialog (parent sets pendingDelete)
 */
export const useNodeDeletion = ({
  deleteNote,
  pushSnapshot,
  setSelectedNote,
  setPendingDelete,
}: UseNodeDeletionParams) => {
  const performDelete = useCallback(
    (nodesToDelete: Node[], currentNodes: any[], currentEdges: any[]) => {
      pushSnapshot(currentNodes, currentEdges);
      nodesToDelete.forEach((node) => {
        deleteNote({ variables: { id: node.id } })
          .then(() => toast.success("Note dihapus"))
          .catch((err: any) => {
            console.error(err);
            toast.error("Gagal menghapus note");
          });
      });
      setSelectedNote(null);
    },
    [deleteNote, pushSnapshot, setSelectedNote]
  );

  const handleDelete = useCallback(
    (nodesToDelete: Node[], currentNodes: any[], currentEdges: any[]) => {
      if (nodesToDelete.length > 1) {
        setPendingDelete(nodesToDelete);
        return;
      }
      performDelete(nodesToDelete, currentNodes, currentEdges);
    },
    [performDelete, setPendingDelete]
  );

  return { handleDelete, performDelete };
};
