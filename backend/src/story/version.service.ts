import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Story } from '../entities/story.entity';
import { StoryVersion } from '../entities/story-version.entity';
import { Note } from '../entities/note.entity';

@Injectable()
export class VersionService {
  constructor(private readonly em: EntityManager) {}

  async createVersion(userId: string, storyId: string, label?: string, notes?: string): Promise<StoryVersion> {
    const story = await this.em.findOneOrFail(Story, { id: storyId, user: { id: userId } });
    const storyNotes = await this.em.find(Note, { story: { id: storyId } }, {
      orderBy: { createdAt: 'ASC' },
    });

    // Create snapshot of all nodes
    const snapshot = storyNotes.map(n => ({
      id: n.id,
      title: n.title,
      content: n.content,
      storyNodeType: n.storyNodeType,
      storyMetadata: n.storyMetadata,
      mood: n.mood,
      color: n.color,
      positionX: n.positionX,
      positionY: n.positionY,
      isLocked: n.isLocked,
      eventDate: (n as any).eventDate,
      eventLocation: (n as any).eventLocation,
      createdAt: n.createdAt,
    }));

    // Calculate word count
    const wordCount = storyNotes.reduce((sum, n) => {
      const text = (n.content || '').replace(/<[^>]+>/g, '');
      return sum + text.split(/\s+/).filter((w: string) => w.length > 0).length;
    }, 0);

    // Get next version number
    const lastVersion = await this.em.findOne(StoryVersion, { story: { id: storyId } }, { orderBy: { version: 'DESC' } });
    const nextVersion = (lastVersion?.version || 0) + 1;

    const version = this.em.create(StoryVersion, {
      story,
      version: nextVersion,
      label: label || `Version ${nextVersion}`,
      notes,
      snapshot: JSON.stringify(snapshot),
      nodeCount: storyNotes.length,
      wordCount,
      createdAt: new Date(),
    });

    await this.em.persistAndFlush(version);
    return version;
  }

  async getVersions(userId: string, storyId: string): Promise<StoryVersion[]> {
    await this.em.findOneOrFail(Story, { id: storyId, user: { id: userId } });
    return this.em.find(StoryVersion, { story: { id: storyId } }, {
      orderBy: { version: 'DESC' },
    });
  }

  async getVersion(userId: string, versionId: string): Promise<StoryVersion> {
    const version = await this.em.findOneOrFail(StoryVersion, { id: versionId }, { populate: ['story'] });
    // Verify ownership
    await this.em.findOneOrFail(Story, { id: version.story.id, user: { id: userId } });
    return version;
  }

  async restoreVersion(userId: string, versionId: string): Promise<boolean> {
    const version = await this.em.findOneOrFail(StoryVersion, { id: versionId }, { populate: ['story'] });
    const story = await this.em.findOneOrFail(Story, { id: version.story.id, user: { id: userId } });

    const snapshot = JSON.parse(version.snapshot);

    // Get current notes
    const currentNotes = await this.em.find(Note, { story: { id: story.id } });

    // Update existing notes or skip if not in snapshot
    for (const snapNode of snapshot) {
      const existing = currentNotes.find(n => n.id === snapNode.id);
      if (existing) {
        existing.title = snapNode.title;
        existing.content = snapNode.content;
        existing.storyNodeType = snapNode.storyNodeType;
        existing.storyMetadata = snapNode.storyMetadata;
        existing.mood = snapNode.mood;
        existing.color = snapNode.color;
        existing.positionX = snapNode.positionX;
        existing.positionY = snapNode.positionY;
        existing.isLocked = snapNode.isLocked;
      }
    }

    await this.em.flush();
    return true;
  }

  async deleteVersion(userId: string, versionId: string): Promise<boolean> {
    const version = await this.em.findOneOrFail(StoryVersion, { id: versionId }, { populate: ['story'] });
    await this.em.findOneOrFail(Story, { id: version.story.id, user: { id: userId } });
    await this.em.removeAndFlush(version);
    return true;
  }
}
