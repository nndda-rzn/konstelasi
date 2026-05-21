import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Note } from '../entities/note.entity';
import { Story } from '../entities/story.entity';

@Injectable()
export class MemoryTimelineService {
  constructor(private readonly em: EntityManager) {}

  async getMemoryTimeline(userId: string, storyId: string): Promise<any> {
    await this.em.findOneOrFail(Story, { id: storyId, user: { id: userId } });

    const notes = await this.em.find(Note, { story: { id: storyId } }, {
      orderBy: { createdAt: 'ASC' },
    });

    // Dual timeline: event date vs write date
    const timelineItems = notes.map(note => {
      const eventDate = note.eventDate || null;
      const writeDate = note.createdAt;
      const daysSinceEvent = eventDate
        ? Math.floor((new Date().getTime() - new Date(eventDate).getTime()) / (1000 * 60 * 60 * 24))
        : null;
      const daysSinceWritten = Math.floor((new Date().getTime() - writeDate.getTime()) / (1000 * 60 * 60 * 24));

      return {
        nodeId: note.id,
        title: note.title || 'Untitled',
        nodeType: note.storyNodeType || 'scene',
        mood: note.mood || null,
        eventDate,
        eventLocation: (note as any).eventLocation || null,
        writeDate,
        daysSinceEvent,
        daysSinceWritten,
        content: (note.content || '').replace(/<[^>]+>/g, '').slice(0, 100),
      };
    });

    // Sort by event date (items with event dates first, then by write date)
    const withEventDate = timelineItems
      .filter(i => i.eventDate)
      .sort((a, b) => new Date(a.eventDate!).getTime() - new Date(b.eventDate!).getTime());
    const withoutEventDate = timelineItems
      .filter(i => !i.eventDate)
      .sort((a, b) => a.writeDate.getTime() - b.writeDate.getTime());

    // Memory age analysis
    const oldestMemory = withEventDate.length > 0 ? withEventDate[0] : null;
    const newestMemory = withEventDate.length > 0 ? withEventDate[withEventDate.length - 1] : null;

    // Nostalgia factor: average days since event
    const avgDaysSinceEvent = withEventDate.length > 0
      ? Math.round(withEventDate.reduce((sum, i) => sum + (i.daysSinceEvent || 0), 0) / withEventDate.length)
      : 0;

    // Monthly distribution (when events happened)
    const monthlyDistribution: Record<string, number> = {};
    withEventDate.forEach(item => {
      const month = new Date(item.eventDate!).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
      monthlyDistribution[month] = (monthlyDistribution[month] || 0) + 1;
    });

    return {
      timelineItems: [...withEventDate, ...withoutEventDate],
      totalWithEventDate: withEventDate.length,
      totalWithoutEventDate: withoutEventDate.length,
      oldestMemory: oldestMemory ? { title: oldestMemory.title, eventDate: oldestMemory.eventDate, daysSince: oldestMemory.daysSinceEvent } : null,
      newestMemory: newestMemory ? { title: newestMemory.title, eventDate: newestMemory.eventDate, daysSince: newestMemory.daysSinceEvent } : null,
      avgDaysSinceEvent,
      monthlyDistribution: Object.entries(monthlyDistribution).map(([month, count]) => ({ month, count })),
    };
  }
}
