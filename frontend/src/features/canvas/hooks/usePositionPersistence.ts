'use client';

import { useCallback, useEffect, useRef } from 'react';
import type { NodeChange } from '@xyflow/react';
import { toast } from 'sonner';

interface NodeLayoutInput {
  id: string;
  positionX?: number;
  positionY?: number;
  width?: number;
  height?: number;
}

interface UsePositionPersistenceOptions {
  /** Mutation function that batch-updates node layout (position/size). */
  batchUpdate: (vars: { variables: { inputs: NodeLayoutInput[] } }) => Promise<unknown>;
  /** Debounce delay in ms (default 500) */
  debounceMs?: number;
  /** Optional toast message on failure (default: 'Gagal menyimpan perubahan posisi') */
  errorMessage?: string;
}

/**
 * Custom hook for persisting React Flow node position and size changes
 * with debouncing and batched updates.
 *
 * Used by both DiaryCanvas and StoryCanvas to avoid duplicate logic.
 */
export function usePositionPersistence({
  batchUpdate,
  debounceMs = 500,
  errorMessage = 'Gagal menyimpan perubahan posisi',
}: UsePositionPersistenceOptions) {
  const pendingChanges = useRef<Map<string, NodeLayoutInput>>(new Map());
  const flushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flush = useCallback(() => {
    const inputsArray = Array.from(pendingChanges.current.values());
    pendingChanges.current.clear();
    flushTimer.current = null;

    if (inputsArray.length === 0) return;

    batchUpdate({ variables: { inputs: inputsArray } }).catch((err) => {
      console.error('Failed to save node layout changes:', err);
      toast.error(errorMessage);
    });
  }, [batchUpdate, errorMessage]);

  const queueChanges = useCallback(
    (changes: NodeChange[]) => {
      changes.forEach((change: any) => {
        const isFinalPosition =
          change.type === 'position' && change.dragging === false && change.position;
        const isFinalDimensions =
          change.type === 'dimensions' && change.resizing === false && change.dimensions;

        if (!isFinalPosition && !isFinalDimensions) return;

        const pending = pendingChanges.current;
        const input: NodeLayoutInput = pending.get(change.id) ?? { id: change.id };

        if (isFinalPosition) {
          input.positionX = change.position.x;
          input.positionY = change.position.y;
        }

        if (isFinalDimensions) {
          input.width = change.dimensions.width;
          input.height = change.dimensions.height;
        }

        pending.set(change.id, input);
      });

      if (pendingChanges.current.size === 0) return;

      if (flushTimer.current) clearTimeout(flushTimer.current);
      flushTimer.current = setTimeout(flush, debounceMs);
    },
    [flush, debounceMs]
  );

  // Flush pending changes on unmount so user doesn't lose drag/resize work.
  useEffect(() => {
    return () => {
      if (flushTimer.current) clearTimeout(flushTimer.current);
      flush();
    };
  }, [flush]);

  return { queueChanges, flush };
}
