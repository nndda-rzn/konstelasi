"use client";

import { useCallback, useEffect } from "react";
import {
  useNodesState,
  useEdgesState,
  useReactFlow,
  addEdge,
  reconnectEdge,
  type NodeChange,
} from "@xyflow/react";
import { useMutation } from "@apollo/client/react";
import { CREATE_NOTE_LINK, DELETE_NOTE_LINK } from "@/graphql/mutations";
import { useStoryStore } from "../store/useStoryStore";

interface UseStoryFlowParams {
  story: any;
  batchUpdateMutation: any;
}

interface StoryNode {
  id: string;
  title?: string;
  content?: string;
  color?: string;
  mood?: string;
  storyNodeType?: string;
  storyMetadata?: string;
  isLocked?: boolean;
  unlockDate?: string;
  isTimeLocked?: boolean;
  eventDate?: string;
  eventLocation?: string;
  positionX?: number;
  positionY?: number;
  width?: number;
  height?: number;
  images?: any[];
  tags?: any[];
  outgoingEdges?: Array<{
    id: string;
    source: { id: string };
    target: { id: string };
    sourceHandle?: string;
    targetHandle?: string;
    label?: string;
    color?: string;
  }>;
}

export interface FlowNode {
  id: string;
  position: { x: number; y: number };
  style?: any;
  data: any;
  type: string;
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  data?: any;
  type: string;
}

/**
 * useStoryFlow - Orchestrates React Flow nodes/edges for the story canvas.
 * Handles:
 * - Data transformation: story nodes -> flow nodes
 * - Connection creation/deletion
 * - Drag lifecycle tracking
 * - Position persistence (batched)
 */
export const useStoryFlow = ({ story, batchUpdateMutation }: UseStoryFlowParams) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
  const { screenToFlowPosition } = useReactFlow();

  const [createNoteLink] = useMutation(CREATE_NOTE_LINK);
  const [deleteNoteLink] = useMutation(DELETE_NOTE_LINK);

  const isDragging = useStoryStore((s) => s.isDragging);
  const setIsDragging = useStoryStore((s) => s.setIsDragging);
  const searchQuery = useStoryStore((s) => s.searchQuery);
  const selectedNoteId = useStoryStore((s) => s.selectedNoteId);
  const setSelectedNoteId = useStoryStore((s) => s.setSelectedNoteId);

  // Track ref for edge reconnection (used in handlers below)
  const edgeReconnectSuccessful = { current: true };

  // Transform story nodes to flow nodes
  useEffect(() => {
    if (!story?.nodes) return;
    if (isDragging) return;

    const query = searchQuery.trim().toLowerCase();
    const flowNodes: FlowNode[] = (story.nodes as StoryNode[]).map((note) => {
      const titleMatch = note.title?.toLowerCase().includes(query);
      const contentMatch = note.content
        ?.replace(/<[^>]+>/g, "")
        .toLowerCase()
        .includes(query);
      const isMatch = !query || titleMatch || contentMatch;

      return {
        id: note.id,
        position: {
          x: typeof note.positionX === "number" ? note.positionX : 0,
          y: typeof note.positionY === "number" ? note.positionY : 0,
        },
        style: {
          width: note.width || undefined,
          height: note.height || undefined,
          opacity: query && !isMatch ? 0.25 : 1,
          filter: query && !isMatch ? "grayscale(0.6)" : "none",
          transition: "opacity 0.3s ease, filter 0.3s ease",
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

  // Connection handler
  const onConnect = useCallback(
    async (connection: any) => {
      try {
        await createNoteLink({
          variables: {
            input: {
              sourceId: connection.source,
              targetId: connection.target,
              sourceHandle: connection.sourceHandle || "right",
              targetHandle: connection.targetHandle || "left",
            },
          },
        });
        setEdges((eds: any[]) => addEdge(connection, eds));
      } catch (err) {
        console.error("Failed to create connection:", err);
        throw err;
      }
    },
    [createNoteLink, setEdges]
  );

  // Reconnection handlers
  const onReconnectStart = useCallback(() => {
    edgeReconnectSuccessful.current = false;
  }, []);

  const onReconnect = useCallback(
    async (oldEdge: any, newConnection: any) => {
      edgeReconnectSuccessful.current = true;
      try {
        setEdges((eds: any[]) => reconnectEdge(oldEdge, newConnection, eds));
        if (!oldEdge.id.startsWith("temp-")) {
          await deleteNoteLink({ variables: { id: oldEdge.id } });
        }
        await createNoteLink({
          variables: {
            input: {
              sourceId: newConnection.source,
              targetId: newConnection.target,
              sourceHandle: newConnection.sourceHandle || "right",
              targetHandle: newConnection.targetHandle || "left",
            },
          },
        });
      } catch (err) {
        console.error("Failed to reconnect edge:", err);
        throw err;
      }
    },
    [createNoteLink, deleteNoteLink, setEdges]
  );

  const onReconnectEnd = useCallback(
    (_event: any, edge: any) => {
      if (!edgeReconnectSuccessful.current) {
        setEdges((eds: any[]) => eds.filter((e: any) => e.id !== edge.id));
        if (!edge.id.startsWith("temp-")) {
          deleteNoteLink({ variables: { id: edge.id } }).catch(() => {});
        }
      }
      edgeReconnectSuccessful.current = true;
    },
    [deleteNoteLink, setEdges]
  );

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
      // Position persistence happens in parent via usePositionPersistence
    },
    [onNodesChange]
  );

  // Node selection
  const handleNodeDoubleClick = useCallback(
    (_event: any, node: any) => {
      const noteData = story?.nodes?.find((n: any) => n.id === node.id);
      if (noteData) {
        setSelectedNoteId(noteData.id);
      }
    },
    [story, setSelectedNoteId]
  );

  const handleSelectNodeId = useCallback(
    (nodeId: string) => {
      const noteData = story?.nodes?.find((n: any) => n.id === nodeId);
      if (noteData) {
        setSelectedNoteId(noteData.id);
      }
    },
    [story, setSelectedNoteId]
  );

  // Cache updater (for editor changes)
  const updateNodeCache = useCallback(
    (
      nodeId: string,
      newTitle?: string,
      newContent?: string,
      newImages?: any[],
      color?: string,
      mood?: string,
      extra?: any
    ) => {
      setNodes((nds: any[]) =>
        nds.map((n: any) => {
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

  // Delete node from local state (called on successful server delete)
  const removeNodeFromFlow = useCallback(
    (nodeId: string) => {
      setNodes((nds: any[]) => nds.filter((n: any) => n.id !== nodeId));
      setEdges((eds: any[]) =>
        eds.filter(
          (e: any) => e.source !== nodeId && e.target !== nodeId
        )
      );
    },
    [setNodes, setEdges]
  );

  return {
    // Flow state
    nodes,
    edges,
    setNodes,
    setEdges,
    screenToFlowPosition,
    // Handlers
    onConnect,
    onReconnectStart,
    onReconnect,
    onReconnectEnd,
    handleNodeDragStart,
    handleNodeDragStop,
    handleNodesChange,
    handleNodeDoubleClick,
    handleSelectNodeId,
    onEdgesChange: onEdgesChange,
    updateNodeCache,
    removeNodeFromFlow,
    selectedNoteId,
  };
};
