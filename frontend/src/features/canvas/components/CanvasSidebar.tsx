"use client";

import { useRouter } from "next/navigation";
import { useCanvasSidebar } from "./canvasSidebar/useCanvasSidebar";
import { CanvasSidebarHeader } from "./canvasSidebar/CanvasSidebarHeader";
import { CanvasList } from "./canvasSidebar/CanvasList";
import { CanvasFormModal } from "./canvasSidebar/CanvasFormModal";

export default function CanvasSidebar() {
  const router = useRouter();
  const s = useCanvasSidebar();

  return (
    <div className="fixed top-0 left-0 h-full w-[280px] bg-white/95 backdrop-blur-2xl shadow-2xl shadow-pink-200/30 border-r border-[#FFB4A2]/15 z-50 flex flex-col pt-16 animate-slide-in-right overflow-y-auto">
      <div className="absolute top-16 left-0 w-px h-full bg-gradient-to-br from-[#FF8FA3]/40 via-[#FFB4A2]/10 to-transparent" />

      <CanvasSidebarHeader onCreate={() => s.setCreateModalOpen(true)} />

      <CanvasList
        canvases={s.canvases}
        selectedId={s.selectedCanvasId}
        onSelect={s.setSelectedCanvasId}
        onEdit={s.openEdit}
        onDelete={s.handleDelete}
        onCreateFirst={() => s.setCreateModalOpen(true)}
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
