import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Canvas } from '../entities/canvas.entity';
import { User } from '../entities/user.entity';
import { Note } from '../entities/note.entity';

@Injectable()
export class CanvasService {
  constructor(private readonly em: EntityManager) {}

  async getUserCanvases(userId: string): Promise<Canvas[]> {
    return this.em.find(
      Canvas,
      { user: { id: userId }, isArchived: false },
      { orderBy: { createdAt: 'ASC' } }
    );
  }

  async getCanvasById(userId: string, canvasId: string): Promise<Canvas> {
    return this.em.findOneOrFail(
      Canvas,
      { id: canvasId, user: { id: userId } }
    );
  }

  async createCanvas(userId: string, name: string, description?: string, parentId?: string): Promise<Canvas> {
    const user = await this.em.findOneOrFail(User, { id: userId });

    const canvasData: any = {
      name,
      description,
      user,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (parentId) {
      const parent = await this.em.findOneOrFail(Canvas, { id: parentId, user: { id: userId } });
      canvasData.parent = parent;
      canvasData.level = (parent.level || 0) + 1;
    }

    const canvas = this.em.create(Canvas, canvasData);
    await this.em.persistAndFlush(canvas);
    return canvas;
  }

  async updateCanvas(
    userId: string,
    canvasId: string,
    data: Partial<{ name: string; description: string }>
  ): Promise<Canvas> {
    const canvas = await this.em.findOneOrFail(
      Canvas,
      { id: canvasId, user: { id: userId } }
    );

    if (data.name !== undefined) canvas.name = data.name;
    if (data.description !== undefined) canvas.description = data.description;
    canvas.updatedAt = new Date();

    await this.em.flush();
    return canvas;
  }

  async deleteCanvas(userId: string, canvasId: string): Promise<boolean> {
    const canvas = await this.em.findOneOrFail(
      Canvas,
      { id: canvasId, user: { id: userId } }
    );

    // Option 1: Delete canvas and set notes' canvas to null (preserve notes)
    // Option 2: Cascade delete (delete notes too) - but we'll preserve notes for safety
    await this.em.nativeUpdate(Note, { canvas: { id: canvasId } }, { canvas: null });

    await this.em.removeAndFlush(canvas);
    return true;
  }

  async assignNoteToCanvas(
    userId: string,
    noteId: string,
    canvasId: string
  ): Promise<Note> {
    // Verify ownership
    const note = await this.em.findOneOrFail(
      Note,
      { id: noteId, user: { id: userId } }
    );

    const canvas = await this.em.findOneOrFail(
      Canvas,
      { id: canvasId, user: { id: userId } }
    );

    note.canvas = canvas;
    await this.em.flush();
    return note;
  }

  // Archive Feature
  async getUserCanvasesActive(userId: string): Promise<Canvas[]> {
    return this.em.find(
      Canvas,
      { user: { id: userId }, isArchived: false },
      { orderBy: { createdAt: 'ASC' } }
    );
  }

  async getArchivedCanvases(userId: string): Promise<Canvas[]> {
    return this.em.find(
      Canvas,
      { user: { id: userId }, isArchived: true },
      { orderBy: { archivedAt: 'DESC' } }
    );
  }

  async archiveCanvas(userId: string, canvasId: string): Promise<Canvas> {
    const canvas = await this.em.findOneOrFail(
      Canvas,
      { id: canvasId, user: { id: userId } }
    );
    canvas.isArchived = true;
    canvas.archivedAt = new Date();
    await this.em.flush();
    return canvas;
  }

  async unarchiveCanvas(userId: string, canvasId: string): Promise<Canvas> {
    const canvas = await this.em.findOneOrFail(
      Canvas,
      { id: canvasId, user: { id: userId } }
    );
    canvas.isArchived = false;
    canvas.archivedAt = undefined;
    await this.em.flush();
    return canvas;
  }

  // Nested Canvas Methods
  async getCanvasWithChildren(userId: string, canvasId: string): Promise<Canvas> {
    return this.em.findOneOrFail(
      Canvas,
      { id: canvasId, user: { id: userId } },
      { populate: ['children'] }
    );
  }

  async getChildCanvases(userId: string, parentId: string): Promise<Canvas[]> {
    return this.em.find(
      Canvas,
      { user: { id: userId }, parent: { id: parentId }, isArchived: false },
      { orderBy: { order: 'ASC', createdAt: 'ASC' } }
    );
  }

  async getRootCanvases(userId: string): Promise<Canvas[]> {
    return this.em.find(
      Canvas,
      { user: { id: userId }, parent: null, isArchived: false },
      { orderBy: { order: 'ASC', createdAt: 'ASC' } }
    );
  }

  async moveCanvas(userId: string, canvasId: string, newParentId?: string): Promise<Canvas> {
    const canvas = await this.em.findOneOrFail(
      Canvas,
      { id: canvasId, user: { id: userId } }
    );

    if (newParentId) {
      const newParent = await this.em.findOneOrFail(
        Canvas,
        { id: newParentId, user: { id: userId } }
      );
      canvas.parent = newParent;
      canvas.level = (newParent.level || 0) + 1;
    } else {
      canvas.parent = undefined;
      canvas.level = 0;
    }

    await this.em.flush();
    return canvas;
  }
}