'use client';

import { useState, useEffect } from 'react';
import { X, Trash2, ImagePlus, Loader2, Tag as TagIcon, Archive } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useMutation } from '@apollo/client/react';
import { UPDATE_NOTE_CONTENT, DELETE_NOTE, ADD_NOTE_IMAGE, DELETE_NOTE_IMAGE, ARCHIVE_NOTE } from '@/graphql/mutations';
import TiptapEditor from './TiptapEditor';
import { notify, toast } from '@/lib/toast';
import { useTags } from '@/context/TagContext';

interface NoteEditorSidebarProps {
  note: any;
  onClose: () => void;
  onDeleteSuccess: (nodeId: string) => void;
  onUpdateCache: (nodeId: string, title?: string, content?: string, newImages?: any[], color?: string, mood?: string) => void;
}

export default function NoteEditorSidebar({ note, onClose, onDeleteSuccess, onUpdateCache }: NoteEditorSidebarProps) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [color, setColor] = useState(note?.color || 'default');
  const [images, setImages] = useState<any[]>(note?.images || []);
  const [uploading, setUploading] = useState(false);
  const [noteTags, setNoteTags] = useState<any[]>(note?.tags || []);
  const [noteType, setNoteType] = useState<string>(note?.type || 'text');
  const [mood, setMood] = useState<string>(note?.mood || '');
  
  const supabase = createClient();
  const { tags, assignTagsToNote, removeTagFromNote } = useTags();
  const [updateNoteContent] = useMutation<any>(UPDATE_NOTE_CONTENT);
  const [deleteNote] = useMutation<any>(DELETE_NOTE);
  const [addNoteImage] = useMutation<any>(ADD_NOTE_IMAGE);
  const [deleteNoteImage] = useMutation<any>(DELETE_NOTE_IMAGE);
  const [archiveNote] = useMutation<any>(ARCHIVE_NOTE);

  useEffect(() => {
    setTitle(note?.title || '');
    setContent(note?.content || '');
    setColor(note?.color || 'default');
    setImages(note?.images || []);
    setNoteTags(note?.tags || []);
    setNoteType(note?.type || 'text');
    setMood(note?.mood || '');
  }, [note]);

  useEffect(() => {
    if (!note) return;
    
    const handler = setTimeout(() => {
      if (title !== note.title || content !== note.content || color !== (note.color || 'default') || noteType !== (note.type || 'text') || mood !== (note.mood || '')) {
        updateNoteContent({
          variables: {
            input: {
              id: note.id,
              title,
              content,
              color,
              type: noteType,
              mood
            }
          }
        });
        onUpdateCache(note.id, title, content, undefined, color, mood);
      }
    }, 800);

    return () => clearTimeout(handler);
  }, [title, content, color, noteType, mood, note, updateNoteContent, onUpdateCache]);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || 'anonymous';
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('notes_images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('notes_images')
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;

      const { data } = await addNoteImage({
        variables: {
          input: {
            noteId: note.id,
            imageUrl: publicUrl,
            caption: '',
          }
        }
      });

      if (data?.addNoteImage) {
        const newImages = [...images, data.addNoteImage];
        setImages(newImages);
        onUpdateCache(note.id, title, content, newImages);
      }

    } catch (err: any) {
      notify.error("Gagal mengunggah gambar: " + err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = (imageId: string) => {
    toast('Hapus gambar ini?', {
      action: {
        label: 'Hapus',
        onClick: async () => {
          const imgToDelete = images.find(img => img.id === imageId);
          if (imgToDelete) {
            try {
              const urlParts = imgToDelete.imageUrl.split('/notes_images/');
              if (urlParts.length === 2) {
                const filePath = urlParts[1];
                await supabase.storage.from('notes_images').remove([filePath]);
              }
            } catch (e) {
              console.error("Failed to delete physical image", e);
            }
          }

          await deleteNoteImage({ variables: { id: imageId } });
          const newImages = images.filter(img => img.id !== imageId);
          setImages(newImages);
          onUpdateCache(note.id, title, content, newImages);
        },
      },
    });
  };

  if (!note) return null;

  return (
    <div className="absolute top-0 right-0 h-full w-[400px] bg-white/95 backdrop-blur-2xl shadow-2xl shadow-pink-200/30 border-l border-[#FFB4A2]/15 z-50 flex flex-col pt-16 animate-slide-in-right">
      {/* Accent line */}
      <div className="absolute top-16 left-0 w-px h-full bg-gradient-to-b from-[#FF8FA3]/40 via-[#FFB4A2]/10 to-transparent" />

      {/* ── Header ── */}
      <div className="flex items-center justify-between p-5 border-b border-[#FFB4A2]/15">
        <h2 className="text-lg font-bold bg-gradient-to-r from-[#FF8FA3] to-[#FFB4A2] bg-clip-text text-transparent">Edit Note</h2>
        <div className="flex gap-1.5">
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
          <label className="block text-xs font-semibold text-[#5A3E4C]/40 uppercase tracking-wider mb-2">Title</label>
          <input
            type="text"
            className="w-full bg-white/60 border border-[#FFB4A2]/20 rounded-xl text-[#4A2F3C] text-lg font-semibold px-4 py-3 placeholder-[#5A3E4C]/30 focus:outline-none focus:ring-2 focus:ring-[#FF8FA3]/30 focus:border-[#FF8FA3]/30 transition-all hover:bg-white/80"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled Note"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#5A3E4C]/40 uppercase tracking-wider mb-2">Content</label>
          <TiptapEditor content={content} onChange={setContent} />
          <p className="text-[11px] text-[#5A3E4C]/30 mt-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60 animate-pulse" />
            Auto-saved
          </p>
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
                <img src={img.imageUrl} alt={img.caption || 'Note attachment'} className="object-cover w-full h-24 opacity-80 group-hover:opacity-100 transition-opacity" />
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
              onChange={handleImageUpload}
              disabled={uploading}
            />
          </label>
        </div>
        
        {/* ── Backlinks ── */}
        {note.incomingEdges && note.incomingEdges.length > 0 && (
          <div className="border-t border-[#FFB4A2]/15 pt-6 pb-4">
            <label className="block text-xs font-semibold text-[#5A3E4C]/40 uppercase tracking-wider mb-3">Mentioned In</label>
            <div className="space-y-2">
              {note.incomingEdges.map((edge: any) => (
                <div key={edge.id} className="px-3 py-2 bg-[#FFF5F0]/50 border border-[#FFB4A2]/15 rounded-lg text-sm text-[#5A3E4C]/70 hover:text-[#5A3E4C] hover:border-[#FF8FA3]/30 transition-all cursor-pointer flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF8FA3]/50" />
                  <span className="truncate flex-1">{edge.source.title || 'Untitled Note'}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
