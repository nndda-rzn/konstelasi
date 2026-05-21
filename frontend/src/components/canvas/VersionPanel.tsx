'use client';

import { useState } from 'react';
import { X, History, RotateCcw, Loader2 } from 'lucide-react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_NOTE_VERSIONS } from '@/graphql/queries';
import { RESTORE_NOTE_VERSION } from '@/graphql/mutations';
import { notify } from '@/lib/toast';

interface VersionPanelProps {
  noteId: string;
  isOpen: boolean;
  onClose: () => void;
  onRestore?: () => void;
}

export default function VersionPanel({ noteId, isOpen, onClose, onRestore }: VersionPanelProps) {
  const [restoringId, setRestoringId] = useState<string | null>(null);

  const { data, loading } = useQuery<any>(GET_NOTE_VERSIONS, {
    variables: { noteId },
    fetchPolicy: 'cache-and-network',
    skip: !isOpen,
  });

  const [restoreVersion] = useMutation<any>(RESTORE_NOTE_VERSION);

  const handleRestore = async (versionId: string) => {
    setRestoringId(versionId);
    try {
      await restoreVersion({ variables: { versionId } });
      notify.success('Versi berhasil dipulihkan');
      onRestore?.();
    } catch (err) {
      notify.error('Gagal memulihkan versi');
    } finally {
      setRestoringId(null);
    }
  };

  if (!isOpen) return null;

  const versions = data?.getNoteVersions || [];

  return (
    <div className="mt-4 border border-[#FFB4A2]/15 dark:border-[#FF8FA3]/10 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-[#FFF5F0]/50 dark:bg-[#2a2438]/50 border-b border-[#FFB4A2]/10 dark:border-[#FF8FA3]/10">
        <div className="flex items-center gap-2">
          <History className="w-3.5 h-3.5 text-[#FF8FA3]" />
          <span className="text-xs font-semibold text-[#4A2F3C] dark:text-[#e2d9f3]">Riwayat Versi</span>
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-[#FFB4A2]/10 transition-colors">
          <X className="w-3.5 h-3.5 text-[#5A3E4C]/50 dark:text-[#e2d9f3]/50" />
        </button>
      </div>

      <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="w-4 h-4 animate-spin text-[#FF8FA3]" />
          </div>
        ) : versions.length === 0 ? (
          <div className="py-6 text-center">
            <p className="text-xs text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30">Belum ada riwayat versi</p>
          </div>
        ) : (
          <div className="divide-y divide-[#FFB4A2]/10 dark:divide-[#FF8FA3]/5">
            {versions.map((v: any) => (
              <div key={v.id} className="flex items-center justify-between px-4 py-2.5 hover:bg-[#FFB4A2]/5 dark:hover:bg-[#FF8FA3]/5 transition-all group">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[#4A2F3C] dark:text-[#e2d9f3] truncate">
                    v{v.version} — {v.title || 'Untitled'}
                  </p>
                  <p className="text-[10px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30">
                    {new Date(v.createdAt).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <button
                  onClick={() => handleRestore(v.id)}
                  disabled={restoringId === v.id}
                  className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-emerald-500 transition-all"
                  title="Pulihkan versi ini"
                >
                  {restoringId === v.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <RotateCcw className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
