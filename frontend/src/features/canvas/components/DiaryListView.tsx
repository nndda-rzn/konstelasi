'use client';

import { useRouter } from 'next/navigation';
import { Loader2, Plus, Search } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import NoteEditorSidebar from './NoteEditorSidebar';
import { DiaryListHeader } from './diaryList/DiaryListHeader';
import { NoteCard } from './diaryList/NoteCard';
import { EmptyDiaryState } from './diaryList/EmptyDiaryState';
import { useDiaryList } from './diaryList/useDiaryList';

export default function DiaryListView() {
  const router = useRouter();
  const supabase = createClient();
  const {
    data,
    loading,
    error,
    refetch,
    notes,
    selectedNote,
    setSelectedNote,
    searchQuery,
    setSearchQuery,
    handleCreateNewNote,
  } = useDiaryList();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const handleUpdateCache = (_id: string, _t?: string, _c?: string) => {
    refetch();
  };

  const handleDeleteSuccess = (_id: string) => {
    setSelectedNote(null);
    refetch();
  };

  if (loading) return (
    <div className="flex h-screen w-full items-center justify-center bg-[#FFFAF7] p-4">
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-[#FFB4A2]/20 blur-xl animate-pulse" />
          <Loader2 className="relative animate-spin text-[#FF8FA3] w-10 h-10" />
        </div>
        <p className="text-[#5A3E4C]/40 text-xs uppercase tracking-wider">Loading notes...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="text-[#FF6B9D] p-6 font-medium flex-col gap-3 flex bg-[#FFFAF7] min-h-screen items-center justify-center">
      <p className="text-[#5A3E4C]/50 text-sm">Error loading notes</p>
      <button onClick={() => refetch()} className="px-5 py-2.5 bg-gradient-to-r from-[#FF8FA3] to-[#FFB4A2] text-white rounded-xl font-medium shadow-lg shadow-pink-300/30">Retry</button>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-[#FFFAF7] pt-20 p-4">
      <DiaryListHeader onLogout={handleLogout} />

      <div className="flex flex-col gap-4 mb-6 max-w-2xl mx-auto mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#4A2F3C]">My Notes</h2>
          <button
            onClick={handleCreateNewNote}
            className="flex items-center gap-2 bg-gradient-to-r from-[#FF8FA3] to-[#FFB4A2] hover:from-[#FF7A8A] hover:to-[#FF8FA3] text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-pink-300/30 hover:shadow-pink-300/50"
          >
            <Plus className="w-4 h-4" /> New Note
          </button>
        </div>

        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#5A3E4C]/30 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search your thoughts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/60 border border-[#FFB4A2]/15 rounded-xl pl-11 pr-4 py-3 text-sm text-[#5A3E4C] placeholder-[#5A3E4C]/30 focus:outline-none focus:ring-1 focus:ring-[#FF8FA3]/40 focus:border-[#FF8FA3]/40 transition-all hover:bg-white/80"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
        {notes.map((note: any, i: number) => (
          <NoteCard key={note.id} note={note} index={i} onClick={() => setSelectedNote(note)} />
        ))}
      </div>

      {notes.length === 0 && <EmptyDiaryState searchQuery={searchQuery} />}

      {selectedNote && (
        <div className="fixed inset-0 z-40 bg-[#5A3E4C]/20 backdrop-blur-sm">
          <NoteEditorSidebar
            note={data?.getNotes?.find((n: any) => n.id === selectedNote.id) || selectedNote}
            onClose={() => setSelectedNote(null)}
            onUpdateCache={handleUpdateCache}
            onDeleteSuccess={handleDeleteSuccess}
          />
        </div>
      )}
    </div>
  );
}
