"use client";

import { useCallback } from "react";
import { useMutation } from "@apollo/client/react";
import {
  CREATE_TAG_MUTATION,
  UPDATE_TAG_MUTATION,
  DELETE_TAG_MUTATION,
  ASSIGN_TAGS_TO_NOTE_MUTATION,
  REMOVE_TAG_FROM_NOTE_MUTATION,
  type CreateTagInput,
  type UpdateTagInput,
} from "../api/tags";

interface UseTagActionsParams {
  refetch: () => void;
}

/**
 * useTagActions - Encapsulates all tag-related mutations.
 * Returns memoized handlers for create/update/delete/assign/remove.
 */
export const useTagActions = ({ refetch }: UseTagActionsParams) => {
  const [createTagMut] = useMutation(CREATE_TAG_MUTATION, {
    onCompleted: () => refetch(),
    onError: (error) => console.error("Failed to create tag:", error),
  });

  const [updateTagMut] = useMutation(UPDATE_TAG_MUTATION, {
    onCompleted: () => refetch(),
    onError: (error) => console.error("Failed to update tag:", error),
  });

  const [deleteTagMut] = useMutation(DELETE_TAG_MUTATION, {
    onCompleted: () => refetch(),
    onError: (error) => console.error("Failed to delete tag:", error),
  });

  const [assignTagsToNoteMut] = useMutation(ASSIGN_TAGS_TO_NOTE_MUTATION, {
    onCompleted: () => console.log("Tags assigned to note"),
    onError: (error) =>
      console.error("Failed to assign tags to note:", error),
  });

  const [removeTagFromNoteMut] = useMutation(REMOVE_TAG_FROM_NOTE_MUTATION, {
    onCompleted: () => console.log("Tag removed from note"),
    onError: (error) =>
      console.error("Failed to remove tag from note:", error),
  });

  const createTag = useCallback(
    async (input: CreateTagInput) => {
      await createTagMut({ variables: input });
    },
    [createTagMut]
  );

  const updateTag = useCallback(
    async (input: UpdateTagInput) => {
      await updateTagMut({ variables: input });
    },
    [updateTagMut]
  );

  const deleteTag = useCallback(
    async (id: string) => {
      await deleteTagMut({ variables: { id } });
    },
    [deleteTagMut]
  );

  const assignTagsToNote = useCallback(
    async (noteId: string, tagIds: string[]) => {
      await assignTagsToNoteMut({ variables: { noteId, tagIds } });
    },
    [assignTagsToNoteMut]
  );

  const removeTagFromNote = useCallback(
    async (noteId: string, tagId: string) => {
      await removeTagFromNoteMut({ variables: { noteId, tagId } });
    },
    [removeTagFromNoteMut]
  );

  return {
    createTag,
    updateTag,
    deleteTag,
    assignTagsToNote,
    removeTagFromNote,
  };
};
