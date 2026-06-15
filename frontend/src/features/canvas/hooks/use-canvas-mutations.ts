"use client";

import { useMutation } from "@apollo/client/react";
import {
  CREATE_NOTE,
  BATCH_UPDATE_NOTES,
  DELETE_NOTE,
} from "@/graphql/mutations";
import type {
  Note,
  BatchUpdateNotesResponse,
  DeleteNoteResponse,
} from "../types";

/**
 * useCanvasMutations - All 3 GraphQL mutations used by the canvas.
 */
export function useCanvasMutations() {
  const [createNote] = useMutation<{ createNote: Note }>(CREATE_NOTE);
  const [batchUpdateNotes] = useMutation<BatchUpdateNotesResponse>(
    BATCH_UPDATE_NOTES
  );
  const [deleteNote] = useMutation<DeleteNoteResponse>(DELETE_NOTE);

  return { createNote, batchUpdateNotes, deleteNote };
}
