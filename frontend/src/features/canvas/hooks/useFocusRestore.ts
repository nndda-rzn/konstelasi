'use client';

import { useRef, useCallback } from 'react';

/**
 * Saves the current active element before opening a panel/modal
 * and restores focus to it when closing. Ensures keyboard users
 * don't get "lost" after dismissing overlays.
 */
export function useFocusRestore() {
  const savedRef = useRef<HTMLElement | null>(null);

  const saveFocus = useCallback(() => {
    savedRef.current = document.activeElement as HTMLElement | null;
  }, []);

  const restoreFocus = useCallback(() => {
    savedRef.current?.focus({ preventScroll: true });
    savedRef.current = null;
  }, []);

  return { saveFocus, restoreFocus };
}
