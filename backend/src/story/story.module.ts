import { Module } from '@nestjs/common';
import { StoryService } from './story.service';
import { StoryResolver } from './story.resolver';
import { EngagementService } from './engagement.service';
import { EngagementResolver } from './engagement.resolver';
import { StatisticsService } from './statistics.service';
import { EmotionalArcService } from './emotional-arc.service';
import { MemoryTimelineService } from './memory-timeline.service';

@Module({
  providers: [StoryService, StoryResolver, EngagementService, EngagementResolver, StatisticsService, EmotionalArcService, MemoryTimelineService],
  exports: [StoryService, EngagementService, StatisticsService, EmotionalArcService, MemoryTimelineService],
})
export class StoryModule {}
