'use client';

import { useState, useCallback, useRef } from 'react';
import type { Node, Edge } from '@xyflow/react';

interface Snapshot {
  nodes: Node[];
  edges: Edge[];
}

const MAX_HISTORY = 50;

/**
 * Clone a node preserving data callbacks (which can't be cloned).
 * Position/measured are deep-copied since they mutate during drag,
 * but data reference is kept intact so onDoubleClick survives.
 */
function cloneNode(n: Node): Node {
  return {
    ...n,
    position: { ...n.position },
    measured: n.measured ? { ...n.measured } : undefined,
    data: n.data, // Keep reference - functions inside are not mutated
  };
}

function cloneEdge(e: Edge): Edge {
  return {
    ...e,
    data: e.data, // Keep reference for callbacks
  };
}

export function useCanvasHistory() {
  const [past, setPast] = useState<Snapshot[]>([]);
  const [future, setFuture] = useState<Snapshot[]>([]);
  const latestRef = useRef<Snapshot | null>(null);

  const pushSnapshot = useCallback((nodes: Node[], edges: Edge[]) => {
    const snapshot: Snapshot = {
      nodes: nodes.map(cloneNode),
      edges: edges.map(cloneEdge),
    };
    latestRef.current = snapshot;

    setPast((prev) => {
      const next = [...prev, snapshot];
      return next.length > MAX_HISTORY ? next.slice(-MAX_HISTORY) : next;
    });
    setFuture([]);
  }, []);

  const undo = useCallback((): Snapshot | null => {
    let result: Snapshot | null = null;
    setPast((prev) => {
      if (prev.length === 0) return prev;
      const current = latestRef.current;
      const newPast = prev.slice(0, -1);
      const snapshot = prev[prev.length - 1];
      result = snapshot;

      if (current) {
        setFuture((f) => [...f, current]);
      }
      latestRef.current = snapshot;
      return newPast;
    });
    return result;
  }, []);

  const redo = useCallback((): Snapshot | null => {
    let result: Snapshot | null = null;
    setFuture((prev) => {
      if (prev.length === 0) return prev;
      const current = latestRef.current;
      const snapshot = prev[prev.length - 1];
      const newFuture = prev.slice(0, -1);
      result = snapshot;

      if (current) {
        setPast((p) => {
          const next = [...p, current];
          return next.length > MAX_HISTORY ? next.slice(-MAX_HISTORY) : next;
        });
      }
      latestRef.current = snapshot;
      return newFuture;
    });
    return result;
  }, []);

  return {
    pushSnapshot,
    undo,
    redo,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    historyCount: past.length,
  };
}
