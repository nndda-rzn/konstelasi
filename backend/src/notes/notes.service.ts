import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Note } from '../entities/note.entity';
import { NoteLink } from '../entities/note-link.entity';
import { NoteImage } from '../entities/note-image.entity';
import { NoteVersion } from '../entities/note-version.entity';
import { User } from '../entities/user.entity';
import { Tag } from '../entities/tag.entity';
import { Canvas } from '../entities/canvas.entity';
import { CreateNoteInput, UpdateNotePositionInput, UpdateNoteContentInput, CreateNoteLinkInput, AddNoteImageInput, UpdateNoteLinkInput, UpdateNoteSizeInput, BatchUpdateNoteInput } from './dto/note.input';
import { StreakService } from '../streak/streak.service';

@Injectable()
export class NotesService {
  constructor(
    private readonly em: EntityManager,
    private readonly streakService: StreakService,
  ) {}

  // Fetch all notes for a specific user, with optional filters for canvas and tags
  async findAllByUser(
    userId: string,
    filters?: { canvasId?: string; tagIds?: string[] }
  ): Promise<Note[]> {
    const where: any = { user: { id: userId }, isArchived: false };

    if (filters?.canvasId) {
      where.canvas = { id: filters.canvasId };
    }

    if (filters?.tagIds?.length) {
      where.tags = { id: { $in: filters.tagIds } };
    }

    return this.em.find(
      Note,
      where,
      {
        populate: ['images', 'outgoingEdges', 'incomingEdges', 'canvas', 'tags']
      }
    );
  }

