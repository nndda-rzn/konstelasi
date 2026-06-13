'use client';

import { Clock } from 'lucide-react';

interface Props {
  createdAt?: string | null;
  updatedAt?: string | null;
}

export default function NoteTimestamps({ createdAt, updatedAt }: Props) {
  if (!createdAt) return null;

  const created = formatRelative(createdAt);
  const updated = updatedAt && updatedAt !== createdAt ? formatRelative(updatedAt) : null;

  return (
    <div className="flex items-center gap-3 mt-2 px-1 text-[11px] text-[#9A8F95]">
      <span
        className="flex items-center gap-1"
        title={`Created: ${formatAbsolute(createdAt)}`}
      >
        <Clock className="w-3 h-3" />
        {created}
      </span>
      {updated && (
        <>
          <span className="text-[#9A8F95]/50">·</span>
          <span title={`Updated: ${formatAbsolute(updatedAt!)}`}>
            Edited {updated}
          </span>
        </>
      )}
    </div>
  );
}

function formatRelative(iso: string): string {
  const ts = new Date(iso).getTime();
  if (isNaN(ts)) return '';
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return 'just now';
  const min = Math.floor(diff / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const days = Math.floor(hr / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: days > 365 ? 'numeric' : undefined,
  });
}

function formatAbsolute(iso: string): string {
  const ts = new Date(iso).getTime();
  if (isNaN(ts)) return '';
  return new Date(ts).toLocaleString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
