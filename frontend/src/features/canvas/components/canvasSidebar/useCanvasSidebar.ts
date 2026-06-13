"use client";

import { useState } from "react";
import { useCanvas } from "@/context/CanvasContext";
import { toast } from "@/lib/toast";

/**
 * useCanvasSidebar - Manages canvas sidebar state + CRUD operations.
 * Handles: create/edit modal state, form inputs, delete confirmation.
 */
export const useCanvasSidebar = () => {
  const { canvases, selectedCanvasId, setSelectedCanvasId, createCanvas, updateCanvas, deleteCanvas } =
    useCanvas();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEditCanvasId, setSelectedEditCanvasId] = useState<string | null>(null);

  const [createName, setCreateName] = useState("");
  const [createDescription, setCreateDescription] = useState("");
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const resetCreate = () => {
    setCreateName("");
    setCreateDescription("");
  };

  const openEdit = (canvas: any) => {
    setSelectedEditCanvasId(canvas.id);
    setEditName(canvas.name);
    setEditDescription(canvas.description || "");
    setEditModalOpen(true);
  };

  const handleCreate = async () => {
    if (!createName.trim()) return;
    await createCanvas(createName, createDescription);
    setCreateModalOpen(false);
    resetCreate();
  };

  const handleEdit = async () => {
    if (!selectedEditCanvasId || !editName.trim()) return;
    await updateCanvas(selectedEditCanvasId, editName, editDescription);
    setEditModalOpen(false);
    setSelectedEditCanvasId(null);
  };

  const handleDelete = (id: string, name: string) => {
    toast(`Hapus canvas "${name}"? Semua note di dalamnya akan hilang.`, {
      action: {
        label: "Hapus",
        onClick: () => deleteCanvas(id),
      },
    });
  };

  return {
    canvases,
    selectedCanvasId,
    setSelectedCanvasId,
    createModalOpen,
    setCreateModalOpen,
    editModalOpen,
    setEditModalOpen,
    createName,
    setCreateName,
    createDescription,
    setCreateDescription,
    editName,
    setEditName,
    editDescription,
    setEditDescription,
    handleCreate,
    openEdit,
    handleEdit,
    handleDelete,
  };
};
