'use client';

import { useMemo } from 'react';
import { Calendar, Clock } from 'lucide-react';

interface TimelineViewProps {
  notes: any[];
  onNoteClick: (noteId: string) => void;
  selectedNoteId?: string;
}

function groupByDate(notes: any[]): Record<string, any[]> {
  const groups: Record<string, any[]> = {};
  notes.forEach((note) => {
    const date = new Date(note.createdAt || Date.now());
    const key = date.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    if (!groups[key]) groups[key] = [];
    groups[key].push(note);
  });
  return groups;
}

export default function TimelineView({ notes, onNoteClick, selectedNoteId }: TimelineViewProps) {
  const grouped = useMemo(() => {
    const sorted = [...notes].sort((a, b) => {
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
    return groupByDate(sorted);
  }, [notes]);

  const dateKeys = Object.keys(grouped);

  if (dateKeys.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-[#5A3E4C]/40 py-20">
        <Calendar className="w-10 h-10 mb-3 opacity-40" />
        <p className="text-sm">Belum ada catatan di timeline.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto pb-32">
      <div className="max-w-2xl mx-auto py-8 px-6">
        {dateKeys.map((dateKey) => (
          <div key={dateKey} className="mb-8">
            {/* Date Header */}
            <div className="flex items-center gap-3 mb-4 sticky top-0 bg-[#FFFAF7]/90 backdrop-blur-sm py-2 z-10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF8FA3] to-[#FFB4A2] flex items-center justify-center shadow-sm">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-[#4A2F3C]">{dateKey}</h3>
              <div className="flex-1 h-px bg-[#FFB4A2]/15" />
              <span className="text-xs text-[#5A3E4C]/30">{grouped[dateKey].length} catatan</span>
            </div>

            {/* Notes for this date */}
            <div className="relative pl-8 ml-4 border-l-2 border-[#FFB4A2]/15 space-y-4">
              {grouped[dateKey].map((note: any) => {
                const time = new Date(note.createdAt || Date.now()).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                const isSelected = selectedNoteId === note.id;

                return (
                  <div
                    key={note.id}
                    onClick={() => onNoteClick(note.id)}
                    className={`relative cursor-pointer group transition-all duration-300 ${isSelected ? 'scale-[1.01]' : 'hover:scale-[1.01]'}`}
                  >
                    {/* Timeline dot */}
                    <div className={`absolute -left-[calc(2rem+5px)] top-4 w-2.5 h-2.5 rounded-full border-2 transition-all ${isSelected ? 'bg-[#FF8FA3] border-[#FF8FA3] shadow-[0_0_8px_rgba(255,143,163,0.5)]' : 'bg-white border-[#FFB4A2]/40 group-hover:border-[#FF8FA3]/60'}`} />

                    {/* Card */}
                    <div className={`p-4 rounded-2xl border transition-all ${isSelected ? 'bg-white border-[#FF8FA3]/30 shadow-lg shadow-pink-200/20' : 'bg-white/70 border-[#FFB4A2]/15 hover:bg-white hover:border-[#FF8FA3]/20 hover:shadow-md hover:shadow-pink-100/20'}`}>
                      {/* Time */}
                      <div className="flex items-center gap-1.5 mb-2">
                        <Clock className="w-3 h-3 text-[#5A3E4C]/30" />
                        <span className="text-[11px] text-[#5A3E4C]/40 font-medium">{time}</span>
                        {note.tags && note.tags.length > 0 && (
                          <div className="flex gap-1 ml-2">
                            {note.tags.slice(0, 3).map((tag: any) => (
                              <span
                                key={tag.id}
                                className="px-1.5 py-0.5 rounded-full text-[9px] font-medium text-white"
                                style={{ backgroundColor: tag.color || '#FF8FA3' }}
                              >
                                {tag.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Title */}
                      <h4 className="font-semibold text-sm text-[#4A2F3C] mb-1">{note.title || 'Untitled'}</h4>

                      {/* Content preview */}
                      <p className="text-xs text-[#5A3E4C]/50 line-clamp-2 leading-relaxed">
                        {note.content ? note.content.replace(/<[^>]*>/g, '').slice(0, 120) : 'Belum ada isi...'}
                      </p>

                      {/* Image thumbnail */}
                      {note.images && note.images.length > 0 && (
                        <div className="mt-2 flex gap-1.5">
                          {note.images.slice(0, 3).map((img: any) => (
                            <div key={img.id} className="w-12 h-12 rounded-lg overflow-hidden border border-[#FFB4A2]/10">
                              <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
