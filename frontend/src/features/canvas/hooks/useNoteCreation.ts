'use client';

import { useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import { useMutation } from '@apollo/client/react';
import { toast } from 'sonner';
import { CREATE_NOTE } from '@/graphql/mutations';
import { GET_NOTES } from '@/graphql/queries';

interface UseNoteCreationResult {
  /** Create a note at exact React Flow coords (already converted from screen). */
  createNoteAtPosition: (x: number, y: number) => Promise<void>;
  /** Create a note from a screen-coords mouse event (e.g. context menu). */
  createNoteFromEvent: (e: React.MouseEvent) => Promise<void>;
  /** Create a note centered in the current viewport (e.g. for FAB or 'N' shortcut). */
  createNoteAtCenter: () => Promise<void>;
}

/**
 * Encapsulates all "create new note" entry points (context menu, FAB, keyboard
 * shortcut) with consistent optimistic UI behavior.
 *
 * Extracted from DiaryCanvas to keep the component focused on rendering.
 */
export function useNoteCreation(): UseNoteCreationResult {
  const { screenToFlowPosition } = useReactFlow();
  const [createNote] = useMutation<any>(CREATE_NOTE);

  const createNoteAtPosition = useCallback(
    async (x: number, y: number) => {
      const tempId = `temp-${Date.now()}`;
      const optimisticNote = {
        __typename: 'Note',
        id: tempId,
        title: 'New Note',
        content: '',
        positionX: x,
        positionY: y,
        width: null,
        height: null,
        color: 'default',
        mood: '',
        titleFont: null,
        type: 'default',
        images: [],
        outgoingEdges: [],
        incomingEdges: [],
        tags: [],
        createdAt: new Date().toISOString(),
        // Fields below are populated to satisfy other queries (GET_STORY, etc.)
        // that share Note entries in Apollo's normalized cache.
        isArchived: false,
        isLocked: false,
        unlockDate: null,
        isTimeLocked: false,
        storyNodeType: null,
        storyMetadata: null,
        eventDate: null,
        eventLocation: null,
        canvas: null,
      };

      try {
        await createNote({
          variables: {
            input: { title: 'New Note', positionX: x, positionY: y },
          },
          optimisticResponse: { createNote: optimisticNote },
          update(cache, { data: mutationData }) {
            const created = mutationData?.createNote;
            if (!created) return;
            try {
              const existingData: any = cache.readQuery({ query: GET_NOTES });
              if (!existingData?.getNotes) return;
              const filtered = existingData.getNotes.filter(
                (n: any) => n.id !== created.id && n.id !== tempId
              );
              cache.writeQuery({
                query: GET_NOTES,
                data: {
                  getNotes: [
                    ...filtered,
                    {
                      ...created,
                      content: created.content ?? '',
                      images: created.images ?? [],
                      outgoingEdges: created.outgoingEdges ?? [],
                      incomingEdges: created.incomingEdges ?? [],
                      tags: created.tags ?? [],
                      createdAt: created.createdAt ?? new Date().toISOString(),
                    },
                  ],
                },
              });
            } catch (e) {
              console.error('Cache update failed', e);
            }
          },
        });
      } catch (err) {
        console.error('Failed to create node', err);
        toast.error('Gagal membuat note baru');
      }
    },
    [createNote]
  );

  const createNoteFromEvent = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      await createNoteAtPosition(position.x, position.y);
    },
    [screenToFlowPosition, createNoteAtPosition]
  );

  const createNoteAtCenter = useCallback(async () => {
    const position = screenToFlowPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });
    await createNoteAtPosition(position.x, position.y);
  }, [screenToFlowPosition, createNoteAtPosition]);

  return { createNoteAtPosition, createNoteFromEvent, createNoteAtCenter };
}
