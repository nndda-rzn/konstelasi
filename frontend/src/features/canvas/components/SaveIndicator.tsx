'use client';

import { useEffect, useState } from 'react';
import { Check, Loader2, AlertCircle } from 'lucide-react';

interface Props {
  status: 'idle' | 'saving' | 'saved' | 'error';
  lastSavedAt: number | null;
}

/**
 * Live save status indicator. Shows saving spinner, success check,
 * or error icon. After save, displays relative time ("2 detik lalu")
 * that auto-updates every 10 seconds.
 */
export default function SaveIndicator({ status, lastSavedAt }: Props) {
  const [, forceUpdate] = useState(0);

  // Periodically refresh to update relative timestamp.
  useEffect(() => {
    if (status !== 'saved') return;
    const interval = setInterval(() => forceUpdate((n) => n + 1), 10000);
    return () => clearInterval(interval);
  }, [status]);

  if (status === 'idle' && !lastSavedAt) {
    return (
      <p className="text-[11px] text-[#5A3E4C]/30 mt-2 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#5A3E4C]/20" />
        Belum disimpan
      </p>
    );
  }

  if (status === 'saving') {
    return (
      <p className="text-[11px] text-[#FF8FA3]/70 mt-2 flex items-center gap-1.5">
        <Loader2 className="w-3 h-3 animate-spin" />
        Menyimpan...
      </p>
    );
  }

  if (status === 'error') {
    return (
      <p className="text-[11px] text-red-500/80 mt-2 flex items-center gap-1.5">
        <AlertCircle className="w-3 h-3" />
        Gagal menyimpan
      </p>
    );
  }

  // saved (or idle with lastSavedAt set)
  const label = lastSavedAt ? formatRelative(lastSavedAt) : 'Tersimpan';
  return (
    <p className="text-[11px] text-emerald-600/70 mt-2 flex items-center gap-1.5">
      <Check className="w-3 h-3" />
      Disimpan {label}
    </p>
  );
}

function formatRelative(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 5) return 'baru saja';
  if (diff < 60) return `${diff} detik lalu`;
  const min = Math.floor(diff / 60);
  if (min < 60) return `${min} menit lalu`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} jam lalu`;
  return new Date(ts).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}
