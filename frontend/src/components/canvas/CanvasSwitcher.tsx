'use client';

import { useState } from 'react';
import { useCanvas } from '@/context/CanvasContext';
import { ChevronDown, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Canvas {
  id: string;
  name: string;
  description?: string | null;
}

export default function CanvasSwitcher() {
  const { canvases, selectedCanvasId, setSelectedCanvasId, createCanvas } = useCanvas();
  const router = useRouter();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [createName, setCreateName] = useState('');
  const [createDescription, setCreateDescription] = useState('');

  const handleSelectCanvas = (id: string) => {
    setSelectedCanvasId(id);
    setIsOpen(false);
    router.push('/');
  };

  const handleCreateCanvas = async () => {
    if (!createName.trim()) return;
    await createCanvas(createName, createDescription);
    setCreateModalOpen(false);
    setCreateName('');
    setCreateDescription('');
  };

  return (
    <div className="relative inline-block">
      {/* Canvas Switcher Button */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white/60 border border-[#FFB4A2]/15 rounded-xl hover:bg-white/80 transition-all cursor-pointer"
      >
        {selectedCanvasId ? (
          <>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#FFF5F0] text-[#FF8FA3] font-medium">
              {canvases.find(c => c.id === selectedCanvasId)?.name.charAt(0).toUpperCase() || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[#4A2F3C] font-medium truncate">{canvases.find(c => c.id === selectedCanvasId)?.name || 'Select Canvas'}</p>
            </div>
          </>
        ) : (
          <>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-100 text-gray-400 font-medium">
              ?
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[#4A2F3C] font-medium truncate">Select Canvas</p>
            </div>
          </>
        )}
        <ChevronDown className="w-4 h-4 text-[#5A3E4C]/40 transition-transform duration-200" />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
      <div className="absolute left-0 mt-2 w-56 bg-white/95 backdrop-blur-2xl shadow-2xl shadow-pink-200/30 border border-[#FFB4A2]/15 rounded-xl z-50">
        {/* Canvas List */}
        <div className="space-y-1">
          {canvases.map((canvas: Canvas) => (
            <div
              key={canvas.id}
              className={`flex items-center gap-3 p-3 rounded-xl border border-[#FFB4A2]/10 hover:border-[#FFB4A2]/25 transition-all cursor-pointer ${selectedCanvasId === canvas.id ? 'bg-[#FFF5F0]/80 shadow-inner' : ''}`}
              onClick={() => handleSelectCanvas(canvas.id)}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#FFF5F0] text-[#FF8FA3] font-medium">
                {canvas.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#4A2F3C] font-medium line-clamp-1">{canvas.name}</p>
                {canvas.description && (
                  <p className="text-[#5A3E4C]/40 text-xs line-clamp-1">{canvas.description}</p>
                )}
              </div>
              <div className="text-xs text-[#5A3E4C]/30">
                {selectedCanvasId === canvas.id ? 'Selected' : ''}
              </div>
            </div>
          ))}

          {canvases.length === 0 && (
            <div className="text-center py-4 text-[#5A3E4C]/40">
              <p>No canvases yet</p>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-[#FFB4A2]/15 my-3"></div>

        {/* New Canvas Button */}
        <div className="flex items-center justify-center px-4 py-3">
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#FFF5F0] border border-[#FFB4A2]/15 rounded-lg hover:bg-[#FFB4A2]/10 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Canvas</span>
          </button>
        </div>
      </div>
      )}

      {/* Create Canvas Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 bg-[#5A3E4C]/20 flex items-center justify-center z-50">
          <div className="bg-white/95 backdrop-blur-2xl shadow-2xl shadow-pink-200/30 rounded-xl w-[90%] max-w-md p-6 space-y-4">
            <h3 className="text-lg font-bold bg-gradient-to-r from-[#FF8FA3] to-[#FFB4A2] bg-clip-text text-transparent">New Canvas</h3>
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-[#5A3E4C]/40 uppercase tracking-wider mb-1">Canvas Name</label>
              <input
                type="text"
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                className="w-full bg-white/60 border border-[#FFB4A2]/20 rounded-xl text-[#4A2F3C] text-lg font-semibold px-4 py-3 placeholder-[#5A3E4C]/30 focus:outline-none focus:ring-2 focus:ring-[#FF8FA3]/30 focus:border-[#FF8FA3]/30 transition-all hover:bg-white/80"
                placeholder="My Thoughts Canvas"
                autoFocus
              />

              <label className="block text-xs font-semibold text-[#5A3E4C]/40 uppercase tracking-wider mb-1">Description (optional)</label>
              <textarea
                value={createDescription}
                onChange={(e) => setCreateDescription(e.target.value)}
                className="w-full bg-white/60 border border-[#FFB4A2]/20 rounded-xl text-[#4A2F3C] text-sm font-medium px-4 py-3 placeholder-[#5A3E4C]/30 focus:outline-none focus:ring-2 focus:ring-[#FF8FA3]/30 focus:border-[#FF8FA3]/30 transition-all hover:bg-white/80"
                rows={3}
                placeholder="What will you use this canvas for?"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setCreateModalOpen(false)}
                className="px-4 py-2 text-[#5A3E4C]/40 hover:text-[#5A3E4C]/60 hover:bg-[#FFB4A2]/10 rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCanvas}
                className="px-4 py-2 bg-gradient-to-r from-[#FF8FA3] to-[#FFB4A2] rounded-lg text-white font-medium hover:from-[#FF7A8A] hover:to-[#FF8FA3] transition-all shadow-sm"
                disabled={!createName.trim()}
              >
                Create Canvas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
