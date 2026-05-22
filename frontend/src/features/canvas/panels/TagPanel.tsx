'use client';

import { useState } from 'react';
import { useTags } from '@/context/TagContext';
import { X, Plus, Tag as TagIcon, Trash2, Edit, Check } from 'lucide-react';
import { notify } from '@/lib/toast';

const TAG_COLORS = [
  '#FF8FA3', '#FFB4A2', '#FFD6A5', '#A8E6CF',
  '#DCEDC1', '#B5EAD7', '#C7CEEA', '#E0BBE4',
  '#FFDAC1', '#FF9AA2', '#B5B8FF', '#97C1A9',
];

interface TagPanelProps {
  onClose: () => void;
}

export default function TagPanel({ onClose }: TagPanelProps) {
  const { tags, selectedTagFilters, setSelectedTagFilters, createTag, updateTag, deleteTag } = useTags();
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState(TAG_COLORS[0]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  const handleCreate = async () => {
    if (!newTagName.trim()) return;
    try {
      await createTag(newTagName.trim(), newTagColor);
      setNewTagName('');
      setNewTagColor(TAG_COLORS[0]);
      setShowCreate(false);
      notify.success('Tag dibuat');
    } catch {
      notify.error('Gagal membuat tag');
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;
    try {
      await updateTag(id, editName.trim(), editColor);
      setEditingId(null);
      notify.success('Tag diperbarui');
    } catch {
      notify.error('Gagal memperbarui tag');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTag(id);
      setSelectedTagFilters(selectedTagFilters.filter(f => f !== id));
      notify.success('Tag dihapus');
    } catch {
      notify.error('Gagal menghapus tag');
    }
  };

  const toggleFilter = (id: string) => {
    if (selectedTagFilters.includes(id)) {
      setSelectedTagFilters(selectedTagFilters.filter(f => f !== id));
    } else {
      setSelectedTagFilters([...selectedTagFilters, id]);
    }
  };

  return (
    <div className="fixed top-0 right-0 h-full w-[320px] bg-white/95 backdrop-blur-2xl shadow-2xl shadow-pink-200/30 border-l border-[#FFB4A2]/15 z-50 flex flex-col pt-16 animate-slide-in-right">
      <div className="absolute top-16 left-0 w-px h-full bg-gradient-to-b from-[#FF8FA3]/40 via-[#FFB4A2]/10 to-transparent" />

      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-[#FFB4A2]/15">
        <div className="flex items-center gap-2">
          <TagIcon className="w-4 h-4 text-[#FF8FA3]" />
          <h2 className="text-lg font-bold text-[#4A2F3C]">Tags</h2>
        </div>
        <button onClick={onClose} className="p-2 text-[#5A3E4C]/30 hover:text-[#5A3E4C]/60 hover:bg-[#FFB4A2]/10 rounded-lg transition-all">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Filter Info */}
      {selectedTagFilters.length > 0 && (
        <div className="px-5 py-3 bg-[#FFF5F0]/50 border-b border-[#FFB4A2]/10">
          <p className="text-xs text-[#5A3E4C]/50">
            Filter aktif: {selectedTagFilters.length} tag dipilih
          </p>
          <button
            onClick={() => setSelectedTagFilters([])}
            className="text-xs text-[#FF8FA3] hover:underline mt-1"
          >
            Hapus semua filter
          </button>
        </div>
      )}

      {/* Tag List */}
      <div className="flex-1 overflow-y-auto p-5 space-y-2">
        {tags.map((tag) => (
          <div key={tag.id} className="group">
            {editingId === tag.id ? (
              <div className="p-3 rounded-xl border border-[#FFB4A2]/20 bg-[#FFF5F0]/50 space-y-2">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-white/60 border border-[#FFB4A2]/20 rounded-lg px-3 py-2 text-sm text-[#4A2F3C] focus:outline-none focus:ring-1 focus:ring-[#FF8FA3]/40"
                  autoFocus
                />
                <div className="flex flex-wrap gap-1.5">
                  {TAG_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setEditColor(c)}
                      className={`w-5 h-5 rounded-full transition-all ${editColor === c ? 'ring-2 ring-offset-1 ring-[#5A3E4C]/30 scale-110' : 'hover:scale-110'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleUpdate(tag.id)} className="px-3 py-1.5 bg-[#FF8FA3] text-white text-xs rounded-lg font-medium">
                    <Check className="w-3 h-3" />
                  </button>
                  <button onClick={() => setEditingId(null)} className="px-3 py-1.5 text-[#5A3E4C]/40 text-xs rounded-lg hover:bg-[#FFB4A2]/10">
                    Batal
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#FFF5F0]/50 transition-all">
                <button
                  onClick={() => toggleFilter(tag.id)}
                  className={`w-4 h-4 rounded-full border-2 transition-all shrink-0 ${
                    selectedTagFilters.includes(tag.id)
                      ? 'border-transparent scale-110'
                      : 'border-[#5A3E4C]/20'
                  }`}
                  style={{
                    backgroundColor: selectedTagFilters.includes(tag.id) ? (tag.color || '#FF8FA3') : 'transparent',
                  }}
                />
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: tag.color || '#FF8FA3' }}
                />
                <span className="flex-1 text-sm text-[#4A2F3C] font-medium truncate">{tag.name}</span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => { setEditingId(tag.id); setEditName(tag.name); setEditColor(tag.color || '#FF8FA3'); }}
                    className="p-1 text-[#5A3E4C]/30 hover:text-[#FF8FA3] rounded transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(tag.id)}
                    className="p-1 text-[#5A3E4C]/30 hover:text-[#FF6B9D] rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {tags.length === 0 && (
          <div className="text-center py-8 text-[#5A3E4C]/40 text-sm">
            <p>Belum ada tag.</p>
            <p className="text-xs mt-1">Buat tag untuk mengorganisir catatan.</p>
          </div>
        )}
      </div>

      {/* Create Tag */}
      <div className="p-5 border-t border-[#FFB4A2]/15">
        {showCreate ? (
          <div className="space-y-3">
            <input
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              placeholder="Nama tag..."
              className="w-full bg-white/60 border border-[#FFB4A2]/20 rounded-xl px-4 py-2.5 text-sm text-[#4A2F3C] placeholder-[#5A3E4C]/30 focus:outline-none focus:ring-1 focus:ring-[#FF8FA3]/40"
              autoFocus
            />
            <div className="flex flex-wrap gap-1.5">
              {TAG_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setNewTagColor(c)}
                  className={`w-5 h-5 rounded-full transition-all ${newTagColor === c ? 'ring-2 ring-offset-1 ring-[#5A3E4C]/30 scale-110' : 'hover:scale-110'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                disabled={!newTagName.trim()}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-[#FF8FA3] to-[#FFB4A2] text-white text-sm font-medium rounded-xl disabled:opacity-50 transition-all"
              >
                Buat Tag
              </button>
              <button
                onClick={() => { setShowCreate(false); setNewTagName(''); }}
                className="px-4 py-2 text-[#5A3E4C]/40 text-sm rounded-xl hover:bg-[#FFB4A2]/10 transition-all"
              >
                Batal
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowCreate(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FFF5F0] border border-[#FFB4A2]/15 rounded-xl text-sm font-medium text-[#5A3E4C]/60 hover:text-[#FF8FA3] hover:bg-[#FFB4A2]/10 transition-all"
          >
            <Plus className="w-4 h-4" /> Buat Tag Baru
          </button>
        )}
      </div>
    </div>
  );
}
