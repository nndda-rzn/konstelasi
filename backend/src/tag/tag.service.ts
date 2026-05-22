import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Tag } from '../entities/tag.entity';
import { User } from '../entities/user.entity';
import { Note } from '../entities/note.entity';

@Injectable()
export class TagService {
  constructor(private readonly em: EntityManager) {}

  async getUserTags(userId: string): Promise<Tag[]> {
    return this.em.find(
      Tag,
      { user: { id: userId } },
      { orderBy: { name: 'ASC' } }
    );
  }

  async getTagById(userId: string, tagId: string): Promise<Tag> {
    return this.em.findOneOrFail(
      Tag,
      { id: tagId, user: { id: userId } }
    );
  }

  async createTag(userId: string, name: string, color?: string, description?: string): Promise<Tag> {
    // Check if user already has a tag with this name (optional uniqueness constraint)
    const user = await this.em.findOneOrFail(User, { id: userId });

    const tag = this.em.create(Tag, {
      name,
      color,
      description,
      user,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.em.persistAndFlush(tag);
    return tag;
  }

  async updateTag(
    userId: string,
    tagId: string,
    data: Partial<{ name: string; color: string; description: string }>
  ): Promise<Tag> {
    const tag = await this.em.findOneOrFail(
      Tag,
      { id: tagId, user: { id: userId } }
    );

    if (data.name !== undefined) tag.name = data.name;
    if (data.color !== undefined) tag.color = data.color;
    if (data.description !== undefined) tag.description = data.description;
    tag.updatedAt = new Date();

    await this.em.flush();
    return tag;
  }

  async deleteTag(userId: string, tagId: string): Promise<boolean> {
    const tag = await this.em.findOneOrFail(
      Tag,
      { id: tagId, user: { id: userId } }
    );

    // Remove tag from all notes (many-to-many, MikroORM will handle via join table)
    await this.em.removeAndFlush(tag);
    return true;
  }

  async assignTagsToNote(
    userId: string,
    noteId: string,
    tagIds: string[]
  ): Promise<Note> {
    // Verify note ownership and populate tags
    const note = await this.em.findOneOrFail(
      Note,
      { id: noteId, user: { id: userId } },
      { populate: ['tags', 'images'] as any }
    );

    // Verify tags ownership and existence
    const tags = await this.em.find(
      Tag,
      { id: { $in: tagIds }, user: { id: userId } }
    );

    // Assign tags
    note.tags.set(tags);
    await this.em.flush();
    return note;
  }

  async removeTagFromNote(
    userId: string,
    noteId: string,
    tagId: string
  ): Promise<Note> {
    // Verify note ownership and populate tags
    const note = await this.em.findOneOrFail(
      Note,
      { id: noteId, user: { id: userId } },
      { populate: ['tags', 'images'] as any }
    );

    // Verify tag exists and belongs to user
    const tag = await this.em.findOneOrFail(
      Tag,
      { id: tagId, user: { id: userId } }
    );

    // Remove tag from note
    note.tags.remove(tag);
    await this.em.flush();
    return note;
  }
}