  async createNote(userId: string, input: CreateNoteInput): Promise<Note> {
    const user = await this.em.findOneOrFail(User, { id: userId });
    const noteData: any = {
      title: input.title || 'New Note',
      positionX: input.positionX || 0,
      positionY: input.positionY || 0,
      user,
      type: 'default',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Handle canvas assignment
    if (input.canvasId) {
      const canvas = await this.em.findOneOrFail(Canvas, { id: input.canvasId, user: { id: userId } });
      noteData.canvas = canvas;
    }

    // Handle tag assignment
    if (input.tagIds?.length) {
      const tags = await this.em.find(
        Tag,
        { id: { $in: input.tagIds }, user: { id: userId } }
      );
      noteData.tags = tags;
    }

    const note = this.em.create(Note, noteData);
    await this.em.persistAndFlush(note);
    
    // Record writing activity for streak
    await this.streakService.recordWriteActivity(userId);
    
    // Re-fetch with populated collections to avoid "not initialized" errors
    return this.em.findOneOrFail(Note, { id: note.id }, {
      populate: ['tags', 'images'] as any,
    });
  }

  async updatePosition(userId: string, input: UpdateNotePositionInput): Promise<Note> {
    const note = await this.em.findOneOrFail(Note, { id: input.id, user: { id: userId } });
    note.positionX = input.positionX;
    note.positionY = input.positionY;
    await this.em.flush();
    return note;
  }

  async updateContent(userId: string, input: UpdateNoteContentInput): Promise<Note> {
    const note = await this.em.findOneOrFail(Note, { id: input.id, user: { id: userId } }, {
      populate: ['tags', 'images'] as any,
    });
    
    // Save current state as version before updating
    if (input.content !== undefined && input.content !== note.content) {
      const lastVersion = await this.em.findOne(NoteVersion, { note }, { orderBy: { version: 'DESC' } });
      const nextVersion = (lastVersion?.version || 0) + 1;
      const version = this.em.create(NoteVersion, {
        note,
        title: note.title,
        content: note.content,
        color: note.color,
        mood: (note as any).mood,
        version: nextVersion,
        createdAt: new Date(),
      });
      await this.em.persistAndFlush(version);
    }

    if (input.title !== undefined) note.title = input.title;
    if (input.content !== undefined) note.content = input.content;
    if (input.color !== undefined) note.color = input.color;
    if (input.type !== undefined) note.type = input.type;
    if (input.mood !== undefined) (note as any).mood = input.mood;
    await this.em.flush();
    
    // Record writing activity for streak
    await this.streakService.recordWriteActivity(userId);
    
    return note;
  }

  async updateSize(userId: string, input: UpdateNoteSizeInput): Promise<Note> {
    const note = await this.em.findOneOrFail(Note, { id: input.id, user: { id: userId } });
    note.width = input.width;
    note.height = input.height;
    await this.em.flush();
    return note;
  }

  // Note Versioning
  async getNoteVersions(userId: string, noteId: string): Promise<NoteVersion[]> {
    await this.em.findOneOrFail(Note, { id: noteId, user: { id: userId } });
    return this.em.find(NoteVersion, { note: { id: noteId } }, { orderBy: { version: 'DESC' }, limit: 20 });
  }

  async restoreVersion(userId: string, versionId: string): Promise<Note> {
    const version = await this.em.findOneOrFail(NoteVersion, { id: versionId }, { populate: ['note'] });
    const note = await this.em.findOneOrFail(Note, { id: version.note.id, user: { id: userId } });
    
    if (version.title !== undefined) note.title = version.title!;
    if (version.content !== undefined) note.content = version.content;
    if (version.color !== undefined) note.color = version.color;
    if (version.mood !== undefined) (note as any).mood = version.mood;
    
    await this.em.flush();
    return note;
  }

  async batchUpdateNotes(userId: string, inputs: BatchUpdateNoteInput[]): Promise<Note[]> {
    const ids = inputs.map(i => i.id);
    const notes = await this.em.find(Note, { id: { $in: ids }, user: { id: userId } });
    
    for (const input of inputs) {
      const note = notes.find(n => n.id === input.id);
      if (note) {
        if (input.positionX !== undefined) note.positionX = input.positionX;
        if (input.positionY !== undefined) note.positionY = input.positionY;
        if (input.width !== undefined) note.width = input.width;
        if (input.height !== undefined) note.height = input.height;
      }
    }
    
    await this.em.flush();
    return notes;
  }

  async deleteNote(userId: string, noteId: string): Promise<boolean> {
    // Check if the user owns the note first
    await this.em.findOneOrFail(Note, { id: noteId, user: { id: userId } });

    // Explicitly manually cascade delete all related children
    // to bypass any PostgreSQL foreign key constraint issues if schema is outdated
    await this.em.nativeDelete(NoteLink, { source: { id: noteId } });
    await this.em.nativeDelete(NoteLink, { target: { id: noteId } });
    await this.em.nativeDelete(NoteImage, { note: { id: noteId } });

    // Delete the note itself
    await this.em.nativeDelete(Note, { id: noteId, user: { id: userId } });
    
    return true;
  }

  async createNoteLink(userId: string, input: CreateNoteLinkInput): Promise<NoteLink> {
    // Verify both source and target exist and belong to the user
    const source = await this.em.findOneOrFail(Note, { id: input.sourceId, user: { id: userId } });
    const target = await this.em.findOneOrFail(Note, { id: input.targetId, user: { id: userId } });

    // Check if link already exists (regardless of handles)
    const existing = await this.em.findOne(NoteLink, { source, target });
    if (existing) {
      existing.sourceHandle = input.sourceHandle;
      existing.targetHandle = input.targetHandle;
      await this.em.persistAndFlush(existing);
      return existing;
    }

    const link = this.em.create(NoteLink, {
      source,
      target,
      sourceHandle: input.sourceHandle,
      targetHandle: input.targetHandle,
      type: 'default',
      animated: false,
      createdAt: new Date(),
    });
    
    await this.em.persistAndFlush(link);
    return link;
  }

  async deleteNoteLink(userId: string, linkId: string): Promise<boolean> {
    // Ensure the link connects to notes owned by the user
    const link = await this.em.findOneOrFail(NoteLink, { id: linkId }, { populate: ['source'] });
    
    if (link.source.user.id !== userId) {
      throw new NotFoundException('NoteLink not found or not owned by user');
    }

    await this.em.removeAndFlush(link);
    return true;
  }

  async updateNoteLink(userId: string, input: UpdateNoteLinkInput): Promise<NoteLink> {
    const link = await this.em.findOneOrFail(NoteLink, { id: input.id }, { populate: ['source'] });
    
    // Check if the user owns the source note of this link
    if (link.source.user.id !== userId) {
      throw new NotFoundException('NoteLink not found or not owned by user');
    }

    if (input.label !== undefined) link.label = input.label;
    if (input.color !== undefined) link.color = input.color;

    await this.em.flush();
    return link;
  }

  async addNoteImage(userId: string, input: AddNoteImageInput): Promise<NoteImage> {
    const note = await this.em.findOneOrFail(Note, { id: input.noteId, user: { id: userId } });
    const user = await this.em.findOneOrFail(User, { id: userId });
    const image = this.em.create(NoteImage, {
      imageUrl: input.imageUrl,
      caption: input.caption,
      order: input.order || 0,
      note,
      user,
      createdAt: new Date(),
    });
    await this.em.persistAndFlush(image);
    return image;
  }

  async deleteNoteImage(userId: string, imageId: string): Promise<boolean> {
    const image = await this.em.findOneOrFail(NoteImage, { id: imageId, user: { id: userId } });
    await this.em.removeAndFlush(image);
    return true;
  }

  // Archive Feature
  async archiveNote(userId: string, noteId: string): Promise<Note> {
    const note = await this.em.findOneOrFail(Note, { id: noteId, user: { id: userId } });
    note.isArchived = true;
    note.archivedAt = new Date();
    await this.em.flush();
    return note;
  }

  async unarchiveNote(userId: string, noteId: string): Promise<Note> {
    const note = await this.em.findOneOrFail(Note, { id: noteId, user: { id: userId } });
    note.isArchived = false;
    note.archivedAt = undefined;
    await this.em.flush();
    return note;
  }

  async getArchivedNotes(userId: string, canvasId?: string): Promise<Note[]> {
    const where: any = { user: { id: userId }, isArchived: true };
    if (canvasId) {
      where.canvas = { id: canvasId };
    }
    return this.em.find(Note, where, {
      populate: ['images', 'canvas', 'tags'],
      orderBy: { archivedAt: 'DESC' }
    });
  }
}
