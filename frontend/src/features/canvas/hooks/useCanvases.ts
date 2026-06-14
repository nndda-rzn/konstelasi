"use client";

import { useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { CANVASES_QUERY, type CanvasesData } from "../api/canvases";
import { useHasSession } from "@/lib/supabase/use-has-session";

interface UseCanvasesParams {
  onLoaded?: (canvases: CanvasesData["canvases"]) => void;
}

/**
 * useCanvases - Fetches the user's canvases with cache-and-network policy.
 * Skips the query entirely when no Supabase session is present.
 * Optional callback receives data once loaded.
 */
export const useCanvases = ({ onLoaded }: UseCanvasesParams = {}) => {
  const hasSession = useHasSession();

  const { data, loading, error, refetch } = useQuery<CanvasesData>(
    CANVASES_QUERY,
    {
      fetchPolicy: "cache-and-network",
      ssr: false,
      skip: hasSession !== true,
    }
  );

  useEffect(() => {
    if (data && onLoaded) {
      onLoaded(data.canvases);
    }
  }, [data, onLoaded]);

  return {
    canvases: data?.canvases || [],
    loading: hasSession === null || loading,
    error,
    refetch,
  };
};
