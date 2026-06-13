"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { TAGS_QUERY, type Tag } from "../api/tags";

interface UseTagsParams {
  onLoaded?: (tags: Tag[]) => void;
}

/**
 * useTags - Fetches the user's tags with cache-and-network policy.
 * Local state managed here (tags array, loading flag) for caching.
 */
export const useTags = ({ onLoaded }: UseTagsParams = {}) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [internalLoading, setInternalLoading] = useState<boolean>(true);

  const { data, loading, error, refetch } = useQuery<{ tags: Tag[] }>(
    TAGS_QUERY,
    {
      fetchPolicy: "cache-and-network",
      ssr: false,
    }
  );

  useEffect(() => {
    if (data && !loading) {
      setInternalLoading(false);
      setTags(data.tags || []);
      if (onLoaded) onLoaded(data.tags || []);
    }
  }, [data, loading, onLoaded]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching tags:", error);
    }
  }, [error]);

  return { tags, loading, error, refetch };
};
