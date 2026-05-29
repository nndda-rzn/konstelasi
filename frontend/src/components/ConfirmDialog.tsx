'use client';

import { useEffect, useRef } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'default';
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Lightweight modal confirmation dialog for destructive actions.
 * Focus is auto-trapped on the cancel button (safer default).
 * Pressing Escape cancels; pressing Enter confirms.
 */
export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Konfirmasi',
  cancelLabel = 'Batal',
  variant = 'default',
  onConfirm,
  onCancel,
}: Props) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        onConfirm();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onCancel, onConfirm]);

  if (!open) return null;

  const isDanger = variant === 'danger';

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-desc"
    >
      <div className="w-[420px] max-w-[90vw] bg-white dark:bg-[#2a2438] rounded-2xl shadow-2xl border border-[#FFB8C0]/20 overflow-hidden">
        <div className="p-6">
          <div className="flex items-start gap-3 mb-3">
            <div
              className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                isDanger ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1 pt-1">
              <h3
                id="confirm-title"
                className="text-base font-semibold text-[#4A2F3C] dark:text-[#e2d9f3]"
              >
                {title}
              </h3>
            </div>
          </div>
          <p
            id="confirm-desc"
            className="text-sm text-[#5A3E4C]/70 dark:text-[#e2d9f3]/60 leading-relaxed pl-[52px]"
          >
            {description}
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-[#FFB8C0]/10">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm text-[#5A3E4C]/70 dark:text-[#e2d9f3]/60 hover:text-[#4A2F3C] rounded-lg hover:bg-[#FFB8C0]/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF8FA3]/40"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isDanger
                ? 'bg-red-500 hover:bg-red-600 shadow-red-300/40 focus:ring-red-400'
                : 'bg-gradient-to-r from-[#FF8FA3] to-[#FFB4A2] hover:from-[#FF7A8A] hover:to-[#FF8FA3] shadow-pink-300/40 focus:ring-[#FF8FA3]'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
