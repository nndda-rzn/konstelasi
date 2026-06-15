"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client/react";
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
import { computeSmartPosition } from "../utils/smart-position";
import { withMutationToast } from "../utils/mutation-handler";

interface UseStoryActionsParams {
  storyId: string;
  refetch: () => void;
  screenToFlowPosition: (clientPos: { x: number; y: number }) => { x: number; y: number };
  nodes: any[];
  removeNodeFromFlow: (nodeId: string) => void;
}

export const useStoryActions = ({
  storyId,
  refetch,
  screenToFlowPosition,
  nodes,
  removeNodeFromFlow,
}: UseStoryActionsParams) => {
  const router = useRouter();
  const setSelectedNoteId = useStoryStore((s) => s.setSelectedNoteId);
  const selectedNoteId = useStoryStore((s) => s.selectedNoteId);

  const [createNote] = useMutation<{ createNote: { id: string } }>(CREATE_NOTE);
  const [batchUpdateNotes] = useMutation(BATCH_UPDATE_NOTES);
  const [deleteNote] = useMutation(DELETE_NOTE);
  const [updateStory] = useMutation(UPDATE_STORY);
  const [addNodeToStory] = useMutation(ADD_NODE_TO_STORY);

  const handleAddNode = useCallback(
    async (nodeType: string, title: string, emotion: string, metadata: Record<string, unknown>) => {
      const position = computeSmartPosition(nodes, selectedNoteId, screenToFlowPosition);
      return withMutationToast(
        "create node",
        `${title} ditambahkan`,
        "Gagal menambahkan scene",
        async () => {
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
                  Object.keys(metadata).length > 0 ? JSON.stringify(metadata) : undefined,
              },
            });
            refetch();
          }
        }
      );
    },
    [nodes, selectedNoteId, screenToFlowPosition, createNote, addNodeToStory, storyId, refetch]
  );

  const handleDeleteNode = useCallback(
    (nodeId: string) =>
      withMutationToast(
        "delete node",
        "Node dihapus",
        "Gagal menghapus node",
        async () => {
          await deleteNote({ variables: { id: nodeId } });
          removeNodeFromFlow(nodeId);
          setSelectedNoteId(null);
          refetch();
        }
      ),
    [deleteNote, removeNodeFromFlow, setSelectedNoteId, refetch]
  );

  const handleToggleStatus = useCallback(
    (nextStatus: "DRAFT" | "PUBLISHED") =>
      withMutationToast(
        "toggle status",
        nextStatus === "PUBLISHED" ? "Story dipublish!" : "Kembali ke draft",
        "Gagal mengubah status",
        async () => {
          await updateStory({ variables: { input: { id: storyId, status: nextStatus } } });
          refetch();
        }
      ),
    [updateStory, storyId, refetch]
  );

  const handleScrapbookThemeChange = useCallback(
    (nextJson: string) =>
      withMutationToast(
        "update theme",
        "",
        "Gagal mengubah tema",
        async () => {
          await updateStory({ variables: { input: { id: storyId, scrapbookTheme: nextJson } } });
          refetch();
        }
      ),
    [updateStory, storyId, refetch]
  );

  const handleUpdateStory = useCallback(
    (input: Record<string, unknown>) =>
      withMutationToast(
        "update story",
        "",
        "",
        async () => {
          await updateStory({ variables: { input: { id: storyId, ...input } } });
          refetch();
        }
      ),
    [updateStory, storyId, refetch]
  );

  const handleDeleteStory = useCallback(() => {
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
