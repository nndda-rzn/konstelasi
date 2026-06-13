"use client";

import { useState, useMemo } from "react";
import { useBookmarks } from "./useBookmarks";

/**
 * useReadingNavigation - Manages current index + edge-aware navigation.
 * - Sorts nodes chronologically (eventDate || createdAt)
 * - Follows outgoing edges first, falls back to array order
 */
export const useReadingNavigation = (
  nodes: any[],
  storyId: string | undefined
) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const sortedNodes = useMemo(() => {
    return [...nodes].sort((a, b) => {
      const aTime = new Date(a.eventDate || a.createdAt).getTime();
      const bTime = new Date(b.eventDate || b.createdAt).getTime();
      return aTime - bTime;
    });
  }, [nodes]);

  const currentNode = sortedNodes[currentIndex];

  const findIndexById = (id: string) =>
    sortedNodes.findIndex((n: any) => n.id === id);

  const goNext = () => {
    const outgoing = currentNode?.outgoingEdges || [];
    if (outgoing.length > 0) {
      const targetId = outgoing[0]?.target?.id;
      const idx = targetId ? findIndexById(targetId) : -1;
      if (idx >= 0) {
        setCurrentIndex(idx);
        return;
      }
    }
    setCurrentIndex(Math.min(currentIndex + 1, sortedNodes.length - 1));
  };

  const goPrev = () => {
    const incoming = currentNode?.incomingEdges || [];
    if (incoming.length > 0) {
      const sourceId = incoming[0]?.source?.id;
      const idx = sourceId ? findIndexById(sourceId) : -1;
      if (idx >= 0) {
        setCurrentIndex(idx);
        return;
      }
    }
    setCurrentIndex(Math.max(currentIndex - 1, 0));
  };

  const goTo = (index: number) => {
    setCurrentIndex(index);
  };

  const bookmarks = useBookmarks({ storyId });

  return {
    sortedNodes,
    currentNode,
    currentIndex,
    goNext,
    goPrev,
    goTo,
    ...bookmarks,
  };
};
