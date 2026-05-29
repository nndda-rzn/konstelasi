"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  GET_STORIES,
  CREATE_STORY,
  UPDATE_STORY,
  DELETE_STORY,
} from "@/graphql/story";

interface StoryContextType {
  stories: any[];
  loading: boolean;
  selectedStoryId: string | null;
  setSelectedStoryId: (id: string | null) => void;
  createStory: (input: any) => Promise<any>;
  updateStory: (input: any) => Promise<any>;
  deleteStory: (id: string) => Promise<any>;
  refetchStories: () => void;
}

const StoryContext = createContext<StoryContextType | undefined>(undefined);

export function StoryProvider({ children }: { children: ReactNode }) {
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);

  const { data, loading, refetch } = useQuery<any>(GET_STORIES, {
    fetchPolicy: "cache-and-network",
  });

  const [createStoryMutation] = useMutation<any>(CREATE_STORY, {
    refetchQueries: [{ query: GET_STORIES }],
  });

  const [updateStoryMutation] = useMutation<any>(UPDATE_STORY, {
    refetchQueries: [{ query: GET_STORIES }],
  });

  const [deleteStoryMutation] = useMutation<any>(DELETE_STORY, {
    refetchQueries: [{ query: GET_STORIES }],
  });

  const createStory = async (input: any) => {
    const result = await createStoryMutation({ variables: { input } });
    return result.data?.createStory;
  };

  const updateStory = async (input: any) => {
    const result = await updateStoryMutation({ variables: { input } });
    return result.data?.updateStory;
  };

  const deleteStory = async (id: string) => {
    const result = await deleteStoryMutation({ variables: { id } });
    return result.data?.deleteStory;
  };

  return (
    <StoryContext.Provider
      value={{
        stories: data?.getStories || [],
        loading,
        selectedStoryId,
        setSelectedStoryId,
        createStory,
        updateStory,
        deleteStory,
        refetchStories: refetch,
      }}
    >
      {children}
    </StoryContext.Provider>
  );
}

export function useStory() {
  const context = useContext(StoryContext);
  if (!context) throw new Error("useStory must be used within StoryProvider");
  return context;
}
