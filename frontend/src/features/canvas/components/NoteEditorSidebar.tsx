'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Trash2, ImagePlus, Loader2, Tag as TagIcon, Archive, History, Pencil } from 'lucide-react';
import { useMutation } from '@apollo/client/react';
import { UPDATE_NOTE_CONTENT, DELETE_NOTE, ARCHIVE_NOTE } from '@/graphql/mutations';
import TiptapEditor from '@/features/canvas/components/TiptapEditor';
import SaveIndicator from '@/features/canvas/components/SaveIndicator';
import ContentStats from '@/features/canvas/components/ContentStats';
import NoteTimestamps from '@/features/canvas/components/NoteTimestamps';
import TitleFontPicker from '@/features/canvas/components/TitleFontPicker';
import VersionPanel from '@/features/canvas/panels/VersionPanel';
import DrawingCanvas from './DrawingCanvas';
import BacklinksPanel from '@/features/notes/components/BacklinksPanel';
import { notify, toast } from '@/lib/toast';
import { useTags } from '@/context/TagContext';
import { useNoteImageUpload } from '@/features/canvas/hooks/useNoteImageUpload';

interface NoteEditorSidebarProps {
  note: any;
  allNotes?: any[];
  onClose: () => void;
  onDeleteSuccess: (nodeId: string) => void;
  onUpdateCache: (nodeId: string, title?: string, content?: string, newImages?: any[], color?: string, mood?: string) => void;
  onNavigate?: (nodeId: string) => void;
}

