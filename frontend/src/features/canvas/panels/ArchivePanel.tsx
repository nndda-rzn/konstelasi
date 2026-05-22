'use client';

import { useState } from 'react';
import { X, Archive, RotateCcw, Trash2, Loader2 } from 'lucide-react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_ARCHIVED_NOTES } from '@/graphql/queries';
import { UNARCHIVE_NOTE, DELETE_NOTE } from '@/graphql/mutations';
import { useCanvas } from '@/context/CanvasContext';
import { notify } from '@/lib/toast';

interface ArchivePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onRestoreSuccess?: (noteId: string) => void;
}

export default function ArchivePanel({ isOpen, onClose, onRestoreSuccess }: ArchivePanelProps) {
  const { selectedCanvasId } = useCanvas();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [restoringId, setRestoringId] = useState<string | null>(null);

  const { data, loading, refetch } = useQuery<any>(GET_ARCHIVED_NOTES, {
    variables: { canvasId: selectedCanvasId || undefined },
    fetchPolicy: 'cache-and-network',
    skip: !isOpen,
  });

  const [unarchiveNote] = useMutation<any>(UNARCHIVE_NOTE);
  const [deleteNote] = useMutation<any>(DELETE_NOTE);

  const handleRestore = async (noteId: string) => {
    setRestoringId(noteId);
    try {
      await unarchiveNote({ variables: { id: noteId } });
      notify.success('Catatan berhasil dipulihkan');
      refetch();
      onRestoreSuccess?.(noteId);
    } catch (err) {
      notify.error('Gagal memulihkan catatan');
    } finally {
      setRestoringId(null);
    }
  };

  const handlePermanentDelete = async (noteId: string) => {
    setDeletingId(noteId);
    try {
      await deleteNote({ variables: { id: noteId } });
      notify.success('Catatan dihapus permanen');
      refetch();
    } catch (err) {
      notify.error('Gagal menghapus catatan');
    } finally {
      setDeletingId(null);
    }
  };

  if (!isOpen) return null;

  const archivedNotes = data?.getArchivedNotes || [];

  return (
    <div className="absolute top-4 right-4 w-[360px] max-h-[80vh] bg-white/95 backdrop-blur-xl rounded-2xl border border-[#FFB4A2]/20 shadow-[0_20px_60px_rgba(0,0,0,0.1)] z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#FFB4A2]/10">
        <div className="flex items-center gap-2">
          <Archive className="w-4 h-4 text-[#FF8FA3]" />
          <h3 className="text-sm font-semibold text-[#4A2F3C]">Arsip</h3>
          <span className="text-xs text-[#5A3E4C]/50 bg-[#FFB4A2]/10 px-2 py-0.5 rounded-full">
            {archivedNotes.length}
          </span>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#FFB4A2]/10 transition-colors">
          <X className="w-4 h-4 text-[#5A3E4C]/60" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-[#FF8FA3]" />
          </div>
        ) : archivedNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Archive className="w-8 h-8 text-[#5A3E4C]/20 mb-3" />
            <p className="text-sm text-[#5A3E4C]/40">Tidak ada catatan yang diarsipkan</p>
          </div>
        ) : (
          archivedNotes.map((note: any) => (
            <div
              key={note.id}
              className="p-3 rounded-xl border border-[#FFB4A2]/10 bg-white/60 hover:bg-white/80 transition-all group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-[#4A2F3C] truncate">
                    {note.title || 'Untitled Note'}
                  </h4>
                  <p className="text-xs text-[#5A3E4C]/40 mt-0.5">
                    Diarsipkan {new Date(note.archivedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleRestore(note.id)}
                    disabled={restoringId === note.id}
                    className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-500 transition-colors"
                    title="Pulihkan"
                  >
                    {restoringId === note.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <RotateCcw className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={() => handlePermanentDelete(note.id)}
                    disabled={deletingId === note.id}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-colors"
                    title="Hapus Permanen"
                  >
                    {deletingId === note.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
