"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import {
  CREATE_NOTE,
  BATCH_UPDATE_NOTES,
  DELETE_NOTE,
} from "@/graphql/mutations";
import {
  UPDATE_STORY,
  ADD_NODE_TO_STORY,
} from "@/graphql/story";
import { useStoryStore } from "../store/useStoryStore";

interface UseStoryActionsParams {
  storyId: string;
  refetch: () => void;
  screenToFlowPosition: (clientPos: { x: number; y: number }) => {
    x: number;
    y: number;
  };
  nodes: any[];
  removeNodeFromFlow: (nodeId: string) => void;
}

/**
 * useStoryActions - Encapsulates all story-related mutations and CRUD operations.
 * - Add new story node (smart positioning)
 * - Update story metadata/status
 * - Delete node
 * - Toggle status (draft/published)
 */
export const useStoryActions = ({
  storyId,
  refetch,
  screenToFlowPosition,
  nodes,
  removeNodeFromFlow,
}: UseStoryActionsParams) => {
  const router = useRouter();
  const setSelectedNoteId = useStoryStore((s) => s.setSelectedNoteId);

  const [createNote] = useMutation<{ createNote: { id: string } }>(
    CREATE_NOTE
  );
  const [batchUpdateNotes] = useMutation(BATCH_UPDATE_NOTES);
  const [deleteNote] = useMutation(DELETE_NOTE);
  const [updateStory] = useMutation(UPDATE_STORY);
  const [addNodeToStory] = useMutation(ADD_NODE_TO_STORY);

  const selectedNoteId = useStoryStore((s) => s.selectedNoteId);

  // Smart position calculation for new node
  const computeSmartPosition = useCallback(() => {
    const NODE_WIDTH = 220;
    const NODE_HEIGHT = 180;
    const GAP = 40;

    if (nodes.length === 0) {
      return screenToFlowPosition({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      });
    }

    // Anchor on selected node if available
    if (selectedNoteId) {
      const anchor = nodes.find((n: any) => n.id === selectedNoteId);
      if (anchor) {
        const siblings = nodes.filter(
          (n: any) =>
            n.position.x >= anchor.position.x + NODE_WIDTH &&
            n.position.x < anchor.position.x + NODE_WIDTH * 2 + GAP &&
            Math.abs(n.position.y - anchor.position.y) < NODE_HEIGHT * 3
        );
        const verticalOffset =
          siblings.length === 0
            ? 0
            : (siblings.length % 2 === 0 ? 1 : -1) *
              Math.ceil(siblings.length / 2) *
              (NODE_HEIGHT + GAP);
        return {
          x: anchor.position.x + NODE_WIDTH + GAP,
          y: anchor.position.y + verticalOffset,
        };
      }
    }

    // Fallback: rightmost + offset
    const rightmost = nodes.reduce(
      (acc: any, n: any) =>
        !acc || n.position.x > acc.position.x ? n : acc,
      null
    );
    return {
      x: rightmost.position.x + NODE_WIDTH + GAP,
      y: rightmost.position.y + (Math.random() * 60 - 30),
    };
  }, [nodes, selectedNoteId, screenToFlowPosition]);

  // Add new story node
  const handleAddNode = useCallback(
    async (
      nodeType: string,
      title: string,
      emotion: string,
      metadata: any
    ) => {
      const position = computeSmartPosition();
      try {
        const { data: noteData } = await createNote({
          variables: {
            input: {
              title,
              positionX: position.x,
              positionY: position.y,
              mood: emotion || undefined,
            },
          },
        });
        if (noteData?.createNote) {
          await addNodeToStory({
            variables: {
              storyId,
              noteId: noteData.createNote.id,
              nodeType,
              metadata:
                Object.keys(metadata).length > 0
                  ? JSON.stringify(metadata)
                  : undefined,
            },
          });
          refetch();
          toast.success(`${title} ditambahkan`);
        }
      } catch (err) {
        console.error("Failed to create node:", err);
        toast.error("Gagal menambahkan scene");
        throw err;
      }
    },
    [computeSmartPosition, createNote, addNodeToStory, storyId, refetch]
  );

  // Delete node (and its edges)
  const handleDeleteNode = useCallback(
    async (nodeId: string) => {
      try {
        await deleteNote({ variables: { id: nodeId } });
        removeNodeFromFlow(nodeId);
        setSelectedNoteId(null);
        toast.success("Node dihapus");
        refetch();
      } catch (err) {
        console.error("Failed to delete node:", err);
        toast.error("Gagal menghapus node");
        throw err;
      }
    },
    [deleteNote, removeNodeFromFlow, setSelectedNoteId, refetch]
  );

  // Toggle story status (draft/published)
  const handleToggleStatus = useCallback(
    async (nextStatus: "DRAFT" | "PUBLISHED") => {
      try {
        await updateStory({
          variables: { input: { id: storyId, status: nextStatus } },
        });
        toast.success(
          nextStatus === "PUBLISHED"
            ? "Story dipublish!"
            : "Kembali ke draft"
        );
        refetch();
      } catch (err) {
        console.error("Failed to toggle status:", err);
        toast.error("Gagal mengubah status");
        throw err;
      }
    },
    [updateStory, storyId, refetch]
  );

  // Update scrapbook theme
  const handleScrapbookThemeChange = useCallback(
    async (nextJson: string) => {
      try {
        await updateStory({
          variables: { input: { id: storyId, scrapbookTheme: nextJson } },
        });
        refetch();
      } catch (err) {
        console.error("Failed to update theme:", err);
        toast.error("Gagal mengubah tema");
        throw err;
      }
    },
    [updateStory, storyId, refetch]
  );

  // Update story settings
  const handleUpdateStory = useCallback(
    async (input: any) => {
      try {
        await updateStory({ variables: { input: { id: storyId, ...input } } });
        refetch();
      } catch (err) {
        console.error("Failed to update story:", err);
        throw err;
      }
    },
    [updateStory, storyId, refetch]
  );

  // Delete entire story
  const handleDeleteStory = useCallback(async () => {
    // Note: actual delete mutation may differ; here we just route back
    router.push("/story");
  }, [router]);

  return {
    batchUpdateMutation: batchUpdateNotes,
    handleAddNode,
    handleDeleteNode,
    handleToggleStatus,
    handleScrapbookThemeChange,
    handleUpdateStory,
    handleDeleteStory,
  };
};
