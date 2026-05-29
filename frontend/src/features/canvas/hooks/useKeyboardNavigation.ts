'use client';

import { useCallback, useRef, useEffect } from 'react';
import type { Node } from '@xyflow/react';

type Dir = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight';

function closestInDirection(
  nodes: Node[],
  currentId: string | null,
  dir: Dir,
): Node | null {
  const current = nodes.find((n) => n.id === currentId);
  if (!current) return nodes.length > 0 ? nodes[0] : null;

  const cx = current.position.x;
  const cy = current.position.y;

  const candidates = nodes.filter((n) => {
    if (n.id === currentId) return false;
    const dx = n.position.x - cx;
    const dy = n.position.y - cy;
    switch (dir) {
      case 'ArrowRight': return dy > -80 && dy < 80 && dx > 0;
      case 'ArrowLeft':  return dy > -80 && dy < 80 && dx < 0;
      case 'ArrowDown':  return dx > -80 && dx < 80 && dy > 0;
      case 'ArrowUp':    return dx > -80 && dx < 80 && dy < 0;
    }
  });

  if (candidates.length === 0) return null;

  return candidates.reduce((best, n) => {
    const db = Math.abs(best.position.x - cx) + Math.abs(best.position.y - cy);
    const dn = Math.abs(n.position.x - cx) + Math.abs(n.position.y - cy);
    return dn < db ? n : best;
  });
}

export function useKeyboardNavigation(
  nodes: Node[],
  selectedNoteId: string | null,
  onNavigateRef: React.RefObject<(nodeId: string) => void>,
) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTyping = !!target && (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      );
      if (isTyping) return;

      const dirs: Dir[] = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
      if (!dirs.includes(e.key as Dir)) return;

      e.preventDefault();
      const next = closestInDirection(nodes, selectedNoteId, e.key as Dir);
      if (next) onNavigateRef.current?.(next.id);
    },
    [nodes, selectedNoteId, onNavigateRef],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
