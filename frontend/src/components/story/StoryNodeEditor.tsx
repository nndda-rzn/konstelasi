'use client';

import { useState, useEffect } from 'react';
import { X, Trash2, Lock, Unlock, MapPin, Clock, Heart, Save, Loader2 } from 'lucide-react';
import { useMutation } from '@apollo/client/react';
import { UPDATE_NOTE_CONTENT, DELETE_NOTE } from '@/graphql/mutations';
import { TOGGLE_NODE_LOCK } from '@/graphql/story';
import { notify } from '@/lib/toast';
import TiptapEditor from '@/components/canvas/TiptapEditor';

const NODE_TYPE_OPTIONS = [
  { value: 'scene', label: 'Scene', color: '#FF8FA3' },
  { value: 'memory', label: 'Memory', color: '#C7CEEA' },
  { value: 'character', label: 'Character', color: '#E0BBE4' },
  { value: 'dialogue', label: 'Dialogue', color: '#B5EAD7' },
  { value: 'moment', label: 'Moment', color: '#FFD6A5' },
  { value: 'feeling', label: 'Feeling', color: '#FF6B9D' },
  { value: 'timeline_event', label: 'Event', color: '#87CEEB' },
  { value: 'media', label: 'Media', color: '#DDA0DD' },
  { value: 'quote', label: 'Quote', color: '#F0E68C' },
  { value: 'reflection', label: 'Reflection', color: '#98D8C8' },
];

const EMOTIONS = [
  { value: 'happy', label: 'Happy', color: '#FFD6A5' },
  { value: 'sad', label: 'Sad', color: '#C7CEEA' },
  { value: 'excited', label: 'Excited', color: '#FF8FA3' },
  { value: 'peaceful', label: 'Peaceful', color: '#B5EAD7' },
  { value: 'romantic', label: 'Romantic', color: '#E0BBE4' },
  { value: 'melancholic', label: 'Melancholic', color: '#87CEEB' },
  { value: 'nostalgic', label: 'Nostalgic', color: '#DDA0DD' },
  { value: 'hopeful', label: 'Hopeful', color: '#98D8C8' },
];

interface StoryNodeEditorProps {
  note: any;
  onClose: () => void;
  onUpdateCache: (nodeId: string, title?: string, content?: string, newImages?: any[], color?: string, mood?: string) => void;
  onDeleteSuccess: () => void;
}

