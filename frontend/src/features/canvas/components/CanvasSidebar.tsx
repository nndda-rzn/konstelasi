'use client';

import { useState } from 'react';
import { useCanvas } from '@/context/CanvasContext';
import {
  ChevronRight,
  Plus,
  Trash2,
  Edit,
  Check,
  X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from '@/lib/toast';

interface Canvas {
  id: string;
  name: string;
  description?: string | null;
}

export default function CanvasSidebar() {
  const { canvases, selectedCanvasId, setSelectedCanvasId, createCanvas, updateCanvas, deleteCanvas } = useCanvas();
  const router = useRouter();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEditCanvasId, setSelectedEditCanvasId] = useState<string | null>(null);

  const [createName, setCreateName] = useState('');
  const [createDescription, setCreateDescription] = useState('');

  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const handleSelectCanvas = (id: string) => {
    setSelectedCanvasId(id);
    // Close sidebar on mobile? We'll leave it open for now, but could add logic to close on mobile
  };

  const handleCreateCanvas = async () => {
    if (!createName.trim()) return;
    await createCanvas(createName, createDescription);
    setCreateModalOpen(false);
    setCreateName('');
    setCreateDescription('');
    // Optionally select the newly created canvas
    // We'll rely on the refetch in the context to update the list, and we could select it if we had the ID
  };

  const handleUpdateCanvas = async () => {
    if (!selectedEditCanvasId || !editName.trim()) return;
    await updateCanvas(selectedEditCanvasId, editName, editDescription);
    setEditModalOpen(false);
    setSelectedEditCanvasId(null);
    setEditName('');
    setEditDescription('');
  };

  const handleDeleteCanvas = (id: string) => {
    toast('Hapus canvas ini? Catatan akan tetap ada di canvas default.', {
      action: {
        label: 'Hapus',
        onClick: async () => {
          await deleteCanvas(id);
        },
      },
    });
  };

  return (
    <div className="fixed top-0 left-0 h-full w-[280px] bg-white/95 backdrop-blur-2xl shadow-2xl shadow-pink-200/30 border-r border-[#FFB4A2]/15 z-50 flex flex-col pt-16 animate-slide-in-right overflow-y-auto">
      {/* Accent line */}
      <div className="absolute top-16 left-0 w-px h-full bg-gradient-to-br from-[#FF8FA3]/40 via-[#FFB4A2]/10 to-transparent" />

      {/* ── Header ── */}
      <div className="flex items-center justify-between p-5 border-b border-[#FFB4A2]/15">
        <h2 className="text-lg font-bold bg-gradient-to-r from-[#FF8FA3] to-[#FFB4A2] bg-clip-text text-transparent">Canvases</h2>
        <div className="flex gap-1.5">
          <button
            onClick={() => setCreateModalOpen(true)}
            className="p-2 text-[#5A3E4C]/30 hover:text-[#5A3E4C]/60 hover:bg-[#FFB4A2]/10 rounded-lg transition-all"
            title="New canvas"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Canvas List ── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {canvases.map((canvas: Canvas) => (
          <div
            key={canvas.id}
            className={`flex items-center gap-3 p-3 rounded-xl border border-[#FFB4A2]/10 hover:border-[#FFB4A2]/25 transition-all cursor-pointer group ${selectedCanvasId === canvas.id ? 'bg-[#FFF5F0]/80 shadow-inner' : ''}`}
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
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedEditCanvasId(canvas.id);
                  setEditName(canvas.name);
                  setEditDescription(canvas.description || '');
                  setEditModalOpen(true);
                }}
                className="p-1.5 text-[#5A3E4C]/30 hover:text-[#FF8FA3] hover:bg-[#FFB4A2]/10 rounded-lg transition-all"
                title="Edit canvas"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteCanvas(canvas.id);
                }}
                className="p-1.5 text-[#5A3E4C]/30 hover:text-[#FF6B9D] hover:bg-[#FF6B9D]/10 rounded-lg transition-all"
                title="Delete canvas"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {canvases.length === 0 && (
          <div className="text-center py-8 text-[#5A3E4C]/40">
            <p>No canvases yet</p>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="mt-3 px-4 py-2 bg-[#FFF5F0] border border-[#FFB4A2]/15 rounded-lg hover:bg-[#FFB4A2]/10 transition-all text-sm font-medium"
            >
              Create Your First Canvas
            </button>
          </div>
        )}
      </div>

      {/* ── Footer Actions ── */}
      <div className="pt-4 pb-6 border-t border-[#FFB4A2]/15">
        <button
          onClick={() => router.push('/')}
          className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium bg-[#FFF5F0] border border-[#FFB4A2]/15 rounded-lg hover:bg-[#FFB4A2]/10 transition-all"
        >
          Back to Canvas
        </button>
      </div>

      {/* ── Create Canvas Modal ── */}
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

      {/* ── Edit Canvas Modal ── */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-[#5A3E4C]/20 flex items-center justify-center z-50">
          <div className="bg-white/95 backdrop-blur-2xl shadow-2xl shadow-pink-200/30 rounded-xl w-[90%] max-w-md p-6 space-y-4">
            <h3 className="text-lg font-bold bg-gradient-to-r from-[#FF8FA3] to-[#FFB4A2] bg-clip-text text-transparent">Edit Canvas</h3>
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-[#5A3E4C]/40 uppercase tracking-wider mb-1">Canvas Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full bg-white/60 border border-[#FFB4A2]/20 rounded-xl text-[#4A2F3C] text-lg font-semibold px-4 py-3 placeholder-[#5A3E4C]/30 focus:outline-none focus:ring-2 focus:ring-[#FF8FA3]/30 focus:border-[#FF8FA3]/30 transition-all hover:bg-white/80"
              />

              <label className="block text-xs font-semibold text-[#5A3E4C]/40 uppercase tracking-wider mb-1">Description (optional)</label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full bg-white/60 border border-[#FFB4A2]/20 rounded-xl text-[#4A2F3C] text-sm font-medium px-4 py-3 placeholder-[#5A3E4C]/30 focus:outline-none focus:ring-2 focus:ring-[#FF8FA3]/30 focus:border-[#FF8FA3]/30 transition-all hover:bg-white/80"
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setEditModalOpen(false);
                  setSelectedEditCanvasId(null);
                  setEditName('');
                  setEditDescription('');
                }}
                className="px-4 py-2 text-[#5A3E4C]/40 hover:text-[#5A3E4C]/60 hover:bg-[#FFB4A2]/10 rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateCanvas}
                className="px-4 py-2 bg-gradient-to-r from-[#FF8FA3] to-[#FFB4A2] rounded-lg text-white font-medium hover:from-[#FF7A8A] hover:to-[#FF8FA3] transition-all shadow-sm"
                disabled={!editName.trim()}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}