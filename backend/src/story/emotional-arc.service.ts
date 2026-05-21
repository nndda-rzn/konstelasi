import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Note } from '../entities/note.entity';
import { Story } from '../entities/story.entity';

// Emotional score mapping: -1 (negative) to 1 (positive)
const MOOD_SCORES: Record<string, number> = {
  happy: 0.8,
  excited: 0.9,
  peaceful: 0.6,
  hopeful: 0.7,
  romantic: 0.5,
  nostalgic: -0.2,
  melancholic: -0.5,
  sad: -0.8,
};

@Injectable()
export class EmotionalArcService {
  constructor(private readonly em: EntityManager) {}

  async getEmotionalArc(userId: string, storyId: string): Promise<any> {
    await this.em.findOneOrFail(Story, { id: storyId, user: { id: userId } });

    const notes = await this.em.find(Note, { story: { id: storyId } }, {
      orderBy: { createdAt: 'ASC' },
    });

    if (notes.length === 0) {
      return {
        dataPoints: [],
        overallMood: 'neutral',
        overallScore: 0,
        emotionalRange: 0,
        peaks: [],
        valleys: [],
        trend: 'stable',
      };
    }

    // Calculate emotional score for each node
    const dataPoints = notes.map((note, index) => {
      const mood = note.mood || 'neutral';
      const score = MOOD_SCORES[mood] ?? 0;
      return {
        index,
        nodeId: note.id,
        title: note.title || 'Untitled',
        mood,
        score,
        nodeType: note.storyNodeType || 'scene',
        createdAt: note.createdAt,
      };
    });

    // Calculate overall mood
    const scores = dataPoints.map(d => d.score);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const overallMood = avgScore > 0.3 ? 'positive' : avgScore < -0.3 ? 'negative' : 'mixed';

    // Emotional range (volatility)
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);
    const emotionalRange = maxScore - minScore;

    // Find peaks (local maxima) and valleys (local minima)
    const peaks: any[] = [];
    const valleys: any[] = [];
    for (let i = 1; i < dataPoints.length - 1; i++) {
      if (scores[i] > scores[i - 1] && scores[i] > scores[i + 1]) {
        peaks.push(dataPoints[i]);
      }
      if (scores[i] < scores[i - 1] && scores[i] < scores[i + 1]) {
        valleys.push(dataPoints[i]);
      }
    }

    // Determine trend (comparing first half vs second half)
    const mid = Math.floor(scores.length / 2);
    const firstHalf = scores.slice(0, mid).reduce((a, b) => a + b, 0) / mid;
    const secondHalf = scores.slice(mid).reduce((a, b) => a + b, 0) / (scores.length - mid);
    const trend = secondHalf - firstHalf > 0.2 ? 'rising' : secondHalf - firstHalf < -0.2 ? 'falling' : 'stable';

    return {
      dataPoints,
      overallMood,
      overallScore: Math.round(avgScore * 100) / 100,
      emotionalRange: Math.round(emotionalRange * 100) / 100,
      peaks: peaks.slice(0, 3),
      valleys: valleys.slice(0, 3),
      trend,
    };
  }
}