export default function StoryNodeEditor({ note, onClose, onUpdateCache, onDeleteSuccess }: StoryNodeEditorProps) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [mood, setMood] = useState(note?.mood || '');
  const [isLocked, setIsLocked] = useState(note?.isLocked || false);
  const [saving, setSaving] = useState(false);

  // Parse metadata
  let initialMetadata: any = {};
  try { if (note?.storyMetadata) initialMetadata = JSON.parse(note.storyMetadata); } catch {}
  const [metadata, setMetadata] = useState(initialMetadata);

  const [updateContent] = useMutation<any>(UPDATE_NOTE_CONTENT);
  const [deleteNote] = useMutation<any>(DELETE_NOTE);
  const [toggleLock] = useMutation<any>(TOGGLE_NODE_LOCK);

  // Auto-save debounce
  useEffect(() => {
    const handler = setTimeout(async () => {
      if (!note) return;
      try {
        await updateContent({
          variables: {
            input: {
              id: note.id,
              title,
              content,
              mood: mood || undefined,
            },
          },
        });
        onUpdateCache(note.id, title, content, undefined, undefined, mood);
      } catch (err) {
        console.error('Auto-save failed:', err);
      }
    }, 800);
    return () => clearTimeout(handler);
  }, [title, content, mood]);

  // Reset state when note changes
  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
      setMood(note.mood || '');
      setIsLocked(note.isLocked || false);
      try { setMetadata(note.storyMetadata ? JSON.parse(note.storyMetadata) : {}); } catch { setMetadata({}); }
    }
  }, [note?.id]);

  const handleToggleLock = async () => {
    try {
      await toggleLock({ variables: { noteId: note.id } });
      setIsLocked(!isLocked);
      notify.success(isLocked ? 'Node dibuka' : 'Node dikunci');
    } catch (err) {
      notify.error('Gagal mengubah lock');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteNote({ variables: { id: note.id } });
      notify.success('Node dihapus');
      onDeleteSuccess();
    } catch (err) {
      notify.error('Gagal menghapus node');
    }
  };

  if (!note) return null;

  const nodeType = note.storyNodeType || 'scene';
  const nodeColor = NODE_TYPE_OPTIONS.find(t => t.value === nodeType)?.color || '#FF8FA3';

  return (
    <div className="absolute top-0 right-0 h-full w-[420px] bg-white/95 dark:bg-[#2a2438]/95 backdrop-blur-2xl shadow-2xl border-l border-[#FFB4A2]/15 dark:border-[#FF8FA3]/10 z-50 flex flex-col overflow-hidden">
      {/* Accent line */}
      <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: nodeColor }} />

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 mt-1 border-b border-[#FFB4A2]/10 dark:border-[#FF8FA3]/10">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: nodeColor }} />
          <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: nodeColor }}>
            {nodeType.replace('_', ' ')}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={handleToggleLock} className={`p-2 rounded-lg transition-all ${isLocked ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'text-[#5A3E4C]/30 hover:text-[#5A3E4C]/60 hover:bg-[#FFB4A2]/10'}`} title={isLocked ? 'Unlock' : 'Lock'}>
            {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          </button>
          <button onClick={handleDelete} className="p-2 text-[#5A3E4C]/30 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all" title="Hapus">
            <Trash2 className="w-4 h-4" />
          </button>
          <button onClick={onClose} className="p-2 text-[#5A3E4C]/30 hover:text-[#5A3E4C]/60 hover:bg-[#FFB4A2]/10 rounded-lg transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
        {/* Title */}
        <div>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)}
            placeholder="Judul node..."
            className="w-full text-lg font-bold text-[#4A2F3C] dark:text-[#e2d9f3] bg-transparent border-none outline-none placeholder:text-[#5A3E4C]/20" />
        </div>

        {/* Metadata (Scene-specific) */}
        {(nodeType === 'scene' || nodeType === 'timeline_event') && (
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-[#FFB4A2]/5 dark:bg-[#FF8FA3]/5 border border-[#FFB4A2]/10 dark:border-[#FF8FA3]/10">
              <MapPin className="w-3.5 h-3.5 text-[#FF8FA3]/60" />
              <input type="text" value={metadata.sceneLocation || ''} onChange={e => setMetadata({ ...metadata, sceneLocation: e.target.value })}
                placeholder="Lokasi..."
                className="flex-1 text-xs text-[#4A2F3C] dark:text-[#e2d9f3] bg-transparent outline-none placeholder:text-[#5A3E4C]/20" />
            </div>
            <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-[#FFB4A2]/5 dark:bg-[#FF8FA3]/5 border border-[#FFB4A2]/10 dark:border-[#FF8FA3]/10">
              <Clock className="w-3.5 h-3.5 text-[#87CEEB]/60" />
              <input type="text" value={metadata.sceneTime || ''} onChange={e => setMetadata({ ...metadata, sceneTime: e.target.value })}
                placeholder="Waktu..."
                className="flex-1 text-xs text-[#4A2F3C] dark:text-[#e2d9f3] bg-transparent outline-none placeholder:text-[#5A3E4C]/20" />
            </div>
          </div>
        )}

        {/* Character name */}
        {nodeType === 'character' && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#E0BBE4]/10 border border-[#E0BBE4]/20">
            <Heart className="w-3.5 h-3.5 text-[#E0BBE4]" />
            <input type="text" value={metadata.characterName || ''} onChange={e => setMetadata({ ...metadata, characterName: e.target.value })}
              placeholder="Nama karakter..."
              className="flex-1 text-xs text-[#4A2F3C] dark:text-[#e2d9f3] bg-transparent outline-none placeholder:text-[#5A3E4C]/20" />
          </div>
        )}

        {/* Content Editor */}
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-[#5A3E4C]/40 font-semibold mb-2">Konten</label>
          <TiptapEditor content={content} onChange={setContent} />
        </div>

        {/* Emotion */}
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-[#5A3E4C]/40 font-semibold mb-2">Emosi</label>
          <div className="flex flex-wrap gap-1.5">
            {EMOTIONS.map(em => (
              <button key={em.value} onClick={() => setMood(mood === em.value ? '' : em.value)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-all ${mood === em.value ? 'ring-1 ring-offset-1 scale-105' : 'opacity-60 hover:opacity-100'}`}
                style={{ backgroundColor: `${em.color}25`, color: em.color }}>
                {em.label}
              </button>
            ))}
          </div>
        </div>

        {/* Auto-save indicator */}
        <div className="flex items-center gap-1.5 pt-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60 animate-pulse" />
          <span className="text-[10px] text-[#5A3E4C]/30 dark:text-[#e2d9f3]/20">Auto-saved</span>
        </div>
      </div>
    </div>
  );
}
