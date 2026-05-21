'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { X, Save, RotateCcw, Trash2, GitBranch, FileText, Clock } from 'lucide-react';
import { GET_STORY_VERSIONS } from '../../graphql/queries';
import { CREATE_STORY_VERSION, RESTORE_STORY_VERSION, DELETE_STORY_VERSION } from '../../graphql/mutations';

interface VersionHistoryPanelProps {
  storyId: string;
  isOpen: boolean;
  onClose: () => void;
  onRestore: () => void;
}

export default function VersionHistoryPanel({ storyId, isOpen, onClose, onRestore }: VersionHistoryPanelProps) {
  const [label, setLabel] = useState('');
  const [notes, setNotes] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  const { data, loading, refetch } = useQuery<any>(GET_STORY_VERSIONS, {
    variables: { storyId },
    skip: !isOpen,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  });

  const [createVersion, { loading: creating }] = useMutation(CREATE_STORY_VERSION);
  const [restoreVersion] = useMutation(RESTORE_STORY_VERSION);
  const [deleteVersion] = useMutation(DELETE_STORY_VERSION);

  if (!isOpen) return null;

  const versions = data?.getStoryVersions || [];

  const handleCreate = async () => {
    await createVersion({ variables: { storyId, label: label || undefined, notes: notes || undefined } });
    setLabel('');
    setNotes('');
    setShowCreate(false);
    refetch();
  };

  const handleRestore = async (versionId: string) => {
    if (!confirm('Restore ke versi ini? Perubahan saat ini akan ditimpa.')) return;
    await restoreVersion({ variables: { versionId } });
    onRestore();
  };

  const handleDelete = async (versionId: string) => {
    if (!confirm('Hapus versi ini?')) return;
    await deleteVersion({ variables: { versionId } });
    refetch();
  };

  const formatDate = (d: string) => {
    return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="absolute top-0 right-0 h-full w-[340px] bg-white/95 dark:bg-[#2a2438]/95 backdrop-blur-xl border-l border-[#FFB4A2]/15 dark:border-[#FF8FA3]/10 shadow-2xl z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#FFB4A2]/10 dark:border-[#FF8FA3]/10">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-[#38D9A9]" />
          <h3 className="text-sm font-semibold text-[#4A2F3C] dark:text-[#e2d9f3]">Version History</h3>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#FFB4A2]/10 transition-colors">
          <X className="w-4 h-4 text-[#5A3E4C]/60 dark:text-[#e2d9f3]/60" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
        {/* Create Version Button */}
        {!showCreate ? (
          <button
            onClick={() => setShowCreate(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#38D9A9]/10 hover:bg-[#38D9A9]/20 text-[#38D9A9] font-medium text-xs transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            Save Version
          </button>
        ) : (
          <div className="p-3 rounded-xl border border-[#38D9A9]/20 bg-[#38D9A9]/5 space-y-2">
            <input
              type="text"
              placeholder="Label (opsional)"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-white/80 dark:bg-white/5 border border-[#FFB4A2]/15 text-xs text-[#4A2F3C] dark:text-[#e2d9f3] placeholder:text-[#5A3E4C]/30"
            />
            <textarea
              placeholder="Catatan (opsional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full px-3 py-1.5 rounded-lg bg-white/80 dark:bg-white/5 border border-[#FFB4A2]/15 text-xs text-[#4A2F3C] dark:text-[#e2d9f3] placeholder:text-[#5A3E4C]/30 resize-none"
            />
            <div className="flex gap-2">
              <button onClick={handleCreate} disabled={creating} className="flex-1 px-3 py-1.5 rounded-lg bg-[#38D9A9] text-white text-xs font-medium hover:bg-[#38D9A9]/90 transition-colors disabled:opacity-50">
                {creating ? 'Saving...' : 'Save'}
              </button>
              <button onClick={() => setShowCreate(false)} className="px-3 py-1.5 rounded-lg bg-[#5A3E4C]/10 text-[#5A3E4C]/60 text-xs hover:bg-[#5A3E4C]/20 transition-colors">
                Batal
              </button>
            </div>
          </div>
        )}

        {/* Version List */}
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="w-5 h-5 border-2 border-[#38D9A9] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : versions.length === 0 ? (
          <div className="text-center py-10">
            <GitBranch className="w-8 h-8 text-[#5A3E4C]/20 dark:text-[#e2d9f3]/20 mx-auto mb-2" />
            <p className="text-xs text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30">Belum ada version tersimpan</p>
            <p className="text-[10px] text-[#5A3E4C]/30 dark:text-[#e2d9f3]/20 mt-1">Klik "Save Version" untuk menyimpan snapshot</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {versions.map((v: any) => (
              <div key={v.id} className="p-3 rounded-xl border border-[#FFB4A2]/10 dark:border-[#FF8FA3]/5 bg-white/50 dark:bg-white/5 hover:border-[#38D9A9]/30 transition-colors group">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-[#4A2F3C] dark:text-[#e2d9f3]">{v.label || `Version ${v.version}`}</span>
                  <span className="text-[9px] text-[#5A3E4C]/30 dark:text-[#e2d9f3]/20">v{v.version}</span>
                </div>
                {v.notes && <p className="text-[10px] text-[#5A3E4C]/50 dark:text-[#e2d9f3]/40 mb-1.5">{v.notes}</p>}
                <div className="flex items-center gap-3 text-[9px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30">
                  <span className="flex items-center gap-0.5"><FileText className="w-2.5 h-2.5" /> {v.nodeCount} nodes</span>
                  <span>{v.wordCount.toLocaleString()} kata</span>
                  <span className="flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" /> {formatDate(v.createdAt)}</span>
                </div>
                <div className="flex gap-1.5 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleRestore(v.id)} className="flex items-center gap-1 px-2 py-1 rounded-md bg-[#38D9A9]/10 text-[#38D9A9] text-[9px] font-medium hover:bg-[#38D9A9]/20 transition-colors">
                    <RotateCcw className="w-2.5 h-2.5" /> Restore
                  </button>
                  <button onClick={() => handleDelete(v.id)} className="flex items-center gap-1 px-2 py-1 rounded-md bg-[#F03E3E]/10 text-[#F03E3E] text-[9px] font-medium hover:bg-[#F03E3E]/20 transition-colors">
                    <Trash2 className="w-2.5 h-2.5" /> Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
