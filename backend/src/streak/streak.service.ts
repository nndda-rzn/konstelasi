import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { WritingStreak } from '../entities/writing-streak.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class StreakService {
  constructor(private readonly em: EntityManager) {}

  async getStreak(userId: string): Promise<WritingStreak> {
    let streak = await this.em.findOne(WritingStreak, { user: { id: userId } });
    if (!streak) {
      const user = await this.em.findOneOrFail(User, { id: userId });
      streak = this.em.create(WritingStreak, {
        user,
        currentStreak: 0,
        longestStreak: 0,
        totalWriteDays: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await this.em.persistAndFlush(streak);
    }
    return streak;
  }

  async recordWriteActivity(userId: string): Promise<WritingStreak> {
    let streak = await this.em.findOne(WritingStreak, { user: { id: userId } });
    
    if (!streak) {
      const user = await this.em.findOneOrFail(User, { id: userId });
      streak = this.em.create(WritingStreak, {
        user,
        currentStreak: 1,
        longestStreak: 1,
        totalWriteDays: 1,
        lastWriteDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await this.em.persistAndFlush(streak);
      return streak;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastWrite = streak.lastWriteDate ? new Date(streak.lastWriteDate) : null;
    if (lastWrite) {
      lastWrite.setHours(0, 0, 0, 0);
    }

    // Sudah menulis hari ini - skip
    if (lastWrite && lastWrite.getTime() === today.getTime()) {
      return streak;
    }

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (lastWrite && lastWrite.getTime() === yesterday.getTime()) {
      // Menulis berturut-turut - increment streak
      streak.currentStreak += 1;
    } else {
      // Gap lebih dari 1 hari - reset streak
      streak.currentStreak = 1;
    }

    // Update longest streak
    if (streak.currentStreak > streak.longestStreak) {
      streak.longestStreak = streak.currentStreak;
    }

    streak.totalWriteDays += 1;
    streak.lastWriteDate = new Date();

    await this.em.flush();
    return streak;
  }
}
