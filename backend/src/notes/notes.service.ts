import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Note } from '../entities/note.entity';
import { NoteLink } from '../entities/note-link.entity';
import { NoteImage } from '../entities/note-image.entity';
import { User } from '../entities/user.entity';
import { CreateNoteInput, UpdateNotePositionInput, UpdateNoteContentInput, CreateNoteLinkInput, AddNoteImageInput, UpdateNoteLinkInput } from './dto/note.input';

@Injectable()
export class NotesService {
  constructor(private readonly em: EntityManager) {}

  // Fetch all notes for a specific user, populating required relations
  async findAllByUser(userId: string): Promise<Note[]> {
    return this.em.find(
      Note,
      { user: { id: userId } },
      { populate: ['images', 'outgoingEdges', 'incomingEdges'] }
    );
  }

  async createNote(userId: string, input: CreateNoteInput): Promise<Note> {
    const user = await this.em.findOneOrFail(User, { id: userId });
    const note = this.em.create(Note, {
      title: input.title || 'New Note',
      positionX: input.positionX || 0,
      positionY: input.positionY || 0,
      user,
      type: 'default',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await this.em.persistAndFlush(note);
    return note;
  }

  async updatePosition(userId: string, input: UpdateNotePositionInput): Promise<Note> {
    const note = await this.em.findOneOrFail(Note, { id: input.id, user: { id: userId } });
    note.positionX = input.positionX;
    note.positionY = input.positionY;
    await this.em.flush();
    return note;
  }

  async updateContent(userId: string, input: UpdateNoteContentInput): Promise<Note> {
    const note = await this.em.findOneOrFail(Note, { id: input.id, user: { id: userId } });
    if (input.title !== undefined) note.title = input.title;
    if (input.content !== undefined) note.content = input.content;
    if (input.color !== undefined) note.color = input.color;
    await this.em.flush();
    return note;
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
}
