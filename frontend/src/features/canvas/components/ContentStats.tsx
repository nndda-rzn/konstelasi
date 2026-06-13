'use client';

import { useMemo } from 'react';
import { Type, Clock } from 'lucide-react';
import { htmlToPlainText, countWords, countCharacters, estimateReadingTime, formatReadingTime } from '@/features/canvas/utils/textStats';

interface Props {
  content: string;
}

/**
 * Compact content statistics: word count, character count, and
 * estimated reading time. Hidden when content is empty.
 */
export default function ContentStats({ content }: Props) {
  const stats = useMemo(() => {
    const plain = htmlToPlainText(content);
    const words = countWords(plain);
    const chars = countCharacters(plain);
    const minutes = estimateReadingTime(words);
    return { words, chars, minutes };
  }, [content]);

  if (stats.words === 0) return null;

  return (
    <div className="flex items-center gap-2 text-[11px] text-[#9A8F95] tabular-nums">
      <span className="flex items-center gap-1">
        <Type className="w-3 h-3" />
        {stats.words}
      </span>
      <span className="text-[#9A8F95]/50">·</span>
      <span className="flex items-center gap-1">
        <Clock className="w-3 h-3" />
        {formatReadingTime(stats.minutes)}
      </span>
    </div>
  );
}
