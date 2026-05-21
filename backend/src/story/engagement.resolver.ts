import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { EngagementService } from './engagement.service';
import { StoryEngagement } from '../entities/story-engagement.entity';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class BadgeCount {
  @Field() type!: string;
  @Field(() => Int) count!: number;
}

@ObjectType()
export class StoryAnalytics {
  @Field(() => Int) totalViews!: number;
  @Field(() => Int) uniqueViewers!: number;
  @Field(() => Int) totalTimeSpent!: number;
  @Field(() => Int) totalBookmarks!: number;
  @Field(() => Int) totalBadges!: number;
  @Field(() => [BadgeCount]) badgeBreakdown!: BadgeCount[];
}

@Resolver()
@UseGuards(GqlAuthGuard)
export class EngagementResolver {
  constructor(private readonly engagementService: EngagementService) {}

  @Mutation(() => Boolean)
  async toggleBookmark(
    @CurrentUser() user: any,
    @Args('storyId') storyId: string,
    @Args('nodeId', { nullable: true }) nodeId?: string,
  ) {
    return this.engagementService.toggleBookmark(user.id, storyId, nodeId);
  }

  @Mutation(() => Boolean)
  async addBadge(
    @CurrentUser() user: any,
    @Args('storyId') storyId: string,
    @Args('nodeId') nodeId: string,
    @Args('badgeType') badgeType: string,
  ) {
    return this.engagementService.addBadge(user.id, storyId, nodeId, badgeType);
  }

  @Mutation(() => Boolean)
  async recordView(
    @CurrentUser() user: any,
    @Args('storyId') storyId: string,
    @Args('nodeId', { nullable: true }) nodeId?: string,
    @Args('timeSpent', { nullable: true }) timeSpent?: number,
  ) {
    await this.engagementService.recordView(user.id, storyId, nodeId, timeSpent || 0);
    return true;
  }

  @Query(() => [StoryEngagement])
  async getBookmarks(
    @CurrentUser() user: any,
    @Args('storyId') storyId: string,
  ) {
    return this.engagementService.getBookmarks(user.id, storyId);
  }

  @Query(() => StoryAnalytics)
  async getStoryAnalytics(
    @CurrentUser() user: any,
    @Args('storyId') storyId: string,
  ) {
    return this.engagementService.getStoryAnalytics(user.id, storyId);
  }
}
