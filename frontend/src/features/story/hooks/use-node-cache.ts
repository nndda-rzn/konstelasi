"use client";

import { useCallback } from "react";
import type { Edge, Node } from "@xyflow/react";

type SetNodes = React.Dispatch<React.SetStateAction<Node[]>>;
type SetEdges = React.Dispatch<React.SetStateAction<Edge[]>>;

/**
 * useNodeCache - Local cache updaters for story flow nodes/edges.
 * Used after editor changes or successful server deletes.
 */
export function useNodeCache(setNodes: SetNodes, setEdges: SetEdges) {
  const updateNodeCache = useCallback(
    (
      nodeId: string,
      newTitle?: string,
      newContent?: string,
      newImages?: unknown[],
      color?: string,
      mood?: string,
      extra?: Record<string, unknown>
    ) => {
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === nodeId) {
            return {
              ...n,
              data: {
                ...n.data,
                title: newTitle ?? n.data.title,
                content: newContent ?? n.data.content,
                images: newImages ?? n.data.images,
                color: color ?? n.data.color,
                mood: mood ?? n.data.mood,
                ...extra,
              },
            };
          }
          return n;
        })
      );
    },
    [setNodes]
  );

  const removeNodeFromFlow = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) =>
        eds.filter((e) => e.source !== nodeId && e.target !== nodeId)
      );
    },
    [setNodes, setEdges]
  );

  return { updateNodeCache, removeNodeFromFlow };
}
