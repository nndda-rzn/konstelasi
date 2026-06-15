"use client";

import { useCallback } from "react";
import { useMutation } from "@apollo/client/react";
import { DELETE_NOTE, ARCHIVE_NOTE } from "@/graphql/mutations";

/**
 * useNoteActions - Delete and archive mutations for a single note.
 * Both update the Apollo cache to remove the note from getNotes.
 */
export function useNoteActions(noteId: string, onSuccess: (id: string) => void) {
  const [deleteNoteMut] = useMutation(DELETE_NOTE);
  const [archiveNote] = useMutation(ARCHIVE_NOTE);

  const removeFromCache = (cache: any) => {
    cache.modify({
      fields: {
        getNotes(existingNotes = [], { readField }: any) {
          return existingNotes.filter(
            (noteRef: any) => noteId !== readField("id", noteRef)
          );
        },
      },
    });
  };

  const handleDelete = useCallback(async () => {
    await deleteNoteMut({
      variables: { id: noteId },
      update: removeFromCache,
    });
    onSuccess(noteId);
  }, [deleteNoteMut, noteId, onSuccess]);

  const handleArchive = useCallback(async () => {
    await archiveNote({
      variables: { id: noteId },
      update: removeFromCache,
    });
    onSuccess(noteId);
  }, [archiveNote, noteId, onSuccess]);

  return { handleDelete, handleArchive };
}
