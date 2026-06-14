"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { TAGS_QUERY, type Tag } from "../api/tags";
import { useSession } from "@/hooks/useSession";

interface UseTagsParams {
  onLoaded?: (tags: Tag[]) => void;
}

/**
 * useTags - Fetches the user's tags with cache-and-network policy.
 * Skipped when no auth session is present.
 * Local state managed here (tags array, loading flag) for caching.
 */
export const useTags = ({ onLoaded }: UseTagsParams = {}) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [internalLoading, setInternalLoading] = useState<boolean>(true);
  const { hasSession } = useSession();

  const { data, loading, error, refetch } = useQuery<{ tags: Tag[] }>(
    TAGS_QUERY,
    {
      fetchPolicy: "cache-and-network",
      ssr: false,
      skip: !hasSession,
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
    if (error && hasSession) {
      console.error("Error fetching tags:", error);
    }
  }, [error, hasSession]);

  return { tags, loading, error, refetch };
};
