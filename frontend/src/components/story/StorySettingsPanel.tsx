'use client';

import { useState } from 'react';
import { X, Lock, Globe, Users, Trash2, Save, AlertTriangle } from 'lucide-react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_STORY_ACCESS, GRANT_STORY_ACCESS, REVOKE_STORY_ACCESS, DELETE_STORY } from '@/graphql/story';
import { notify } from '@/lib/toast';

interface StorySettingsPanelProps {
  story: any;
  onClose: () => void;
  onUpdate: (input: any) => Promise<void>;
  onDelete?: () => void;
}

const PRIVACY_OPTIONS = [
  { value: 'PRIVATE', label: 'Private', icon: Lock, desc: 'Hanya Anda' },
  { value: 'FRIENDS_ONLY', label: 'Friends Only', icon: Users, desc: 'Teman yang diundang' },
  { value: 'PUBLIC', label: 'Public', icon: Globe, desc: 'Siapa saja' },
];

const STATUS_OPTIONS = [
  { value: 'DRAFT', label: 'Draft', color: 'amber' },
  { value: 'PUBLISHED', label: 'Published', color: 'emerald' },
  { value: 'ARCHIVED', label: 'Archived', color: 'gray' },
];

export default function StorySettingsPanel({ story, onClose, onUpdate, onDelete }: StorySettingsPanelProps) {
  const [title, setTitle] = useState(story.title || '');
  const [subtitle, setSubtitle] = useState(story.subtitle || '');
  const [description, setDescription] = useState(story.description || '');
  const [privacyLevel, setPrivacyLevel] = useState(story.privacyLevel?.toUpperCase() || 'PRIVATE');
  const [status, setStatus] = useState(story.status?.toUpperCase() || 'DRAFT');
  const [inviteEmail, setInviteEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [deleteStoryMutation] = useMutation<any>(DELETE_STORY);

  const { data: accessData, refetch: refetchAccess } = useQuery<any>(GET_STORY_ACCESS, {
    variables: { storyId: story.id },
    skip: privacyLevel !== 'FRIENDS_ONLY',
  });

  const [grantAccess] = useMutation(GRANT_STORY_ACCESS);
  const [revokeAccess] = useMutation(REVOKE_STORY_ACCESS);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdate({ title, subtitle, description, privacyLevel, status });
      notify.success('Story berhasil diupdate');
    } catch (err) {
      notify.error('Gagal mengupdate story');
    } finally {
      setSaving(false);
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    try {
      await grantAccess({ variables: { storyId: story.id, email: inviteEmail, level: 'VIEW' } });
      setInviteEmail('');
      refetchAccess();
      notify.success('Akses berhasil diberikan');
    } catch (err) {
      notify.error('Gagal memberikan akses');
    }
  };

  const handleRevoke = async (accessId: string) => {
    try {
      await revokeAccess({ variables: { storyId: story.id, accessId } });
      refetchAccess();
      notify.success('Akses dicabut');
    } catch (err) {
      notify.error('Gagal mencabut akses');
    }
  };

  return (
    <div className="absolute top-0 right-0 h-full w-[360px] bg-white/95 dark:bg-[#2a2438]/95 backdrop-blur-xl border-l border-[#FFB8C0]/15 dark:border-[#E63946]/10 shadow-2xl z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#FFB8C0]/10 dark:border-[#E63946]/10">
        <h3 className="text-sm font-semibold text-[#4A2F3C] dark:text-[#e2d9f3]">Story Settings</h3>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#FFB8C0]/10 transition-colors">
          <X className="w-4 h-4 text-[#5A3E4C]/60 dark:text-[#e2d9f3]/60" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
        {/* Title & Subtitle */}
        <div className="space-y-3">
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-[#5A3E4C]/40 font-semibold mb-1.5">Judul</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#FFB8C0]/20 bg-white/50 dark:bg-[#1a1625]/50 text-sm text-[#4A2F3C] dark:text-[#e2d9f3] focus:outline-none focus:border-[#E63946]/50" />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-[#5A3E4C]/40 font-semibold mb-1.5">Subtitle</label>
            <input type="text" value={subtitle} onChange={e => setSubtitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#FFB8C0]/20 bg-white/50 dark:bg-[#1a1625]/50 text-sm text-[#4A2F3C] dark:text-[#e2d9f3] focus:outline-none focus:border-[#E63946]/50" />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-[#5A3E4C]/40 font-semibold mb-1.5">Deskripsi</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
              className="w-full px-3 py-2 rounded-lg border border-[#FFB8C0]/20 bg-white/50 dark:bg-[#1a1625]/50 text-sm text-[#4A2F3C] dark:text-[#e2d9f3] focus:outline-none focus:border-[#E63946]/50 resize-none" />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-[#5A3E4C]/40 font-semibold mb-2">Status</label>
          <div className="flex gap-2">
            {STATUS_OPTIONS.map(opt => (
              <button key={opt.value} onClick={() => setStatus(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${status === opt.value ? 'bg-[#E63946]/10 text-[#E63946] border border-[#E63946]/30' : 'border border-[#FFB8C0]/15 text-[#5A3E4C]/50 dark:text-[#e2d9f3]/40 hover:border-[#E63946]/20'}`}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Privacy */}
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-[#5A3E4C]/40 font-semibold mb-2">Privasi</label>
          <div className="space-y-2">
            {PRIVACY_OPTIONS.map(opt => {
              const Icon = opt.icon;
              return (
                <button key={opt.value} onClick={() => setPrivacyLevel(opt.value)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${privacyLevel === opt.value ? 'border-[#E63946] bg-[#E63946]/5' : 'border-[#FFB8C0]/15 hover:border-[#E63946]/20'}`}>
                  <Icon className={`w-4 h-4 ${privacyLevel === opt.value ? 'text-[#E63946]' : 'text-[#5A3E4C]/30'}`} />
                  <div>
                    <p className="text-xs font-medium text-[#4A2F3C] dark:text-[#e2d9f3]">{opt.label}</p>
                    <p className="text-[10px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30">{opt.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Friends Access (only show when friends_only) */}
        {privacyLevel === 'FRIENDS_ONLY' && (
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-[#5A3E4C]/40 font-semibold mb-2">Undang Teman</label>
            <div className="flex gap-2 mb-3">
              <input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)}
                placeholder="Email teman..."
                className="flex-1 px-3 py-2 rounded-lg border border-[#FFB8C0]/20 bg-white/50 dark:bg-[#1a1625]/50 text-xs text-[#4A2F3C] dark:text-[#e2d9f3] focus:outline-none focus:border-[#E63946]/50" />
              <button onClick={handleInvite} className="px-3 py-2 rounded-lg bg-[#E63946] text-white text-xs font-medium">
                Undang
              </button>
            </div>
            {accessData?.getStoryAccess?.length > 0 && (
              <div className="space-y-1.5">
                {accessData.getStoryAccess.map((access: any) => (
                  <div key={access.id} className="flex items-center justify-between p-2 rounded-lg bg-[#FFB8C0]/5 dark:bg-[#E63946]/5">
                    <span className="text-xs text-[#4A2F3C] dark:text-[#e2d9f3]">{access.grantedTo.email}</span>
                    <button onClick={() => handleRevoke(access.id)} className="p-1 rounded hover:bg-red-50 text-red-400">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="px-5 py-4 border-t border-[#FFB8C0]/10 dark:border-[#E63946]/10 space-y-2">
        <button onClick={handleSave} disabled={saving}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#E63946] hover:bg-[#E63946]/90 text-white text-sm font-medium transition-all disabled:opacity-50">
          <Save className="w-4 h-4" />
          {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>

        {!showDeleteConfirm ? (
          <button onClick={() => setShowDeleteConfirm(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-red-200 dark:border-red-900/30 text-red-500 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/10 transition-all">
            <Trash2 className="w-4 h-4" />
            Hapus Story
          </button>
        ) : (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-xs font-semibold text-red-600 dark:text-red-400">Yakin hapus story ini?</span>
            </div>
            <p className="text-[10px] text-red-500/70 mb-3">Semua data story akan dihapus permanen dan tidak bisa dikembalikan.</p>
            <div className="flex gap-2">
              <button onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-3 py-1.5 rounded-lg text-xs text-[#5A3E4C]/60 hover:bg-white dark:hover:bg-[#2a2438] transition-all">
                Batal
              </button>
              <button onClick={async () => {
                try {
                  await deleteStoryMutation({ variables: { id: story.id } });
                  notify.success('Story berhasil dihapus');
                  onDelete?.();
                } catch (err) {
                  notify.error('Gagal menghapus story');
                }
              }}
                className="flex-1 px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-medium transition-all">
                Hapus
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
