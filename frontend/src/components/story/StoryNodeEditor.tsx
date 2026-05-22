'use client';

import { useState, useEffect } from 'react';
import { X, Trash2, Lock, Unlock, MapPin, Clock, Heart, Save, Loader2, Calendar, ImagePlus, Maximize2, Minimize2 } from 'lucide-react';
import { useMutation } from '@apollo/client/react';
import { UPDATE_NOTE_CONTENT, DELETE_NOTE, ADD_NOTE_IMAGE, DELETE_NOTE_IMAGE } from '@/graphql/mutations';
import { TOGGLE_NODE_LOCK } from '@/graphql/story';
import { notify } from '@/lib/toast';
import { createClient } from '@/lib/supabase/client';
import TiptapEditor from '@/components/canvas/TiptapEditor';

const NODE_TYPE_OPTIONS = [
  { value: 'scene', label: 'Scene', color: '#FF6B8B' },
  { value: 'memory', label: 'Memory', color: '#7C83FD' },
  { value: 'character', label: 'Character', color: '#C074DF' },
  { value: 'dialogue', label: 'Dialogue', color: '#38D9A9' },
  { value: 'moment', label: 'Moment', color: '#FF922B' },
  { value: 'feeling', label: 'Feeling', color: '#F03E3E' },
  { value: 'timeline_event', label: 'Event', color: '#4DABF7' },
  { value: 'media', label: 'Media', color: '#CC5DE8' },
  { value: 'quote', label: 'Quote', color: '#FCC419' },
  { value: 'reflection', label: 'Reflection', color: '#3BC9DB' },
];

