import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { StreakService } from './streak.service';
import { WritingStreak } from '../entities/writing-streak.entity';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Resolver(() => WritingStreak)
@UseGuards(GqlAuthGuard)
export class StreakResolver {
  constructor(private readonly streakService: StreakService) {}

  @Query(() => WritingStreak)
  async getWritingStreak(@CurrentUser() user: any) {
    return this.streakService.getStreak(user.id);
  }

  @Mutation(() => WritingStreak)
  async recordWriteActivity(@CurrentUser() user: any) {
    return this.streakService.recordWriteActivity(user.id);
  }
}
