import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { StoryEngagement } from '../entities/story-engagement.entity';
import { Story } from '../entities/story.entity';
import { Note } from '../entities/note.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class EngagementService {
  constructor(private readonly em: EntityManager) {}

  async toggleBookmark(userId: string, storyId: string, nodeId?: string): Promise<boolean> {
    const existing = await this.em.findOne(StoryEngagement, {
      user: { id: userId },
      story: { id: storyId },
      node: nodeId ? { id: nodeId } : undefined,
      type: 'bookmark',
    });
    if (existing) {
      await this.em.removeAndFlush(existing);
      return false;
    }
    const engagement = this.em.create(StoryEngagement, {
      user: this.em.getReference(User, userId),
      story: this.em.getReference(Story, storyId),
      node: nodeId ? this.em.getReference(Note, nodeId) : undefined,
      type: 'bookmark',
      viewCount: 0,
      timeSpent: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await this.em.persistAndFlush(engagement);
    return true;
  }

  async addBadge(userId: string, storyId: string, nodeId: string, badgeType: string): Promise<boolean> {
    const existing = await this.em.findOne(StoryEngagement, {
      user: { id: userId },
      story: { id: storyId },
      node: { id: nodeId },
      type: 'badge',
      badgeType,
    });
    if (existing) {
      await this.em.removeAndFlush(existing);
      return false;
    }
    const engagement = this.em.create(StoryEngagement, {
      user: this.em.getReference(User, userId),
      story: this.em.getReference(Story, storyId),
      node: this.em.getReference(Note, nodeId),
      type: 'badge',
      badgeType,
      viewCount: 0,
      timeSpent: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await this.em.persistAndFlush(engagement);
    return true;
  }

  async recordView(userId: string, storyId: string, nodeId?: string, timeSpent?: number): Promise<void> {
    let engagement = await this.em.findOne(StoryEngagement, {
      user: { id: userId },
      story: { id: storyId },
      node: nodeId ? { id: nodeId } : undefined,
      type: 'view',
    });
    if (engagement) {
      engagement.viewCount += 1;
      if (timeSpent) engagement.timeSpent += timeSpent;
    } else {
      engagement = this.em.create(StoryEngagement, {
        user: this.em.getReference(User, userId),
        story: this.em.getReference(Story, storyId),
        node: nodeId ? this.em.getReference(Note, nodeId) : undefined,
        type: 'view',
        viewCount: 1,
        timeSpent: timeSpent || 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      this.em.persist(engagement);
    }
    await this.em.flush();
  }

  async getBookmarks(userId: string, storyId: string): Promise<StoryEngagement[]> {
    return this.em.find(StoryEngagement, {
      user: { id: userId },
      story: { id: storyId },
      type: 'bookmark',
    }, { populate: ['node'] });
  }

  async getNodeBadges(storyId: string, nodeId: string): Promise<{ badgeType: string; count: number }[]> {
    const badges = await this.em.find(StoryEngagement, {
      story: { id: storyId },
      node: { id: nodeId },
      type: 'badge',
    });
    const counts: Record<string, number> = {};
    badges.forEach(b => { counts[b.badgeType || ''] = (counts[b.badgeType || ''] || 0) + 1; });
    return Object.entries(counts).map(([badgeType, count]) => ({ badgeType, count }));
  }

  async getStoryAnalytics(userId: string, storyId: string): Promise<any> {
    await this.em.findOneOrFail(Story, { id: storyId, user: { id: userId } });
    const views = await this.em.find(StoryEngagement, { story: { id: storyId }, type: 'view' });
    const bookmarks = await this.em.find(StoryEngagement, { story: { id: storyId }, type: 'bookmark' });
    const badges = await this.em.find(StoryEngagement, { story: { id: storyId }, type: 'badge' });

    const totalViews = views.reduce((sum, v) => sum + v.viewCount, 0);
    const totalTimeSpent = views.reduce((sum, v) => sum + v.timeSpent, 0);
    const uniqueViewers = new Set(views.map(v => v.user.id)).size;

    const badgeCounts: Record<string, number> = {};
    badges.forEach(b => { badgeCounts[b.badgeType || ''] = (badgeCounts[b.badgeType || ''] || 0) + 1; });

    return {
      totalViews,
      uniqueViewers,
      totalTimeSpent,
      totalBookmarks: bookmarks.length,
      totalBadges: badges.length,
      badgeBreakdown: Object.entries(badgeCounts).map(([type, count]) => ({ type, count })),
    };
  }
}
