"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client/core";

export const TAGS_QUERY = gql`
  query GetUserTags {
    tags {
      id
      name
      color
      description
    }
  }
`;

export const CREATE_TAG_MUTATION = gql`
  mutation CreateTag($name: String!, $color: String, $description: String) {
    createTag(name: $name, color: $color, description: $description) {
      id
      name
      color
      description
    }
  }
`;

export const UPDATE_TAG_MUTATION = gql`
  mutation UpdateTag(
    $id: String!
    $name: String
    $color: String
    $description: String
  ) {
    updateTag(id: $id, name: $name, color: $color, description: $description) {
      id
      name
      color
      description
    }
  }
`;

export const DELETE_TAG_MUTATION = gql`
  mutation DeleteTag($id: String!) {
    deleteTag(id: $id)
  }
`;

export const ASSIGN_TAGS_TO_NOTE_MUTATION = gql`
  mutation AssignTagsToNote($noteId: String!, $tagIds: [String!]!) {
    assignTagsToNote(noteId: $noteId, tagIds: $tagIds)
  }
`;

export const REMOVE_TAG_FROM_NOTE_MUTATION = gql`
  mutation RemoveTagFromNote($noteId: String!, $tagId: String!) {
    removeTagFromNote(noteId: $noteId, tagId: $tagId)
  }
`;

interface Tag {
  id: string;
  name: string;
  color?: string | null;
  description?: string | null;
}

interface TagContextType {
  tags: Tag[];
  selectedTagFilters: string[]; // array of tag IDs that are currently selected for filtering
  loading: boolean;
  setSelectedTagFilters: (ids: string[]) => void;
  createTag: (
    name: string,
    color?: string,
    description?: string,
  ) => Promise<void>;
  updateTag: (
    id: string,
    name: string,
    color?: string,
    description?: string,
  ) => Promise<void>;
  deleteTag: (id: string) => Promise<void>;
  assignTagsToNote: (noteId: string, tagIds: string[]) => Promise<void>;
  removeTagFromNote: (noteId: string, tagId: string) => Promise<void>;
  getTagSuggestions: (query: string) => Tag[]; // optional: for autocomplete
}

const TagContext = createContext<TagContextType | undefined>(undefined);

export const useTags = () => {
  const context = useContext(TagContext);
  if (!context) {
    throw new Error("useTags must be used within a TagProvider");
  }
  return context;
};

export const TagProvider = ({ children }: { children: React.ReactNode }) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTagFilters, setSelectedTagFilters] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const {
    data,
    loading: queryLoading,
    error,
    refetch,
  } = useQuery<any>(TAGS_QUERY, {
    fetchPolicy: "cache-and-network",
    ssr: false,
  });

  useEffect(() => {
    if (data && !queryLoading) {
      setLoading(false);
      setTags(data.tags || []);
    }
  }, [data, queryLoading]);

  const [createTag] = useMutation<any>(CREATE_TAG_MUTATION, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {
      console.error("Failed to create tag:", error);
    },
  });

  const [updateTag] = useMutation<any>(UPDATE_TAG_MUTATION, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {
      console.error("Failed to update tag:", error);
    },
  });

  const [deleteTag] = useMutation<any>(DELETE_TAG_MUTATION, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {
      console.error("Failed to delete tag:", error);
    },
  });

  const [assignTagsToNote] = useMutation<any>(ASSIGN_TAGS_TO_NOTE_MUTATION, {
    onCompleted: () => {
      // Optionally refetch if we want to update tag usage counts, but not necessary
      console.log("Tags assigned to note");
    },
    onError: (error) => {
      console.error("Failed to assign tags to note:", error);
    },
  });

  const [removeTagFromNote] = useMutation<any>(REMOVE_TAG_FROM_NOTE_MUTATION, {
    onCompleted: () => {
      console.log("Tag removed from note");
    },
    onError: (error) => {
      console.error("Failed to remove tag from note:", error);
    },
  });

  const handleCreateTag = useCallback(
    async (name: string, color?: string, description?: string) => {
      await createTag({
        variables: {
          name,
          color,
          description,
        },
      });
    },
    [createTag],
  );

  const handleUpdateTag = useCallback(
    async (id: string, name: string, color?: string, description?: string) => {
      await updateTag({
        variables: {
          id,
          name,
          color,
          description,
        },
      });
    },
    [updateTag],
  );

  const handleDeleteTag = useCallback(
    async (id: string) => {
      await deleteTag({
        variables: {
          id,
        },
      });
    },
    [deleteTag],
  );

  const handleAssignTagsToNote = useCallback(
    async (noteId: string, tagIds: string[]) => {
      await assignTagsToNote({
        variables: {
          noteId,
          tagIds,
        },
      });
    },
    [assignTagsToNote],
  );

  const handleRemoveTagFromNote = useCallback(
    async (noteId: string, tagId: string) => {
      await removeTagFromNote({
        variables: {
          noteId,
          tagId,
        },
      });
    },
    [removeTagFromNote],
  );

  const getTagSuggestions = useCallback(
    (query: string) => {
      if (!query) return [];
      return tags.filter((tag) =>
        tag.name.toLowerCase().includes(query.toLowerCase()),
      );
    },
    [tags],
  );

  useEffect(() => {
    if (error) {
      console.error("Error fetching tags:", error);
    }
  }, [error]);

  const value = {
    tags,
    selectedTagFilters,
    loading: queryLoading || loading,
    setSelectedTagFilters,
    createTag: handleCreateTag,
    updateTag: handleUpdateTag,
    deleteTag: handleDeleteTag,
    assignTagsToNote: handleAssignTagsToNote,
    removeTagFromNote: handleRemoveTagFromNote,
    getTagSuggestions,
  };

  return <TagContext.Provider value={value}>{children}</TagContext.Provider>;
};
