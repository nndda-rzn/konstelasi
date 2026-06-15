"use client";

import { useCallback } from "react";
import { useMutation } from "@apollo/client/react";
import { DELETE_NOTE } from "@/graphql/mutations";
import { TOGGLE_NODE_LOCK } from "@/graphql/story";
import { notify } from "@/lib/toast";

/**
 * useStoryNodeActions - Delete and lock/unlock mutations for a
 * single story node.
 */
export function useStoryNodeActions(
  noteId: string,
  currentLocked: boolean,
  onDeleted: () => void
) {
  const [deleteNoteMut] = useMutation(DELETE_NOTE);
  const [toggleLock] = useMutation(TOGGLE_NODE_LOCK);

  const handleToggleLock = useCallback(async () => {
    try {
      await toggleLock({ variables: { noteId } });
      notify.success(currentLocked ? "Node dibuka" : "Node dikunci");
    } catch {
      notify.error("Gagal mengubah lock");
    }
  }, [toggleLock, noteId, currentLocked]);

  const handleDelete = useCallback(async () => {
    try {
      await deleteNoteMut({ variables: { id: noteId } });
      notify.success("Node dihapus");
      onDeleted();
    } catch {
      notify.error("Gagal menghapus node");
    }
  }, [deleteNoteMut, noteId, onDeleted]);

  return { handleToggleLock, handleDelete };
}