export default function NoteEditorSidebar({ note, allNotes = [], onClose, onDeleteSuccess, onUpdateCache, onNavigate }: NoteEditorSidebarProps) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [color, setColor] = useState(note?.color || 'default');
  const [noteTags, setNoteTags] = useState<any[]>(note?.tags || []);
  const [noteType, setNoteType] = useState<string>(note?.type || 'text');
  const [mood, setMood] = useState<string>(note?.mood || '');
  const [showVersions, setShowVersions] = useState(false);
  const [showDrawing, setShowDrawing] = useState(false);
  const { tags, assignTagsToNote, removeTagFromNote } = useTags();
  const [updateNoteContent] = useMutation<any>(UPDATE_NOTE_CONTENT);
  const [deleteNote] = useMutation<any>(DELETE_NOTE);
  const [archiveNote] = useMutation<any>(ARCHIVE_NOTE);
  const titleRef = useRef<HTMLInputElement>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  // Title font is now persisted in the backend `note.titleFont` field
  // so it syncs across devices, surveys versioning, exports, and sharing.
  const [titleFont, setTitleFont] = useState<string>(note?.titleFont || '');

  // Auto-focus title input when sidebar opens (for new notes / fresh open).
  useEffect(() => {
    if (note?.id) {
      // Slight delay to allow sidebar transition to settle.
      const timer = setTimeout(() => titleRef.current?.focus(), 120);
      return () => clearTimeout(timer);
    }
  }, [note?.id]);

  // Esc closes the sidebar (unless user is in nested modal/drawing).
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (showVersions || showDrawing) return;
      onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, showVersions, showDrawing]);

  const { images, setImages, uploading, uploadFromInputEvent, deleteImage } = useNoteImageUpload({
    noteId: note?.id,
    initialImages: note?.images || [],
    onImagesChange: (newImages) => onUpdateCache(note.id, title, content, newImages),
  });

  useEffect(() => {
    setTitle(note?.title || '');
    setContent(note?.content || '');
    setColor(note?.color || 'default');
    setImages(note?.images || []);
    setNoteTags(note?.tags || []);
    setNoteType(note?.type || 'text');
    setMood(note?.mood || '');
    setTitleFont(note?.titleFont || '');
  }, [note]);

  useEffect(() => {
    if (!note) return;
    
    const handler = setTimeout(() => {
      const isDirty =
        title !== note.title ||
        content !== note.content ||
        color !== (note.color || 'default') ||
        noteType !== (note.type || 'text') ||
        mood !== (note.mood || '') ||
        titleFont !== (note.titleFont || '');
      if (isDirty) {
        setSaveStatus('saving');
        updateNoteContent({
          variables: {
            input: {
              id: note.id,
              title,
              content,
              color,
              type: noteType,
              mood,
              titleFont,
            }
          }
        })
          .then(() => {
            setSaveStatus('saved');
            setLastSavedAt(Date.now());
          })
          .catch(() => setSaveStatus('error'));
        onUpdateCache(note.id, title, content, undefined, color, mood);
      }
    }, 800);

    return () => clearTimeout(handler);
  }, [title, content, color, noteType, mood, titleFont, note, updateNoteContent, onUpdateCache]);

  const handleDeleteNode = () => {
    toast('Hapus catatan ini beserta semua linknya?', {
      action: {
        label: 'Hapus',
        onClick: async () => {
          await deleteNote({ 
            variables: { id: note.id },
            update(cache) {
              cache.modify({
                fields: {
                  getNotes(existingNotes = [], { readField }) {
                    return existingNotes.filter(
                      (noteRef: any) => note.id !== readField('id', noteRef)
                    );
                  }
                }
              });
            }
          });
          onDeleteSuccess(note.id);
        },
      },
    });
  };

  const handleArchiveNote = async () => {
    await archiveNote({
      variables: { id: note.id },
      update(cache) {
        cache.modify({
          fields: {
            getNotes(existingNotes = [], { readField }) {
              return existingNotes.filter(
                (noteRef: any) => note.id !== readField('id', noteRef)
              );
            }
          }
        });
      }
    });
    notify.success('Catatan diarsipkan');
    onDeleteSuccess(note.id);
  };

  const handleRemoveImage = (imageId: string) => {
    toast('Hapus gambar ini?', {
      action: {
        label: 'Hapus',
        onClick: () => deleteImage(imageId),
      },
    });
  };

  if (!note) return null;

  return (
    <>
    <div className="absolute top-0 right-0 h-full w-[400px] bg-white/95 backdrop-blur-2xl shadow-2xl shadow-pink-200/30 border-l border-[#FFB4A2]/15 z-50 flex flex-col pt-16 animate-slide-in-right">
      {/* Accent line */}
      <div className="absolute top-16 left-0 w-px h-full bg-gradient-to-b from-[#FF8FA3]/40 via-[#FFB4A2]/10 to-transparent" />

      {/* ── Header ── */}
      <div className="flex items-center justify-between p-5 border-b border-[#FFB4A2]/15">
        <h2 className="text-lg font-bold bg-gradient-to-r from-[#FF8FA3] to-[#FFB4A2] bg-clip-text text-transparent">Edit Note</h2>
        <div className="flex gap-1.5">
          <button 
            onClick={() => setShowVersions(!showVersions)} 
            className={`p-2 rounded-lg transition-all ${showVersions ? 'text-[#FF8FA3] bg-[#FF8FA3]/10' : 'text-[#5A3E4C]/30 hover:text-[#5A3E4C]/60 hover:bg-[#FFB4A2]/10'}`}
            title="Riwayat Versi"
          >
            <History className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setShowDrawing(true)} 
            className="p-2 text-[#5A3E4C]/30 hover:text-[#5A3E4C]/60 hover:bg-[#FFB4A2]/10 rounded-lg transition-all"
            title="Drawing Canvas"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button 
            onClick={handleArchiveNote} 
            className="p-2 text-[#5A3E4C]/30 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-all" 
            title="Arsipkan"
          >
            <Archive className="w-4 h-4" />
          </button>
          <button 
            onClick={handleDeleteNode} 
            className="p-2 text-[#5A3E4C]/30 hover:text-[#FF6B9D] hover:bg-[#FF6B9D]/10 rounded-lg transition-all" 
            title="Delete note"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button 
            onClick={onClose} 
            className="p-2 text-[#5A3E4C]/30 hover:text-[#5A3E4C]/60 hover:bg-[#FFB4A2]/10 rounded-lg transition-all" 
            title="Close editor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-[#5A3E4C]/40 uppercase tracking-wider">Title</label>
            <TitleFontPicker value={titleFont} onChange={setTitleFont} />
          </div>
          <input
            ref={titleRef}
            type="text"
            className="w-full bg-white/60 border border-[#FFB4A2]/20 rounded-xl text-[#4A2F3C] text-lg font-semibold px-4 py-3 placeholder-[#5A3E4C]/30 focus:outline-none focus:ring-2 focus:ring-[#FF8FA3]/30 focus:border-[#FF8FA3]/30 transition-all hover:bg-white/80"
            style={titleFont ? { fontFamily: titleFont } : undefined}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled Note"
          />
          <NoteTimestamps createdAt={note?.createdAt} updatedAt={note?.updatedAt} />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#5A3E4C]/40 uppercase tracking-wider mb-2">Content</label>
          <TiptapEditor content={content} onChange={setContent} />
          <div className="flex items-center justify-between mt-2 gap-2">
            <SaveIndicator status={saveStatus} lastSavedAt={lastSavedAt} />
            <ContentStats content={content} />
          </div>
          {showVersions && (
            <VersionPanel
              noteId={note.id}
              isOpen={showVersions}
              onClose={() => setShowVersions(false)}
              onRestore={() => { setShowVersions(false); onClose(); }}
            />
          )}
        </div>

        {/* ── Mood ── */}
        <div className="border-t border-[#FFB4A2]/15 pt-6">
          <label className="block text-xs font-semibold text-[#5A3E4C]/40 uppercase tracking-wider mb-3">Moment</label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: '', label: 'None', color: 'transparent' },
              { id: 'memory', label: 'Memory', color: '#C7CEEA' },
              { id: 'hope', label: 'Hope', color: '#B5EAD7' },
              { id: 'secret', label: 'Secret', color: '#E0BBE4' },
              { id: 'dream', label: 'Dream', color: '#FFD6A5' },
              { id: 'ordinary', label: 'Ordinary', color: '#D4D4D4' },
              { id: 'important', label: 'Important', color: '#FF8FA3' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setMood(m.id)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${mood === m.id ? 'bg-[#FFF5F0] border-[#FFB4A2]/30 text-[#4A2F3C]' : 'border-[#FFB4A2]/10 text-[#5A3E4C]/40 hover:border-[#FFB4A2]/25 hover:text-[#5A3E4C]/60'}`}
              >
                {m.id && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />}
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Note Type ── */}
        <div className="border-t border-[#FFB4A2]/15 pt-6">
          <label className="block text-xs font-semibold text-[#5A3E4C]/40 uppercase tracking-wider mb-3">Tipe Catatan</label>
          <div className="flex gap-2">
            <button
              onClick={() => setNoteType('text')}
              className={`flex-1 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${noteType === 'text' ? 'bg-[#FF8FA3]/10 border-[#FF8FA3]/30 text-[#FF8FA3]' : 'border-[#FFB4A2]/15 text-[#5A3E4C]/50 hover:border-[#FF8FA3]/20'}`}
            >
              Catatan
            </button>
            <button
              onClick={() => setNoteType('quote')}
              className={`flex-1 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${noteType === 'quote' ? 'bg-[#FF8FA3]/10 border-[#FF8FA3]/30 text-[#FF8FA3]' : 'border-[#FFB4A2]/15 text-[#5A3E4C]/50 hover:border-[#FF8FA3]/20'}`}
            >
              Kutipan
            </button>
          </div>
        </div>

        {/* ── Theme Color ── */}
        <div className="border-t border-[#FFB4A2]/15 pt-6">
          <label className="block text-xs font-semibold text-[#5A3E4C]/40 uppercase tracking-wider mb-3">Theme Color</label>
          <div className="flex flex-wrap gap-2.5">
            {[
              { id: 'default', bg: 'bg-white', border: 'border-[#FFB4A2]/50' },
              { id: 'red', bg: 'bg-pink-100', border: 'border-pink-400/50' },
              { id: 'amber', bg: 'bg-amber-100', border: 'border-amber-400/50' },
              { id: 'emerald', bg: 'bg-emerald-100', border: 'border-emerald-400/50' },
              { id: 'blue', bg: 'bg-blue-100', border: 'border-blue-400/50' },
              { id: 'indigo', bg: 'bg-indigo-100', border: 'border-indigo-400/50' },
              { id: 'purple', bg: 'bg-purple-100', border: 'border-purple-400/50' },
              { id: 'pink', bg: 'bg-pink-200', border: 'border-pink-400/50' },
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => setColor(c.id)}
                className={`w-8 h-8 rounded-full border-2 transition-all duration-300 ${c.bg} ${color === c.id ? c.border + ' scale-110 shadow-lg' : 'border-transparent hover:border-[#FFB4A2]/30 hover:scale-105'}`}
                title={c.id.charAt(0).toUpperCase() + c.id.slice(1)}
              />
            ))}
          </div>
        </div>

        {/* ── Tags ── */}
        <div className="border-t border-[#FFB4A2]/15 pt-6">
          <label className="block text-xs font-semibold text-[#5A3E4C]/40 uppercase tracking-wider mb-3">Tags</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {noteTags.map((tag: any) => (
              <span
                key={tag.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: tag.color || '#FF8FA3' }}
              >
                {tag.name}
                <button
                  onClick={async () => {
                    await removeTagFromNote(note.id, tag.id);
                    setNoteTags(noteTags.filter((t: any) => t.id !== tag.id));
                  }}
                  className="w-3.5 h-3.5 rounded-full bg-white/30 hover:bg-white/50 flex items-center justify-center transition-colors"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {tags.filter((t: any) => !noteTags.some((nt: any) => nt.id === t.id)).map((tag: any) => (
              <button
                key={tag.id}
                onClick={async () => {
                  await assignTagsToNote(note.id, [tag.id]);
                  setNoteTags([...noteTags, tag]);
                }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-[#FFB4A2]/20 text-[#5A3E4C]/60 hover:text-[#5A3E4C] hover:border-[#FF8FA3]/30 transition-all"
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tag.color || '#FF8FA3' }} />
                {tag.name}
              </button>
            ))}
          </div>
          {tags.length === 0 && (
            <p className="text-xs text-[#5A3E4C]/30">Belum ada tag. Buat tag dari panel Tags.</p>
          )}
        </div>

        {/* ── Attachments ── */}
        <div className="border-t border-[#FFB4A2]/15 pt-6">
          <label className="block text-xs font-semibold text-[#5A3E4C]/40 uppercase tracking-wider mb-3">Attachments</label>
          
          <div className="grid grid-cols-2 gap-2.5 mb-4">
            {images.map((img) => (
              <div key={img.id} className="relative group rounded-xl overflow-hidden border border-[#FFB4A2]/15 bg-[#FFF5F0]/50">
                <img src={img.imageUrl} alt={img.caption || 'Note attachment'} loading="lazy" decoding="async" className="object-cover w-full h-24 opacity-80 group-hover:opacity-100 transition-opacity" />
                <button 
                  onClick={() => handleRemoveImage(img.id)}
                  className="absolute top-1.5 right-1.5 bg-[#FF6B9D]/80 hover:bg-[#FF6B9D] text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <label className="flex items-center justify-center w-full p-4 border border-dashed border-[#FFB4A2]/20 rounded-xl hover:border-[#FF8FA3]/40 hover:bg-[#FF8FA3]/[0.04] cursor-pointer transition-all text-[#5A3E4C]/30 hover:text-[#FF8FA3] font-medium text-sm">
            {uploading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <><ImagePlus className="w-5 h-5 mr-2" /> Upload Image</>
            )}
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={uploadFromInputEvent}
              disabled={uploading}
            />
          </label>
        </div>
        
        {/* ── Memory Backlinks (Knowledge Graph) ── */}
        <div className="border-t border-[#FFB4A2]/15 pt-6 pb-4">
          <BacklinksPanel
            note={note}
            allNotes={allNotes}
            onNavigate={(id) => onNavigate?.(id)}
          />
        </div>
      </div>
    </div>

    {/* Drawing Canvas Modal */}
    <DrawingCanvas
      isOpen={showDrawing}
      onClose={() => setShowDrawing(false)}
    />
    </>
  );
}
