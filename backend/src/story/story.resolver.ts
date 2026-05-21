import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { StoryService } from './story.service';
import { StatisticsService } from './statistics.service';
import { Story, StoryType, StoryStatus, PrivacyLevel } from '../entities/story.entity';
import { StoryAccess, AccessLevel } from '../entities/story-access.entity';
import { Note } from '../entities/note.entity';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { InputType, Field, ObjectType, Int, Float } from '@nestjs/graphql';

@InputType()
export class CreateStoryInput {
  @Field() title!: string;
  @Field({ nullable: true }) subtitle?: string;
  @Field({ nullable: true }) description?: string;
  @Field({ nullable: true }) coverImage?: string;
  @Field(() => StoryType, { nullable: true }) storyType?: StoryType;
  @Field({ nullable: true }) theme?: string;
  @Field({ nullable: true }) authorNote?: string;
}

@InputType()
export class UpdateStoryInput {
  @Field() id!: string;
  @Field({ nullable: true }) title?: string;
  @Field({ nullable: true }) subtitle?: string;
  @Field({ nullable: true }) description?: string;
  @Field({ nullable: true }) coverImage?: string;
  @Field(() => StoryType, { nullable: true }) storyType?: StoryType;
  @Field(() => StoryStatus, { nullable: true }) status?: StoryStatus;
  @Field(() => PrivacyLevel, { nullable: true }) privacyLevel?: PrivacyLevel;
  @Field({ nullable: true }) theme?: string;
  @Field({ nullable: true }) authorNote?: string;
}

@ObjectType()
class NodeTypeCount {
  @Field() type!: string;
  @Field(() => Int) count!: number;
}

@ObjectType()
class MoodCount {
  @Field() mood!: string;
  @Field(() => Int) count!: number;
}

@ObjectType()
class LongestNodeInfo {
  @Field() id!: string;
  @Field() title!: string;
  @Field(() => Int) wordCount!: number;
}

@ObjectType()
class WritingStatistics {
  @Field(() => Int) totalNodes!: number;
  @Field(() => Int) totalWords!: number;
  @Field(() => Int) totalCharacters!: number;
  @Field(() => Int) avgWordsPerNode!: number;
  @Field(() => Int) readingTimeMinutes!: number;
  @Field(() => Int) writingDays!: number;
  @Field(() => Int) maxWritingStreak!: number;
  @Field(() => [NodeTypeCount]) nodeTypeBreakdown!: NodeTypeCount[];
  @Field(() => [MoodCount]) moodBreakdown!: MoodCount[];
  @Field({ nullable: true }) mostCommonMood?: string;
  @Field(() => LongestNodeInfo) longestNode!: LongestNodeInfo;
  @Field({ nullable: true }) firstWriteDate?: Date;
  @Field({ nullable: true }) lastWriteDate?: Date;
}

@Resolver(() => Story)
@UseGuards(GqlAuthGuard)
export class StoryResolver {
  constructor(
    private readonly storyService: StoryService,
    private readonly statisticsService: StatisticsService,
  ) {}

  @Query(() => [Story])
  async getStories(@CurrentUser() user: any) {
    return this.storyService.getStories(user.id);
  }

  @Query(() => Story)
  async getStory(@CurrentUser() user: any, @Args('id') id: string) {
    return this.storyService.getStory(user.id, id);
  }

  @Query(() => Story, { nullable: true })
  async getPublicStory(@Args('id') id: string) {
    return this.storyService.getPublicStory(id);
  }

  @Mutation(() => Story)
  async createStory(@CurrentUser() user: any, @Args('input') input: CreateStoryInput) {
    return this.storyService.createStory(user.id, input);
  }

  @Mutation(() => Story)
  async updateStory(@CurrentUser() user: any, @Args('input') input: UpdateStoryInput) {
    return this.storyService.updateStory(user.id, input.id, input);
  }

  @Mutation(() => Boolean)
  async deleteStory(@CurrentUser() user: any, @Args('id') id: string) {
    return this.storyService.deleteStory(user.id, id);
  }

  // Access Control
  @Mutation(() => StoryAccess)
  async grantStoryAccess(
    @CurrentUser() user: any,
    @Args('storyId') storyId: string,
    @Args('email') email: string,
    @Args('level', { type: () => AccessLevel, defaultValue: AccessLevel.VIEW }) level: AccessLevel,
  ) {
    return this.storyService.grantAccess(user.id, storyId, email, level);
  }

  @Mutation(() => Boolean)
  async revokeStoryAccess(
    @CurrentUser() user: any,
    @Args('storyId') storyId: string,
    @Args('accessId') accessId: string,
  ) {
    return this.storyService.revokeAccess(user.id, storyId, accessId);
  }

  @Query(() => [StoryAccess])
  async getStoryAccess(@CurrentUser() user: any, @Args('storyId') storyId: string) {
    return this.storyService.getStoryAccess(user.id, storyId);
  }

  // Story Nodes
  @Mutation(() => Note)
  async addNodeToStory(
    @CurrentUser() user: any,
    @Args('storyId') storyId: string,
    @Args('noteId') noteId: string,
    @Args('nodeType', { nullable: true }) nodeType?: string,
    @Args('metadata', { nullable: true }) metadata?: string,
  ) {
    return this.storyService.addNodeToStory(user.id, storyId, noteId, nodeType, metadata);
  }

  @Mutation(() => Note)
  async removeNodeFromStory(@CurrentUser() user: any, @Args('noteId') noteId: string) {
    return this.storyService.removeNodeFromStory(user.id, noteId);
  }

  @Mutation(() => Note)
  async toggleNodeLock(@CurrentUser() user: any, @Args('noteId') noteId: string) {
    return this.storyService.toggleNodeLock(user.id, noteId);
  }

  @Query(() => WritingStatistics)
  async getWritingStatistics(@CurrentUser() user: any, @Args('storyId') storyId: string) {
    return this.statisticsService.getWritingStatistics(user.id, storyId);
  }
}
