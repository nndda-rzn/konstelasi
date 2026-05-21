'use client';

import { CanvasProvider } from '@/context/CanvasContext';
import { TagProvider } from '@/context/TagContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CanvasProvider>
      <TagProvider>
        {children}
      </TagProvider>
    </CanvasProvider>
  );
}
