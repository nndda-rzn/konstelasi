"use client";

import { useCallback } from "react";
import { useMutation } from "@apollo/client/react";
import {
  CREATE_CANVAS_MUTATION,
  UPDATE_CANVAS_MUTATION,
  DELETE_CANVAS_MUTATION,
  type Canvas,
  type CreateCanvasInput,
  type UpdateCanvasInput,
} from "../api/canvases";

interface UseCanvasActionsParams {
  canvases: Canvas[];
  selectedCanvasId: string | null;
  setSelectedCanvasId: (id: string | null) => void;
  refetch: () => void;
}

/**
 * useCanvasActions - Encapsulates canvas CRUD mutations.
 * Returns memoized handlers for create/update/delete with auto-refetch.
 */
export const useCanvasActions = ({
  canvases,
  selectedCanvasId,
  setSelectedCanvasId,
  refetch,
}: UseCanvasActionsParams) => {
  const [createCanvasMut] = useMutation(CREATE_CANVAS_MUTATION, {
    onCompleted: () => refetch(),
    onError: (error) => {
      console.error("Failed to create canvas:", error);
    },
  });

  const [updateCanvasMut] = useMutation(UPDATE_CANVAS_MUTATION, {
    onCompleted: () => refetch(),
    onError: (error) => {
      console.error("Failed to update canvas:", error);
    },
  });

  const [deleteCanvasMut] = useMutation(DELETE_CANVAS_MUTATION, {
    onCompleted: () => {
      refetch();
      if (selectedCanvasId) {
        const remaining =
          canvases.filter((c) => c.id !== selectedCanvasId) || [];
        setSelectedCanvasId(remaining.length > 0 ? remaining[0].id : null);
      }
    },
    onError: (error) => {
      console.error("Failed to delete canvas:", error);
    },
  });

  const createCanvas = useCallback(
    async (input: CreateCanvasInput) => {
      await createCanvasMut({ variables: input });
    },
    [createCanvasMut]
  );

  const updateCanvas = useCallback(
    async (input: UpdateCanvasInput) => {
      await updateCanvasMut({ variables: input });
    },
    [updateCanvasMut]
  );

  const deleteCanvas = useCallback(
    async (id: string) => {
      await deleteCanvasMut({ variables: { id } });
    },
    [deleteCanvasMut]
  );

  return { createCanvas, updateCanvas, deleteCanvas };
};
