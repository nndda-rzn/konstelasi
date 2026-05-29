'use client';

import { Clock } from 'lucide-react';

interface Props {
  createdAt?: string | null;
  updatedAt?: string | null;
}

/**
 * Compact created/updated timestamp display below the title input.
 * Shows relative time, with absolute date as title tooltip.
 */
export default function NoteTimestamps({ createdAt, updatedAt }: Props) {
  if (!createdAt) return null;

  const created = formatRelative(createdAt);
  const updated = updatedAt && updatedAt !== createdAt ? formatRelative(updatedAt) : null;

  return (
    <div className="flex items-center gap-3 mt-2 px-1 text-[11px] text-[#5A3E4C]/40">
      <span
        className="flex items-center gap-1"
        title={`Dibuat: ${formatAbsolute(createdAt)}`}
      >
        <Clock className="w-3 h-3" />
        Dibuat {created}
      </span>
      {updated && (
        <>
          <span className="text-[#5A3E4C]/20">·</span>
          <span title={`Diperbarui: ${formatAbsolute(updatedAt!)}`}>
            Diperbarui {updated}
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
  if (diff < 60) return 'baru saja';
  const min = Math.floor(diff / 60);
  if (min < 60) return `${min} menit lalu`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} jam lalu`;
  const days = Math.floor(hr / 24);
  if (days < 7) return `${days} hari lalu`;
  return new Date(ts).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: days > 365 ? 'numeric' : undefined,
  });
}

function formatAbsolute(iso: string): string {
  const ts = new Date(iso).getTime();
  if (isNaN(ts)) return '';
  return new Date(ts).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
