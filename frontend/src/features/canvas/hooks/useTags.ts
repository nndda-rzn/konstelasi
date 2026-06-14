"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { TAGS_QUERY, type Tag } from "../api/tags";
import { useHasSession } from "@/lib/supabase/use-has-session";

interface UseTagsParams {
  onLoaded?: (tags: Tag[]) => void;
}

/**
 * useTags - Fetches the user's tags with cache-and-network policy.
 * Skips the query entirely when no Supabase session is present.
 * Local state managed here (tags array, loading flag) for caching.
 */
export const useTags = ({ onLoaded }: UseTagsParams = {}) => {
  const hasSession = useHasSession();
  const [tags, setTags] = useState<Tag[]>([]);
  const [internalLoading, setInternalLoading] = useState<boolean>(true);

  const { data, loading, error, refetch } = useQuery<{ tags: Tag[] }>(
    TAGS_QUERY,
    {
      fetchPolicy: "cache-and-network",
      ssr: false,
      skip: hasSession !== true,
    }
  );

  useEffect(() => {
    if (data && !loading) {
      setInternalLoading(false);
      setTags(data.tags || []);
      if (onLoaded) onLoaded(data.tags || []);
    }
  }, [data, loading, onLoaded]);

  return {
    tags,
    loading: hasSession === null || internalLoading || loading,
    error,
    refetch,
  };
};