const EMOTIONS = [
  { value: 'happy', label: 'Happy', color: '#FF922B' },
  { value: 'sad', label: 'Sad', color: '#7C83FD' },
  { value: 'excited', label: 'Excited', color: '#FF6B8B' },
  { value: 'peaceful', label: 'Peaceful', color: '#38D9A9' },
  { value: 'romantic', label: 'Romantic', color: '#C074DF' },
  { value: 'melancholic', label: 'Melancholic', color: '#4DABF7' },
  { value: 'nostalgic', label: 'Nostalgic', color: '#CC5DE8' },
  { value: 'hopeful', label: 'Hopeful', color: '#3BC9DB' },
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
  const [eventDate, setEventDate] = useState(note?.eventDate ? note.eventDate.split('T')[0] : '');
  const [eventLocation, setEventLocation] = useState(note?.eventLocation || '');
  const [images, setImages] = useState<any[]>(note?.images || []);
  const [uploading, setUploading] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [saving, setSaving] = useState(false);

  // Parse metadata
  let initialMetadata: any = {};
  try { if (note?.storyMetadata) initialMetadata = JSON.parse(note.storyMetadata); } catch {}
  const [metadata, setMetadata] = useState(initialMetadata);

  const [updateContent] = useMutation<any>(UPDATE_NOTE_CONTENT);
  const [deleteNote] = useMutation<any>(DELETE_NOTE);
  const [toggleLock] = useMutation<any>(TOGGLE_NODE_LOCK);
  const [addNoteImage] = useMutation<any>(ADD_NOTE_IMAGE);
  const [deleteNoteImage] = useMutation<any>(DELETE_NOTE_IMAGE);

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
              eventDate: eventDate || undefined,
              eventLocation: eventLocation || undefined,
            },
          },
        });
        onUpdateCache(note.id, title, content, undefined, undefined, mood);
      } catch (err: any) {
        // If note not found (deleted), close editor silently
        if (err?.message?.includes('not found') || err?.message?.includes('Not Found')) {
          onDeleteSuccess();
          return;
        }
        console.error('Auto-save failed:', err);
      }
    }, 800);
    return () => clearTimeout(handler);
  }, [title, content, mood, eventDate, eventLocation]);

  // Reset state when note changes
  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
      setMood(note.mood || '');
      setIsLocked(note.isLocked || false);
      setEventDate(note.eventDate ? note.eventDate.split('T')[0] : '');
      setEventLocation(note.eventLocation || '');
      setImages(note.images || []);
      try { setMetadata(note.storyMetadata ? JSON.parse(note.storyMetadata) : {}); } catch { setMetadata({}); }
    }
  }, [note?.id]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || 'anonymous';
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('notes_images').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from('notes_images').getPublicUrl(filePath);
      const { data } = await addNoteImage({ variables: { input: { noteId: note.id, imageUrl: publicUrlData.publicUrl, caption: '' } } });
      if (data?.addNoteImage) {
        const newImages = [...images, data.addNoteImage];
        setImages(newImages);
        onUpdateCache(note.id, title, content, newImages);
        notify.success('Gambar berhasil diunggah');
      }
    } catch (err: any) {
      notify.error('Gagal mengunggah: ' + err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = async (imageId: string) => {
    try {
      await deleteNoteImage({ variables: { id: imageId } });
      const newImages = images.filter((img: any) => img.id !== imageId);
      setImages(newImages);
      onUpdateCache(note.id, title, content, newImages);
      notify.success('Gambar dihapus');
    } catch (err: any) {
      notify.error('Gagal menghapus gambar');
    }
  };

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
  const nodeColor = NODE_TYPE_OPTIONS.find(t => t.value === nodeType)?.color || '#E63946';

  return (
    <div className={`${focusMode ? 'fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm' : ''}`}>
    <div className={`${focusMode ? 'relative w-[700px] max-h-[90vh] rounded-2xl shadow-2xl' : 'absolute top-0 right-0 h-full w-[420px]'} bg-white/95 dark:bg-[#2a2438]/95 backdrop-blur-2xl shadow-2xl border-l border-[#FFB8C0]/15 dark:border-[#E63946]/10 z-50 flex flex-col overflow-hidden`}>
      {/* Accent line - gradient */}
      <div className="absolute top-0 left-0 w-full h-1 bg-candy-accent-line" />

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 mt-1 border-b border-[#FFB8C0]/10 dark:border-[#E63946]/10">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: nodeColor }} />
          <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: nodeColor }}>
            {nodeType.replace('_', ' ')}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setFocusMode(!focusMode)} className="p-2 text-[#5A3E4C]/30 hover:text-[#7C83FD] hover:bg-[#7C83FD]/10 rounded-lg transition-all" title={focusMode ? 'Exit Focus' : 'Focus Mode'}>
            {focusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button onClick={handleToggleLock} className={`p-2 rounded-lg transition-all ${isLocked ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'text-[#5A3E4C]/30 hover:text-[#5A3E4C]/60 hover:bg-[#FFB8C0]/10'}`} title={isLocked ? 'Unlock' : 'Lock'}>
            {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          </button>
          <button onClick={handleDelete} className="p-2 text-[#5A3E4C]/30 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all" title="Hapus">
            <Trash2 className="w-4 h-4" />
          </button>
          <button onClick={onClose} className="p-2 text-[#5A3E4C]/30 hover:text-[#5A3E4C]/60 hover:bg-[#FFB8C0]/10 rounded-lg transition-all">
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
            <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-[#FFB8C0]/5 dark:bg-[#E63946]/5 border border-[#FFB8C0]/10 dark:border-[#E63946]/10">
              <MapPin className="w-3.5 h-3.5 text-[#E63946]/60" />
              <input type="text" value={metadata.sceneLocation || ''} onChange={e => setMetadata({ ...metadata, sceneLocation: e.target.value })}
                placeholder="Lokasi..."
                className="flex-1 text-xs text-[#4A2F3C] dark:text-[#e2d9f3] bg-transparent outline-none placeholder:text-[#5A3E4C]/20" />
            </div>
            <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-[#FFB8C0]/5 dark:bg-[#E63946]/5 border border-[#FFB8C0]/10 dark:border-[#E63946]/10">
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
          <label className="block text-[11px] uppercase tracking-wider text-[#5A3E4C]/50 font-semibold mb-2">Konten</label>
          <TiptapEditor content={content} onChange={setContent} />
        </div>

        {/* Emotion */}
        <div>
          <label className="block text-[11px] uppercase tracking-wider text-[#5A3E4C]/50 font-semibold mb-2">Emosi</label>
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

        {/* Event Date & Location (for Memory Timeline) */}
        <div>
          <label className="block text-[11px] uppercase tracking-wider text-[#5A3E4C]/50 font-semibold mb-2">Kapan & Dimana</label>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-[#CC5DE8]/5 border border-[#CC5DE8]/10">
              <Calendar className="w-3.5 h-3.5 text-[#CC5DE8]/60" />
              <input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)}
                className="flex-1 text-xs text-[#4A2F3C] dark:text-[#e2d9f3] bg-transparent outline-none" />
            </div>
            <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-[#38D9A9]/5 border border-[#38D9A9]/10">
              <MapPin className="w-3.5 h-3.5 text-[#38D9A9]/60" />
              <input type="text" value={eventLocation} onChange={e => setEventLocation(e.target.value)}
                placeholder="Lokasi kejadian..."
                className="flex-1 text-xs text-[#4A2F3C] dark:text-[#e2d9f3] bg-transparent outline-none placeholder:text-[#5A3E4C]/20" />
            </div>
          </div>
        </div>

        {/* Media / Images */}
        <div>
          <label className="block text-[11px] uppercase tracking-wider text-[#5A3E4C]/50 font-semibold mb-2">Media</label>
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-2">
              {images.map((img: any) => (
                <div key={img.id} className="relative group rounded-lg overflow-hidden aspect-square">
                  <img src={img.imageUrl} alt={img.caption || ''} className="w-full h-full object-cover" />
                  <button onClick={() => handleRemoveImage(img.id)}
                    className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <label className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-dashed border-[#FFB8C0]/30 hover:border-[#FF6B8B]/50 hover:bg-[#FF6B8B]/5 cursor-pointer transition-all">
            {uploading ? <Loader2 className="w-4 h-4 text-[#FF6B8B] animate-spin" /> : <ImagePlus className="w-4 h-4 text-[#FF6B8B]/60" />}
            <span className="text-[10px] text-[#5A3E4C]/40">{uploading ? 'Mengunggah...' : 'Tambah Gambar'}</span>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
          </label>
        </div>

        {/* Auto-save indicator */}
        <div className="flex items-center gap-1.5 pt-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60 animate-pulse" />
          <span className="text-[11px] text-[#5A3E4C]/50 dark:text-[#e2d9f3]/40">Auto-saved</span>
        </div>
      </div>
    </div>
    </div>
  );
}
