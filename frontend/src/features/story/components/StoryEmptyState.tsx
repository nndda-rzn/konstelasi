'use client';

import { BookOpen, Sparkles } from 'lucide-react';

interface Props {
  onCreate: () => void;
}

/**
 * Empty state for the story dashboard. Shown when the user has not
 * created any stories yet. Provides a clear primary action.
 */
export default function StoryEmptyState({ onCreate }: Props) {
  return (
    <div className="text-center py-20 px-6">
      <div className="relative inline-flex items-center justify-center mb-5">
        <div className="absolute inset-0 rounded-full bg-[#E63946]/15 blur-2xl animate-pulse" />
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E63946] to-[#FF6B7A] flex items-center justify-center shadow-lg shadow-[#E63946]/30">
          <BookOpen className="w-7 h-7 text-white" />
        </div>
      </div>

      <h3 className="text-lg font-semibold text-[#4A2F3C] dark:text-[#e2d9f3] mb-1.5">
        Ceritamu menunggu untuk ditulis
      </h3>
      <p className="text-sm text-[#5A3E4C]/60 dark:text-[#e2d9f3]/40 mb-6 max-w-md mx-auto leading-relaxed">
        Mulai dengan memilih jenis cerita - cinta, biografi, kenangan, atau format
        bebas. Tambahkan scene, koneksikan, dan biarkan kisahmu hidup.
      </p>

      <button
        type="button"
        onClick={onCreate}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E63946] to-[#FF6B7A] hover:from-[#d12936] hover:to-[#E63946] text-white font-medium text-sm shadow-lg shadow-[#E63946]/30 hover:shadow-[#E63946]/50 transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#E63946]/60 focus:ring-offset-2"
      >
        <Sparkles className="w-4 h-4" />
        Buat story pertama
      </button>
    </div>
  );
}
