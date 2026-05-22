'use client';

import { useCallback } from 'react';
import { useMutation } from '@apollo/client/react';
import { BATCH_UPDATE_NOTES } from '@/graphql/mutations';

interface NodeWithEdges {
  id: string;
  positionX?: number;
  positionY?: number;
  outgoingEdges?: Array<{ source?: { id: string }; target?: { id: string } }>;
  incomingEdges?: Array<{ source?: { id: string }; target?: { id: string } }>;
}

interface LayoutPosition {
  id: string;
  positionX: number;
  positionY: number;
}

const X_GAP = 380;
const Y_GAP = 260;
const ORIGIN_X = 100;
const ORIGIN_Y = 100;

/**
 * Calculate hierarchical layout positions using BFS from root nodes.
 * Nodes with no incoming edges are roots; level-by-level distribution.
 * Disconnected nodes are placed in a fallback grid below.
 */
export function calculateAutoLayout(nodes: NodeWithEdges[]): LayoutPosition[] {
  if (nodes.length === 0) return [];

  // Build adjacency: outgoing edges per node id
  const outgoing = new Map<string, string[]>();
  const incomingCount = new Map<string, number>();

  nodes.forEach(n => {
    outgoing.set(n.id, []);
    incomingCount.set(n.id, 0);
  });

  nodes.forEach(n => {
    (n.outgoingEdges || []).forEach(edge => {
      const targetId = edge.target?.id;
      if (targetId && outgoing.has(targetId)) {
        outgoing.get(n.id)!.push(targetId);
        incomingCount.set(targetId, (incomingCount.get(targetId) || 0) + 1);
      }
    });
  });

  // Find roots (no incoming) – sort by id for deterministic order
  const roots = nodes
    .filter(n => (incomingCount.get(n.id) || 0) === 0)
    .map(n => n.id)
    .sort();

  // BFS to assign levels
  const level = new Map<string, number>();
  const visited = new Set<string>();
  const queue: Array<{ id: string; lvl: number }> = roots.map(id => ({ id, lvl: 0 }));

  while (queue.length > 0) {
    const { id, lvl } = queue.shift()!;
    if (visited.has(id)) continue;
    visited.add(id);
    level.set(id, lvl);
    (outgoing.get(id) || []).forEach(childId => {
      if (!visited.has(childId)) {
        queue.push({ id: childId, lvl: lvl + 1 });
      }
    });
  }

  // Disconnected nodes: assign them to a "leftover" bucket
  const disconnected: string[] = [];
  nodes.forEach(n => {
    if (!visited.has(n.id)) disconnected.push(n.id);
  });

  // Group nodes by level
  const byLevel = new Map<number, string[]>();
  level.forEach((lvl, id) => {
    if (!byLevel.has(lvl)) byLevel.set(lvl, []);
    byLevel.get(lvl)!.push(id);
  });

  const sortedLevels = Array.from(byLevel.keys()).sort((a, b) => a - b);
  const positions: LayoutPosition[] = [];

  sortedLevels.forEach(lvl => {
    const ids = byLevel.get(lvl)!.sort();
    const totalWidth = (ids.length - 1) * X_GAP;
    const startX = ORIGIN_X + Math.max(0, (1200 - totalWidth) / 2);
    ids.forEach((id, index) => {
      positions.push({
        id,
        positionX: startX + index * X_GAP,
        positionY: ORIGIN_Y + lvl * Y_GAP,
      });
    });
  });

  // Disconnected fallback grid (below everything)
  const maxLevel = sortedLevels.length > 0 ? Math.max(...sortedLevels) : -1;
  const cols = Math.max(1, Math.ceil(Math.sqrt(disconnected.length)));
  disconnected.sort().forEach((id, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    positions.push({
      id,
      positionX: ORIGIN_X + col * X_GAP,
      positionY: ORIGIN_Y + (maxLevel + 2 + row) * Y_GAP,
    });
  });

  return positions;
}

interface UseAutoLayoutOptions {
  nodes: NodeWithEdges[];
  onApplied?: (positions: LayoutPosition[]) => void;
}

export function useAutoLayout({ nodes, onApplied }: UseAutoLayoutOptions) {
  const [batchUpdateNotes] = useMutation<any>(BATCH_UPDATE_NOTES);

  const applyAutoLayout = useCallback(async () => {
    const positions = calculateAutoLayout(nodes);
    if (positions.length === 0) return [];

    try {
      await batchUpdateNotes({
        variables: {
          inputs: positions.map(p => ({
            id: p.id,
            positionX: p.positionX,
            positionY: p.positionY,
          })),
        },
      });
      onApplied?.(positions);
    } catch (err) {
      console.error('Auto-layout failed:', err);
    }

    return positions;
  }, [nodes, batchUpdateNotes, onApplied]);

  return { applyAutoLayout };
}
