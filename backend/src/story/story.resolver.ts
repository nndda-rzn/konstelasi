import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { StoryService } from './story.service';
import { StatisticsService } from './statistics.service';
import { EmotionalArcService } from './emotional-arc.service';
import { MemoryTimelineService } from './memory-timeline.service';
import { VersionService } from './version.service';
import { CharacterService } from './character.service';
import { StoryVersion } from '../entities/story-version.entity';
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
  @Field(() => PrivacyLevel, { nullable: true }) privacyLevel?: PrivacyLevel;
  @Field({ nullable: true }) theme?: string;
  @Field({ nullable: true }) authorNote?: string;
  @Field({ nullable: true }) scrapbookTheme?: string;
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
  @Field({ nullable: true }) scrapbookTheme?: string;
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

@ObjectType()
class EmotionalDataPoint {
  @Field(() => Int) index!: number;
  @Field() nodeId!: string;
  @Field() title!: string;
  @Field() mood!: string;
  @Field(() => Float) score!: number;
  @Field() nodeType!: string;
  @Field() createdAt!: Date;
}

@ObjectType()
class EmotionalArc {
  @Field(() => [EmotionalDataPoint]) dataPoints!: EmotionalDataPoint[];
  @Field() overallMood!: string;
  @Field(() => Float) overallScore!: number;
  @Field(() => Float) emotionalRange!: number;
  @Field(() => [EmotionalDataPoint]) peaks!: EmotionalDataPoint[];
  @Field(() => [EmotionalDataPoint]) valleys!: EmotionalDataPoint[];
  @Field() trend!: string;
}

@ObjectType()
class MemoryTimelineItem {
  @Field() nodeId!: string;
  @Field() title!: string;
  @Field() nodeType!: string;
  @Field({ nullable: true }) mood?: string;
  @Field({ nullable: true }) eventDate?: Date;
  @Field({ nullable: true }) eventLocation?: string;
  @Field() writeDate!: Date;
  @Field(() => Int, { nullable: true }) daysSinceEvent?: number;
  @Field(() => Int) daysSinceWritten!: number;
  @Field() content!: string;
}

@ObjectType()
class MemoryInfo {
  @Field() title!: string;
  @Field() eventDate!: Date;
  @Field(() => Int) daysSince!: number;
}

@ObjectType()
class OnThisDayMemory {
  @Field() nodeId!: string;
  @Field() title!: string;
  @Field({ nullable: true }) content?: string;
  @Field() storyId!: string;
  @Field() storyTitle!: string;
  @Field({ nullable: true }) nodeType?: string;
  @Field({ nullable: true }) mood?: string;
  @Field() eventDate!: Date;
  @Field(() => Int) yearsAgo!: number;
  @Field({ nullable: true }) unlockDate?: Date;
  @Field(() => Boolean) isTimeLocked!: boolean;
}

@ObjectType()
class MonthlyCount {
  @Field() month!: string;
  @Field(() => Int) count!: number;
}

@ObjectType()
class MemoryTimeline {
  @Field(() => [MemoryTimelineItem]) timelineItems!: MemoryTimelineItem[];
  @Field(() => Int) totalWithEventDate!: number;
  @Field(() => Int) totalWithoutEventDate!: number;
  @Field(() => MemoryInfo, { nullable: true }) oldestMemory?: MemoryInfo;
  @Field(() => MemoryInfo, { nullable: true }) newestMemory?: MemoryInfo;
  @Field(() => Int) avgDaysSinceEvent!: number;
  @Field(() => [MonthlyCount]) monthlyDistribution!: MonthlyCount[];
}

@ObjectType()
class CharacterAppearance {
  @Field() nodeId!: string;
  @Field() title!: string;
  @Field() nodeType!: string;
  @Field({ nullable: true }) mood?: string;
  @Field() createdAt!: Date;
}

@ObjectType()
class CharacterInfo {
  @Field() nodeId!: string;
  @Field() name!: string;
  @Field() description!: string;
  @Field({ nullable: true }) mood?: string;
  @Field(() => Int) totalMentions!: number;
  @Field(() => Int) totalWords!: number;
  @Field(() => [MoodCount]) moodDistribution!: MoodCount[];
  @Field(() => [NodeTypeCount]) nodeTypesAppearing!: NodeTypeCount[];
  @Field(() => [CharacterAppearance]) appearances!: CharacterAppearance[];
  @Field() firstAppearance!: Date;
  @Field() lastAppearance!: Date;
}

@ObjectType()
class MostMentionedCharacter {
  @Field() name!: string;
  @Field(() => Int) mentions!: number;
}

@ObjectType()
class CharacterProfile {
  @Field(() => [CharacterInfo]) characters!: CharacterInfo[];
  @Field(() => Int) totalCharacters!: number;
  @Field(() => MostMentionedCharacter, { nullable: true }) mostMentioned?: MostMentionedCharacter;
}

@Resolver(() => Story)
@UseGuards(GqlAuthGuard)
export class StoryResolver {
  constructor(
    private readonly storyService: StoryService,
    private readonly statisticsService: StatisticsService,
    private readonly emotionalArcService: EmotionalArcService,
    private readonly memoryTimelineService: MemoryTimelineService,
    private readonly versionService: VersionService,
    private readonly characterService: CharacterService,
  ) {}

  @Query(() => [Story])
  async getStories(@CurrentUser() user: any) {
    return this.storyService.getStories(user.id);
  }

  @Query(() => Story)
  async getStory(@CurrentUser() user: any, @Args('id') id: string) {
    return this.storyService.getStory(user.id, id);
  }

  @Query(() => [OnThisDayMemory])
  async getOnThisDayMemories(@CurrentUser() user: any) {
    return this.storyService.getOnThisDayMemories(user.id);
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

  @Query(() => EmotionalArc)
  async getEmotionalArc(@CurrentUser() user: any, @Args('storyId') storyId: string) {
    return this.emotionalArcService.getEmotionalArc(user.id, storyId);
  }

  @Query(() => MemoryTimeline)
  async getMemoryTimeline(@CurrentUser() user: any, @Args('storyId') storyId: string) {
    return this.memoryTimelineService.getMemoryTimeline(user.id, storyId);
  }

  @Query(() => [StoryVersion])
  async getStoryVersions(@CurrentUser() user: any, @Args('storyId') storyId: string) {
    return this.versionService.getVersions(user.id, storyId);
  }

  @Query(() => StoryVersion)
  async getStoryVersion(@CurrentUser() user: any, @Args('versionId') versionId: string) {
    return this.versionService.getVersion(user.id, versionId);
  }

  @Mutation(() => StoryVersion)
  async createStoryVersion(
    @CurrentUser() user: any,
    @Args('storyId') storyId: string,
    @Args('label', { nullable: true }) label?: string,
    @Args('notes', { nullable: true }) notes?: string,
  ) {
    return this.versionService.createVersion(user.id, storyId, label, notes);
  }

  @Mutation(() => Boolean)
  async restoreStoryVersion(@CurrentUser() user: any, @Args('versionId') versionId: string) {
    return this.versionService.restoreVersion(user.id, versionId);
  }

  @Mutation(() => Boolean)
  async deleteStoryVersion(@CurrentUser() user: any, @Args('versionId') versionId: string) {
    return this.versionService.deleteVersion(user.id, versionId);
  }

  @Query(() => CharacterProfile)
  async getCharacterProfile(@CurrentUser() user: any, @Args('storyId') storyId: string) {
    return this.characterService.getCharacterProfile(user.id, storyId);
  }
}
