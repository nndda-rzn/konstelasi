"use client";

import { useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { CANVASES_QUERY, type CanvasesData } from "../api/canvases";

interface UseCanvasesParams {
  onLoaded?: (canvases: CanvasesData["canvases"]) => void;
}

/**
 * useCanvases - Fetches the user's canvases with cache-and-network policy.
 * Optional callback receives data once loaded.
 */
export const useCanvases = ({ onLoaded }: UseCanvasesParams = {}) => {
  const { data, loading, error, refetch } = useQuery<CanvasesData>(
    CANVASES_QUERY,
    {
      fetchPolicy: "cache-and-network",
      ssr: false,
    }
  );

  useEffect(() => {
    if (data && onLoaded) {
      onLoaded(data.canvases);
    }
  }, [data, onLoaded]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching canvases:", error);
    }
  }, [error]);

  return {
    canvases: data?.canvases || [],
    loading,
    error,
    refetch,
  };
};
