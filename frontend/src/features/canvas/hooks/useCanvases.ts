"use client";

import { useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { CANVASES_QUERY, type CanvasesData } from "../api/canvases";
import { useSession } from "@/hooks/useSession";

interface UseCanvasesParams {
  onLoaded?: (canvases: CanvasesData["canvases"]) => void;
}

/**
 * useCanvases - Fetches the user's canvases with cache-and-network policy.
 * Skipped when no auth session is present to avoid noisy Unauthorized errors.
 * Optional callback receives data once loaded.
 */
export const useCanvases = ({ onLoaded }: UseCanvasesParams = {}) => {
  const { hasSession } = useSession();

  const { data, loading, error, refetch } = useQuery<CanvasesData>(
    CANVASES_QUERY,
    {
      fetchPolicy: "cache-and-network",
      ssr: false,
      skip: !hasSession,
    }
  );

  useEffect(() => {
    if (data && onLoaded) {
      onLoaded(data.canvases);
    }
  }, [data, onLoaded]);

  useEffect(() => {
    if (error && hasSession) {
      console.error("Error fetching canvases:", error);
    }
  }, [error, hasSession]);

  return {
    canvases: data?.canvases || [],
    loading,
    error,
    refetch,
  };
};
