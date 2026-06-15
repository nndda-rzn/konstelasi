"use client";

import { useCallback, useEffect } from "react";
import {
  useNodesState,
  useEdgesState,
  useReactFlow,
  type NodeChange,
} from "@xyflow/react";
import { useStoryStore } from "../store/useStoryStore";
import { useEdgeConnection } from "./use-edge-connection";
import { useNodeCache } from "./use-node-cache";
import { matchesQuery, dimStyle } from "../utils/searchFilter";
import type { StoryNode, FlowNode, FlowEdge } from "../types/flow-types";

interface UseStoryFlowParams {
  story: { nodes?: StoryNode[] } | null | undefined;
  batchUpdateMutation: unknown;
}

/**
 * useStoryFlow - Thin orchestrator that wires React Flow state
 * with edge/cache handlers. Splits heavy work into useEdgeConnection,
 * useNodeCache, and searchFilter.
 */
export const useStoryFlow = ({ story }: UseStoryFlowParams) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
  const { screenToFlowPosition } = useReactFlow();

  const isDragging = useStoryStore((s) => s.isDragging);
  const setIsDragging = useStoryStore((s) => s.setIsDragging);
  const searchQuery = useStoryStore((s) => s.searchQuery);
  const selectedNoteId = useStoryStore((s) => s.selectedNoteId);
  const setSelectedNoteId = useStoryStore((s) => s.setSelectedNoteId);

  const { onConnect, onReconnectStart, onReconnect, onReconnectEnd } =
    useEdgeConnection(setEdges);
  const { updateNodeCache, removeNodeFromFlow } = useNodeCache(
    setNodes,
    setEdges
  );

  // Transform story nodes to flow nodes + edges
  useEffect(() => {
    if (!story?.nodes || isDragging) return;
    const query = searchQuery.trim();

    const flowNodes: FlowNode[] = (story.nodes as StoryNode[]).map((note) => {
      const isMatch = matchesQuery(query, note.title, note.content);
      return {
        id: note.id,
        position: {
          x: typeof note.positionX === "number" ? note.positionX : 0,
          y: typeof note.positionY === "number" ? note.positionY : 0,
        },
        style: {
          width: note.width || undefined,
          height: note.height || undefined,
          ...dimStyle(query !== "" && isMatch),
        },
        data: {
          title: note.title,
          content: note.content,
          color: note.color,
          mood: note.mood,
          storyNodeType: note.storyNodeType,
          storyMetadata: note.storyMetadata,
          isLocked: note.isLocked,
          unlockDate: note.unlockDate,
          isTimeLocked: note.isTimeLocked,
          eventDate: note.eventDate,
          eventLocation: note.eventLocation,
          images: note.images || [],
          tags: note.tags || [],
        },
        type: "storyNode",
      };
    });

    const flowEdges: FlowEdge[] = [];
    (story.nodes as StoryNode[]).forEach((note) => {
      note.outgoingEdges?.forEach((edge) => {
        flowEdges.push({
          id: edge.id,
          source: edge.source.id,
          target: edge.target.id,
          sourceHandle: edge.sourceHandle,
          targetHandle: edge.targetHandle,
          data: { label: edge.label, color: edge.color },
          type: "storyEdge",
        });
      });
    });

    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [story, isDragging, searchQuery, setNodes, setEdges]);

  // Drag handlers
  const handleNodeDragStart = useCallback(() => {
    setIsDragging(true);
  }, [setIsDragging]);

  const handleNodeDragStop = useCallback(() => {
    setIsDragging(false);
  }, [setIsDragging]);

  // Node change handler with position persistence
  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      onNodesChange(changes);
    },
    [onNodesChange]
  );

  // Node selection
  const handleNodeDoubleClick = useCallback(
    (_event: unknown, node: { id: string }) => {
      const noteData = story?.nodes?.find((n) => n.id === node.id);
      if (noteData) setSelectedNoteId(noteData.id);
    },
    [story, setSelectedNoteId]
  );

  const handleSelectNodeId = useCallback(
    (nodeId: string) => {
      const noteData = story?.nodes?.find((n) => n.id === nodeId);
      if (noteData) setSelectedNoteId(noteData.id);
    },
    [story, setSelectedNoteId]
  );

  return {
    nodes,
    edges,
    setNodes,
    setEdges,
    screenToFlowPosition,
    onConnect,
    onReconnectStart,
    onReconnect,
    onReconnectEnd,
    handleNodeDragStart,
    handleNodeDragStop,
    handleNodesChange,
    handleNodeDoubleClick,
    handleSelectNodeId,
    onEdgesChange,
    updateNodeCache,
    removeNodeFromFlow,
    selectedNoteId,
  };
};
