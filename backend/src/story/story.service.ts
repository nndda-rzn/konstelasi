import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Story, StoryType, StoryStatus, PrivacyLevel } from '../entities/story.entity';
import { StoryAccess, AccessLevel } from '../entities/story-access.entity';
import { Note } from '../entities/note.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class StoryService {
  constructor(private readonly em: EntityManager) {}

  async createStory(userId: string, input: {
    title: string;
    subtitle?: string;
    description?: string;
    coverImage?: string;
    storyType?: StoryType;
    theme?: string;
    authorNote?: string;
  }): Promise<Story> {
    const user = await this.em.findOneOrFail(User, { id: userId });
    const story = this.em.create(Story, {
      title: input.title,
      subtitle: input.subtitle,
      description: input.description,
      coverImage: input.coverImage,
      storyType: input.storyType || StoryType.CUSTOM,
      theme: input.theme,
      authorNote: input.authorNote,
      user,
      status: StoryStatus.DRAFT,
      privacyLevel: PrivacyLevel.PRIVATE,
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await this.em.persistAndFlush(story);
    return story;
  }

  async getStories(userId: string): Promise<Story[]> {
    return this.em.find(Story, { user: { id: userId } }, {
      orderBy: { updatedAt: 'DESC' },
    });
  }

  async getStory(userId: string, storyId: string): Promise<Story> {
    const story = await this.em.findOneOrFail(Story, { id: storyId, user: { id: userId } });
    const nodes = await this.em.find(Note, { story: { id: storyId } }, {
      populate: ['images', 'tags', 'outgoingEdges', 'outgoingEdges.source', 'outgoingEdges.target', 'incomingEdges', 'incomingEdges.source', 'incomingEdges.target'] as any,
    });
    (story as any).nodes = nodes;
    return story;
  }

  async getPublicStory(storyId: string): Promise<Story | null> {
    const story = await this.em.findOne(Story, { id: storyId }, {
      populate: ['nodes', 'user'],
    });
    if (!story) return null;
    if (story.privacyLevel === PrivacyLevel.PRIVATE) return null;
    return story;
  }

  async getAccessibleStory(userId: string, storyId: string): Promise<Story | null> {
    const story = await this.em.findOne(Story, { id: storyId }, {
      populate: ['nodes', 'user'],
    });
    if (!story) return null;
    if (story.user.id === userId) return story;
    if (story.privacyLevel === PrivacyLevel.PUBLIC) return story;
    if (story.privacyLevel === PrivacyLevel.FRIENDS_ONLY) {
      const access = await this.em.findOne(StoryAccess, {
        story: { id: storyId },
        grantedTo: { id: userId },
      });
      if (access) return story;
    }
    return null;
  }

  async updateStory(userId: string, storyId: string, input: {
    title?: string;
    subtitle?: string;
    description?: string;
    coverImage?: string;
    storyType?: StoryType;
    status?: StoryStatus;
    privacyLevel?: PrivacyLevel;
    theme?: string;
    authorNote?: string;
  }): Promise<Story> {
    const story = await this.em.findOneOrFail(Story, { id: storyId, user: { id: userId } });
    if (input.title !== undefined) story.title = input.title;
    if (input.subtitle !== undefined) story.subtitle = input.subtitle;
    if (input.description !== undefined) story.description = input.description;
    if (input.coverImage !== undefined) story.coverImage = input.coverImage;
    if (input.storyType !== undefined) story.storyType = input.storyType;
    if (input.status !== undefined) story.status = input.status;
    if (input.privacyLevel !== undefined) story.privacyLevel = input.privacyLevel;
    if (input.theme !== undefined) story.theme = input.theme;
    if (input.authorNote !== undefined) story.authorNote = input.authorNote;
    await this.em.flush();
    return story;
  }

  async deleteStory(userId: string, storyId: string): Promise<boolean> {
    const story = await this.em.findOneOrFail(Story, { id: storyId, user: { id: userId } });
    await this.em.removeAndFlush(story);
    return true;
  }

  // Access Control
  async grantAccess(userId: string, storyId: string, grantToEmail: string, level: AccessLevel): Promise<StoryAccess> {
    await this.em.findOneOrFail(Story, { id: storyId, user: { id: userId } });
    const grantedTo = await this.em.findOneOrFail(User, { email: grantToEmail });
    const existing = await this.em.findOne(StoryAccess, {
      story: { id: storyId },
      grantedTo: { id: grantedTo.id },
    });
    if (existing) {
      existing.accessLevel = level;
      await this.em.flush();
      return existing;
    }
    const access = this.em.create(StoryAccess, {
      story: this.em.getReference(Story, storyId),
      grantedTo,
      accessLevel: level,
      grantedAt: new Date(),
    });
    await this.em.persistAndFlush(access);
    return access;
  }

  async revokeAccess(userId: string, storyId: string, accessId: string): Promise<boolean> {
    await this.em.findOneOrFail(Story, { id: storyId, user: { id: userId } });
    const access = await this.em.findOneOrFail(StoryAccess, { id: accessId });
    await this.em.removeAndFlush(access);
    return true;
  }

  async getStoryAccess(userId: string, storyId: string): Promise<StoryAccess[]> {
    await this.em.findOneOrFail(Story, { id: storyId, user: { id: userId } });
    return this.em.find(StoryAccess, { story: { id: storyId } }, {
      populate: ['grantedTo'],
    });
  }

  // Story Nodes
  async addNodeToStory(userId: string, storyId: string, noteId: string, nodeType?: string, metadata?: string): Promise<Note> {
    await this.em.findOneOrFail(Story, { id: storyId, user: { id: userId } });
    const note = await this.em.findOneOrFail(Note, { id: noteId, user: { id: userId } });
    (note as any).story = this.em.getReference(Story, storyId);
    if (nodeType) note.storyNodeType = nodeType;
    if (metadata) note.storyMetadata = metadata;
    await this.em.flush();
    return note;
  }

  async removeNodeFromStory(userId: string, noteId: string): Promise<Note> {
    const note = await this.em.findOneOrFail(Note, { id: noteId, user: { id: userId } });
    (note as any).story = null;
    note.storyNodeType = undefined;
    note.storyMetadata = undefined;
    await this.em.flush();
    return note;
  }

  async toggleNodeLock(userId: string, noteId: string): Promise<Note> {
    const note = await this.em.findOneOrFail(Note, { id: noteId, user: { id: userId } });
    note.isLocked = !note.isLocked;
    await this.em.flush();
    return note;
  }
}
