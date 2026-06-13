"use client";

import { useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_NOTES } from "@/graphql/queries";
import { useCanvas } from "@/context/CanvasContext";
import { useTags } from "@/context/TagContext";
import { notesToFlow } from "@/features/canvas/utils/notesToFlow";
import { useCanvasUIStore } from "../store/useCanvasUIStore";
import type { GetNotesData } from "@/features/canvas/types";

interface UseCanvasDataParams {
  onNodeDoubleClick: (nodeId: string) => void;
  handleEdgeLabelChange: (edgeId: string, label: string) => void;
  setNodes: (
    nodes: any[] | ((nodes: any[]) => any[])
  ) => void;
  setEdges: (
    edges: any[] | ((edges: any[]) => any[])
  ) => void;
}

/**
 * useCanvasData - Fetches notes and converts to React Flow nodes/edges.
 * Also applies search filtering on subsequent updates without resetting positions.
 */
export const useCanvasData = ({
  onNodeDoubleClick,
  handleEdgeLabelChange,
  setNodes,
  setEdges,
}: UseCanvasDataParams) => {
  const { selectedCanvasId } = useCanvas();
  const { selectedTagFilters } = useTags();
  const searchQuery = useCanvasUIStore((s) => s.searchQuery);

  const { data, loading, error, refetch } = useQuery<GetNotesData>(GET_NOTES, {
    variables: {
      canvasId: selectedCanvasId || undefined,
      tagIds:
        selectedTagFilters.length > 0 ? selectedTagFilters : undefined,
    },
    fetchPolicy: "cache-and-network",
    ssr: false,
  });

  // Build initial flow from data (full rebuild)
  useEffect(() => {
    if (data && data.getNotes) {
      const { nodes: initialNodes, edges: initialEdges } = notesToFlow(
        data.getNotes,
        {
          searchQuery,
          onNodeDoubleClick,
          onEdgeLabelChange: handleEdgeLabelChange,
        }
      );
      setNodes(initialNodes);
      setEdges(initialEdges);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // Apply search filter without resetting positions
  useEffect(() => {
    setNodes((nds: any[]) =>
      nds.map((n: any) => {
        const titleMatch = n.data.title
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());
        const contentMatch = n.data.content
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());
        const isMatch = searchQuery === "" || titleMatch || contentMatch;

        return {
          ...n,
          data: {
            ...n.data,
            isSearching: searchQuery !== "",
            isMatch,
          },
        };
      })
    );
  }, [searchQuery, setNodes]);
  return { data, loading, error, refetch };
};
