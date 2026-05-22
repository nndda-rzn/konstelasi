'use client';

import { useState, useMemo } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface CalendarPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notes: any[];
  onNoteClick?: (noteId: string) => void;
}

export default function CalendarPanel({ isOpen, onClose, notes, onNoteClick }: CalendarPanelProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Group notes by date
  const notesByDate = useMemo(() => {
    const map: Record<string, any[]> = {};
    notes.forEach((note: any) => {
      const date = new Date(note.createdAt).toISOString().split('T')[0];
      if (!map[date]) map[date] = [];
      map[date].push(note);
    });
    return map;
  }, [notes]);

  // Calendar grid
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date().toISOString().split('T')[0];

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(d);
  }

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  // Heatmap intensity
  const getIntensity = (count: number) => {
    if (count === 0) return '';
    if (count === 1) return 'bg-[#FF8FA3]/20';
    if (count === 2) return 'bg-[#FF8FA3]/35';
    if (count <= 4) return 'bg-[#FF8FA3]/50';
    return 'bg-[#FF8FA3]/70';
  };

  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="absolute top-4 right-4 w-[380px] max-h-[85vh] bg-white/95 dark:bg-[#2a2438]/95 backdrop-blur-xl rounded-2xl border border-[#FFB4A2]/20 dark:border-[#FF8FA3]/10 shadow-[0_20px_60px_rgba(0,0,0,0.1)] z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#FFB4A2]/10 dark:border-[#FF8FA3]/10">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#FF8FA3]" />
          <h3 className="text-sm font-semibold text-[#4A2F3C] dark:text-[#e2d9f3]">Kalender</h3>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#FFB4A2]/10 transition-colors">
          <X className="w-4 h-4 text-[#5A3E4C]/60 dark:text-[#e2d9f3]/60" />
        </button>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between px-5 py-3">
        <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-[#FFB4A2]/10 transition-colors">
          <ChevronLeft className="w-4 h-4 text-[#5A3E4C]/60 dark:text-[#e2d9f3]/60" />
        </button>
        <span className="text-sm font-semibold text-[#4A2F3C] dark:text-[#e2d9f3]">
          {monthNames[month]} {year}
        </span>
        <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-[#FFB4A2]/10 transition-colors">
          <ChevronRight className="w-4 h-4 text-[#5A3E4C]/60 dark:text-[#e2d9f3]/60" />
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 px-4 pb-1">
        {dayNames.map((d) => (
          <div key={d} className="text-center text-[10px] font-medium text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 px-4 pb-4">
        {days.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />;
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const count = notesByDate[dateStr]?.length || 0;
          const isToday = dateStr === today;
          const isSelected = dateStr === selectedDate;

          return (
            <button
              key={dateStr}
              onClick={() => setSelectedDate(isSelected ? null : dateStr)}
              className={`relative aspect-square rounded-lg flex items-center justify-center text-xs transition-all
                ${getIntensity(count)}
                ${isToday ? 'ring-1 ring-[#FF8FA3] font-bold' : ''}
                ${isSelected ? 'ring-2 ring-[#FF8FA3] scale-110' : ''}
                ${count > 0 ? 'text-[#4A2F3C] dark:text-[#e2d9f3] cursor-pointer hover:scale-105' : 'text-[#5A3E4C]/30 dark:text-[#e2d9f3]/20'}
              `}
            >
              {day}
              {count > 0 && (
                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#FF8FA3]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Date Notes */}
      {selectedDate && notesByDate[selectedDate] && (
        <div className="border-t border-[#FFB4A2]/10 dark:border-[#FF8FA3]/10 p-3 max-h-[200px] overflow-y-auto custom-scrollbar">
          <p className="text-[10px] uppercase tracking-wider text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30 font-semibold mb-2 px-1">
            {new Date(selectedDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          <div className="space-y-1.5">
            {notesByDate[selectedDate].map((note: any) => (
              <button
                key={note.id}
                onClick={() => onNoteClick?.(note.id)}
                className="w-full text-left p-2.5 rounded-lg hover:bg-[#FFB4A2]/5 dark:hover:bg-[#FF8FA3]/5 transition-all"
              >
                <p className="text-xs font-medium text-[#4A2F3C] dark:text-[#e2d9f3] truncate">
                  {note.title || 'Untitled Note'}
                </p>
                {note.mood && (
                  <span className="text-[10px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30">{note.mood}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
