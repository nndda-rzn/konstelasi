import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Note } from '../entities/note.entity';
import { Story } from '../entities/story.entity';

@Injectable()
export class StatisticsService {
  constructor(private readonly em: EntityManager) {}

  async getWritingStatistics(userId: string, storyId: string): Promise<any> {
    await this.em.findOneOrFail(Story, { id: storyId, user: { id: userId } });

    const notes = await this.em.find(Note, { story: { id: storyId } }, {
      orderBy: { createdAt: 'ASC' },
    });

    // Basic counts
    const totalNodes = notes.length;
    const totalWords = notes.reduce((sum, n) => {
      const text = (n.content || '').replace(/<[^>]+>/g, '');
      return sum + text.split(/\s+/).filter((w: string) => w.length > 0).length;
    }, 0);
    const totalCharacters = notes.reduce((sum, n) => {
      return sum + (n.content || '').replace(/<[^>]+>/g, '').length;
    }, 0);

    // Node type breakdown
    const nodeTypeBreakdown: Record<string, number> = {};
    notes.forEach(n => {
      const t = n.storyNodeType || 'scene';
      nodeTypeBreakdown[t] = (nodeTypeBreakdown[t] || 0) + 1;
    });

    // Mood breakdown
    const moodBreakdown: Record<string, number> = {};
    notes.forEach(n => {
      if (n.mood) {
        moodBreakdown[n.mood] = (moodBreakdown[n.mood] || 0) + 1;
      }
    });

    // Most common mood
    const mostCommonMood = Object.entries(moodBreakdown)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || null;

    // Writing frequency (stories per day based on creation dates)
    const dates = notes.map(n => n.createdAt.toISOString().split('T')[0]);
    const uniqueDates = [...new Set(dates)];
    const writingDays = uniqueDates.length;

    // Average words per node
    const avgWordsPerNode = totalNodes > 0 ? Math.round(totalWords / totalNodes) : 0;

    // Longest node (by word count)
    let longestNode = { id: '', title: '', wordCount: 0 };
    notes.forEach(n => {
      const text = (n.content || '').replace(/<[^>]+>/g, '');
      const wc = text.split(/\s+/).filter((w: string) => w.length > 0).length;
      if (wc > longestNode.wordCount) {
        longestNode = { id: n.id, title: n.title || 'Untitled', wordCount: wc };
      }
    });

    // Reading time estimation (average 200 words per minute)
    const readingTimeMinutes = Math.ceil(totalWords / 200);

    // First and last write dates
    const firstWriteDate = notes.length > 0 ? notes[0].createdAt : null;
    const lastWriteDate = notes.length > 0 ? notes[notes.length - 1].createdAt : null;

    // Writing streak (consecutive days)
    const sortedDates = uniqueDates.sort();
    let currentStreak = 0;
    let maxStreak = 0;
    for (let i = 0; i < sortedDates.length; i++) {
      if (i === 0) {
        currentStreak = 1;
      } else {
        const prev = new Date(sortedDates[i - 1]);
        const curr = new Date(sortedDates[i]);
        const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
        if (diff === 1) {
          currentStreak++;
        } else {
          currentStreak = 1;
        }
      }
      maxStreak = Math.max(maxStreak, currentStreak);
    }

    return {
      totalNodes,
      totalWords,
      totalCharacters,
      avgWordsPerNode,
      readingTimeMinutes,
      writingDays,
      maxWritingStreak: maxStreak,
      nodeTypeBreakdown: Object.entries(nodeTypeBreakdown).map(([type, count]) => ({ type, count })),
      moodBreakdown: Object.entries(moodBreakdown).map(([mood, count]) => ({ mood, count })),
      mostCommonMood,
      longestNode,
      firstWriteDate,
      lastWriteDate,
    };
  }
}
