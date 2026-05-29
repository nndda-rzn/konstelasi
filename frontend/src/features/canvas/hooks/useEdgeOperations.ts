'use client';

import { useCallback } from 'react';
import { addEdge, Connection, Edge } from '@xyflow/react';
import { useMutation } from '@apollo/client/react';
import { toast } from 'sonner';
import {
  CREATE_NOTE_LINK,
  DELETE_NOTE_LINK,
  UPDATE_NOTE_LINK,
} from '@/graphql/mutations';
import { GET_NOTES } from '@/graphql/queries';

interface UseEdgeOperationsParams {
  /** Read-only access to the current Apollo nodes data (used to look up source color). */
  getSourceColor: (sourceId: string) => string | undefined;
  /** Edge state setter from useEdgesState. */
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
}

interface UseEdgeOperationsResult {
  onConnect: (params: Connection) => Promise<void>;
  onEdgesDelete: (edgesToDelete: Edge[]) => void;
  handleEdgeLabelChange: (edgeId: string, newLabel: string) => Promise<void>;
}

/**
 * Encapsulates all edge-related logic (create / delete / update label)
 * including optimistic UI and Apollo cache reconciliation.
 *
 * Extracted from DiaryCanvas to reduce component size and allow reuse.
 */
export function useEdgeOperations({
  getSourceColor,
  setEdges,
}: UseEdgeOperationsParams): UseEdgeOperationsResult {
  const [createNoteLink] = useMutation<any>(CREATE_NOTE_LINK);
  const [deleteNoteLink] = useMutation<any>(DELETE_NOTE_LINK);
  const [updateNoteLink] = useMutation<any>(UPDATE_NOTE_LINK);

  const handleEdgeLabelChange = useCallback(
    async (edgeId: string, newLabel: string) => {
      setEdges((eds) =>
        eds.map((e) =>
          e.id === edgeId ? { ...e, data: { ...e.data, label: newLabel } } : e
        )
      );

      try {
        await updateNoteLink({ variables: { input: { id: edgeId, label: newLabel } } });
      } catch (err) {
        console.error('Failed to update edge label', err);
        toast.error('Gagal mengupdate label koneksi');
      }
    },
    [setEdges, updateNoteLink]
  );

  const onConnect = useCallback(
    async (params: Connection) => {
      if (!params.source || !params.target) return;

      const tempId = `temp-${Date.now()}`;
      const newEdge: Edge = {
        ...(params as Connection & { source: string; target: string }),
        id: tempId,
        type: 'semanticEdge',
        data: {
          label: '',
          color: getSourceColor(params.source) || 'default',
          onLabelChange: handleEdgeLabelChange,
        },
        sourceHandle: params.sourceHandle,
        targetHandle: params.targetHandle,
      };

      setEdges((eds) => addEdge(newEdge, eds));

      try {
        const { data } = await createNoteLink({
          variables: {
            input: {
              sourceId: params.source,
              targetId: params.target,
              sourceHandle: params.sourceHandle,
              targetHandle: params.targetHandle,
            },
          },
          update(cache, { data: mutationData }) {
            const created = mutationData?.createNoteLink;
            if (!created) return;
            try {
              const existingData: any = cache.readQuery({ query: GET_NOTES });
              if (existingData && existingData.getNotes) {
                const newData = {
                  getNotes: existingData.getNotes.map((note: any) => {
                    if (note.id !== params.source) return note;
                    // Filter dupes (handles both resolved objects and Apollo __ref pointers)
                    const cleanedEdges = note.outgoingEdges.filter((e: any) => {
                      if (e.id && e.id === created.id) return false;
                      if (
                        e.__ref &&
                        typeof e.__ref === 'string' &&
                        e.__ref.includes(created.id)
                      ) {
                        return false;
                      }
                      return true;
                    });
                    return {
                      ...note,
                      outgoingEdges: [...cleanedEdges, created],
                    };
                  }),
                };
                cache.writeQuery({ query: GET_NOTES, data: newData });
              }
            } catch (e) {
              console.error('Cache update failed', e);
            }
          },
        });

        if (data?.createNoteLink) {
          setEdges((eds) => {
            const realId = data.createNoteLink.id;
            const edgeAlreadyExists = eds.some(
              (e) => e.id === realId && e.id !== tempId
            );
            if (edgeAlreadyExists) {
              // Edge existed: remove temp edge, refresh handles on the real one.
              return eds
                .filter((e) => e.id !== tempId)
                .map((e) =>
                  e.id === realId
                    ? {
                        ...e,
                        sourceHandle: params.sourceHandle,
                        targetHandle: params.targetHandle,
                      }
                    : e
                );
            }
            // Promote the temp edge: replace tempId with real DB id.
            return eds.map((e) => (e.id === tempId ? { ...e, id: realId } : e));
          });
        }
      } catch (err) {
        console.error('Failed to create link', err);
        toast.error('Gagal membuat koneksi');
        setEdges((eds) => eds.filter((e) => e.id !== tempId));
      }
    },
    [createNoteLink, setEdges, getSourceColor, handleEdgeLabelChange]
  );

  const onEdgesDelete = useCallback(
    (edgesToDelete: Edge[]) => {
      edgesToDelete.forEach((edge) => {
        if (edge.id.startsWith('temp-')) return;
        deleteNoteLink({ variables: { id: edge.id } }).catch((err) => {
          console.error(err);
          toast.error('Gagal menghapus koneksi');
        });
      });
    },
    [deleteNoteLink]
  );

  return { onConnect, onEdgesDelete, handleEdgeLabelChange };
}
