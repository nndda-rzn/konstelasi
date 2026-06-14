'use client';

import { useEffect, useState } from 'react';
import { Check, Loader2, AlertCircle } from 'lucide-react';

interface Props {
  status: 'idle' | 'saving' | 'saved' | 'error';
  lastSavedAt: number | null;
}

/**
 * Live save status indicator. English copy, muted warm palette.
 */
export default function SaveIndicator({ status, lastSavedAt }: Props) {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    if (status !== 'saved') return;
    const interval = setInterval(() => forceUpdate((n) => n + 1), 10000);
    return () => clearInterval(interval);
  }, [status]);

  if (status === 'idle' && !lastSavedAt) {
    return (
      <p className="text-[11px] text-[#9A8F95] mt-2 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#9A8F95]/50" />
        Not saved yet
      </p>
    );
  }

  if (status === 'saving') {
    return (
      <p className="text-[11px] text-[#6F626A] mt-2 flex items-center gap-1.5">
        <Loader2 className="w-3 h-3 animate-spin" />
        Saving...
      </p>
    );
  }

  if (status === 'error') {
    return (
      <p className="text-[11px] text-[#B84A5A] mt-2 flex items-center gap-1.5">
        <AlertCircle className="w-3 h-3" />
        Save failed
      </p>
    );
  }

  const label = lastSavedAt ? formatRelative(lastSavedAt) : 'Saved';
  return (
    <p className="text-[11px] text-[#6F626A] mt-2 flex items-center gap-1.5">
      <Check className="w-3 h-3 text-[#B84A5A]/70" />
      Saved {label}
    </p>
  );
}

function formatRelative(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 5) return 'just now';
  if (diff < 60) return `${diff} seconds ago`;
  const min = Math.floor(diff / 60);
  if (min < 60) return `${min} minute${min > 1 ? 's' : ''} ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hour${hr > 1 ? 's' : ''} ago`;
  return new Date(ts).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
}
