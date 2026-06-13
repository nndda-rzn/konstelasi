"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { useTags as useTagsQuery } from "@/features/canvas/hooks/useTags";
import { useTagActions } from "@/features/canvas/hooks/useTagActions";
import type { Tag } from "@/features/canvas/api/tags";

export type { Tag } from "@/features/canvas/api/tags";

export interface TagContextType {
  tags: Tag[];
  selectedTagFilters: string[];
  loading: boolean;
  setSelectedTagFilters: (ids: string[]) => void;
  createTag: (
    name: string,
    color?: string,
    description?: string
  ) => Promise<void>;
  updateTag: (
    id: string,
    name: string,
    color?: string,
    description?: string
  ) => Promise<void>;
  deleteTag: (id: string) => Promise<void>;
  assignTagsToNote: (noteId: string, tagIds: string[]) => Promise<void>;
  removeTagFromNote: (noteId: string, tagId: string) => Promise<void>;
  getTagSuggestions: (query: string) => Tag[];
}

const TagContext = createContext<TagContextType | undefined>(undefined);

export const useTags = () => {
  const context = useContext(TagContext);
  if (!context) {
    throw new Error("useTags must be used within a TagProvider");
  }
  return context;
};

export const TagProvider = ({ children }: { children: ReactNode }) => {
  const [selectedTagFilters, setSelectedTagFilters] = useState<string[]>([]);

  // Data layer (delegated)
  const { tags, loading } = useTagsQuery();
  const { refetch } = useTagsQuery();

  // Actions (delegated)
  const { createTag, updateTag, deleteTag, assignTagsToNote, removeTagFromNote } =
    useTagActions({ refetch });

  // Adapter signatures (positional args)
  const handleCreateTag = useCallback(
    (name: string, color?: string, description?: string) =>
      createTag({ name, color, description }),
    [createTag]
  );

  const handleUpdateTag = useCallback(
    (id: string, name: string, color?: string, description?: string) =>
      updateTag({ id, name, color, description }),
    [updateTag]
  );

  const handleDeleteTag = useCallback(
    (id: string) => deleteTag(id),
    [deleteTag]
  );

  const handleAssignTagsToNote = useCallback(
    (noteId: string, tagIds: string[]) => assignTagsToNote(noteId, tagIds),
    [assignTagsToNote]
  );

  const handleRemoveTagFromNote = useCallback(
    (noteId: string, tagId: string) => removeTagFromNote(noteId, tagId),
    [removeTagFromNote]
  );

  const getTagSuggestions = useCallback(
    (query: string) => {
      if (!query) return [];
      return tags.filter((tag) =>
        tag.name.toLowerCase().includes(query.toLowerCase())
      );
    },
    [tags]
  );

  const value = useMemo<TagContextType>(
    () => ({
      tags,
      selectedTagFilters,
      loading,
      setSelectedTagFilters,
      createTag: handleCreateTag,
      updateTag: handleUpdateTag,
      deleteTag: handleDeleteTag,
      assignTagsToNote: handleAssignTagsToNote,
      removeTagFromNote: handleRemoveTagFromNote,
      getTagSuggestions,
    }),
    [
      tags,
      selectedTagFilters,
      loading,
      handleCreateTag,
      handleUpdateTag,
      handleDeleteTag,
      handleAssignTagsToNote,
      handleRemoveTagFromNote,
      getTagSuggestions,
    ]
  );

  return <TagContext.Provider value={value}>{children}</TagContext.Provider>;
};
