"use client";

import { useRouter } from "next/navigation";
import { Check, Edit, Plus, Trash2 } from "lucide-react";
import { useCanvasSidebar } from "./canvasSidebar/useCanvasSidebar";

export default function CanvasSidebar() {
  const router = useRouter();
  const s = useCanvasSidebar();

  return (
    <div className="fixed top-0 left-0 h-full w-[280px] bg-white/95 backdrop-blur-2xl shadow-2xl shadow-pink-200/30 border-r border-[#FFB4A2]/15 z-50 flex flex-col pt-16 animate-slide-in-right overflow-y-auto">
      <div className="absolute top-16 left-0 w-px h-full bg-gradient-to-br from-[#FF8FA3]/40 via-[#FFB4A2]/10 to-transparent" />

      <div className="flex items-center justify-between p-5 border-b border-[#FFB4A2]/15">
        <h2 className="text-lg font-bold bg-gradient-to-r from-[#FF8FA3] to-[#FFB4A2] bg-clip-text text-transparent">
          Canvases
        </h2>
        <div className="flex gap-1.5">
          <button
            onClick={() => s.setCreateModalOpen(true)}
            className="p-2 text-[#5A3E4C]/30 hover:text-[#5A3E4C]/60 hover:bg-[#FFB4A2]/10 rounded-lg transition-all"
            title="New canvas"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <CanvasList
        canvases={s.canvases}
        selectedId={s.selectedCanvasId}
        onSelect={s.setSelectedCanvasId}
        onEdit={s.openEdit}
        onDelete={s.handleDelete}
      />

      <div className="pt-4 pb-6 border-t border-[#FFB4A2]/15">
        <button
          onClick={() => router.push("/")}
          className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium bg-[#FFF5F0] border border-[#FFB4A2]/15 rounded-lg hover:bg-[#FFB4A2]/10 transition-all"
        >
          Back to Canvas
        </button>
      </div>

      {s.createModalOpen && (
        <CanvasFormModal
          mode="create"
          name={s.createName}
          description={s.createDescription}
          onNameChange={s.setCreateName}
          onDescriptionChange={s.setCreateDescription}
          onSubmit={s.handleCreate}
          onClose={() => s.setCreateModalOpen(false)}
        />
      )}

      {s.editModalOpen && (
        <CanvasFormModal
          mode="edit"
          name={s.editName}
          description={s.editDescription}
          onNameChange={s.setEditName}
          onDescriptionChange={s.setEditDescription}
          onSubmit={s.handleEdit}
          onClose={() => {
            s.setEditModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

function CanvasList({
  canvases,
  selectedId,
  onSelect,
  onEdit,
  onDelete,
}: {
  canvases: any[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onEdit: (canvas: any) => void;
  onDelete: (id: string, name: string) => void;
}) {
  if (canvases.length === 0) {
    return (
      <div className="text-center py-8 text-[#5A3E4C]/40">
        <p>No canvases yet</p>
        <EmptyStateCTA />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      {canvases.map((canvas) => (
        <CanvasItem
          key={canvas.id}
          canvas={canvas}
          isSelected={selectedId === canvas.id}
          onSelect={() => onSelect(canvas.id)}
          onEdit={() => onEdit(canvas)}
          onDelete={() => onDelete(canvas.id, canvas.name)}
        />
      ))}
    </div>
  );
}

function EmptyStateCTA() {
  // Lazy access via useCanvasSidebar in parent - simplified fallback
  return (
    <button
      onClick={() => {
        // Will be wired by parent via context if needed
        const event = new CustomEvent("canvas:create-request");
        window.dispatchEvent(event);
      }}
      className="mt-3 px-4 py-2 bg-[#FFF5F0] border border-[#FFB4A2]/15 rounded-lg hover:bg-[#FFB4A2]/10 transition-all text-sm font-medium"
    >
      Create Your First Canvas
    </button>
  );
}

function CanvasItem({
  canvas,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}: {
  canvas: any;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-xl border border-[#FFB4A2]/10 hover:border-[#FFB4A2]/25 transition-all cursor-pointer group ${
        isSelected ? "bg-[#FFF5F0]/80 shadow-inner" : ""
      }`}
      onClick={onSelect}
    >
      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#FFF5F0] text-[#FF8FA3] font-medium">
        {canvas.name.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[#4A2F3C] font-medium line-clamp-1">{canvas.name}</p>
        {canvas.description && (
          <p className="text-[#5A3E4C]/40 text-xs line-clamp-1">
            {canvas.description}
          </p>
        )}
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="p-1.5 text-[#5A3E4C]/30 hover:text-[#FF8FA3] hover:bg-[#FFB4A2]/10 rounded-lg transition-all"
          title="Edit canvas"
        >
          <Edit className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1.5 text-[#5A3E4C]/30 hover:text-[#FF6B9D] hover:bg-[#FF6B9D]/10 rounded-lg transition-all"
          title="Delete canvas"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

interface CanvasFormModalProps {
  mode: "create" | "edit";
  name: string;
  description: string;
  onNameChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

function CanvasFormModal({
  mode,
  name,
  description,
  onNameChange,
  onDescriptionChange,
  onSubmit,
  onClose,
}: CanvasFormModalProps) {
  const title = mode === "create" ? "New Canvas" : "Edit Canvas";
  const submitLabel = mode === "create" ? "Create Canvas" : "Save Changes";

  return (
    <div className="fixed inset-0 bg-[#5A3E4C]/20 flex items-center justify-center z-50">
      <div className="bg-white/95 backdrop-blur-2xl shadow-2xl shadow-pink-200/30 rounded-xl w-[90%] max-w-md p-6 space-y-4">
        <h3 className="text-lg font-bold bg-gradient-to-r from-[#FF8FA3] to-[#FFB4A2] bg-clip-text text-transparent">
          {title}
        </h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-[#5A3E4C]/40 uppercase tracking-wider mb-1">
              Canvas Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              className="w-full bg-white/60 border border-[#FFB4A2]/20 rounded-xl text-[#4A2F3C] text-lg font-semibold px-4 py-3 placeholder-[#5A3E4C]/30 focus:outline-none focus:ring-2 focus:ring-[#FF8FA3]/30 focus:border-[#FF8FA3]/30 transition-all hover:bg-white/80"
              placeholder="My Thoughts Canvas"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#5A3E4C]/40 uppercase tracking-wider mb-1">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              className="w-full bg-white/60 border border-[#FFB4A2]/20 rounded-xl text-[#4A2F3C] text-sm font-medium px-4 py-3 placeholder-[#5A3E4C]/30 focus:outline-none focus:ring-2 focus:ring-[#FF8FA3]/30 focus:border-[#FF8FA3]/30 transition-all hover:bg-white/80"
              rows={3}
              placeholder="What will you use this canvas for?"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[#5A3E4C]/40 hover:text-[#5A3E4C]/60 hover:bg-[#FFB4A2]/10 rounded-lg transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 bg-gradient-to-r from-[#FF8FA3] to-[#FFB4A2] rounded-lg text-white font-medium hover:from-[#FF7A8A] hover:to-[#FF8FA3] transition-all shadow-sm inline-flex items-center gap-1.5"
            disabled={!name.trim()}
          >
            {mode === "create" ? <Plus className="w-4 h-4" /> : <Check className="w-4 h-4" />}
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
