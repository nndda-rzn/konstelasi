import { Module } from '@nestjs/common';
import { StoryService } from './story.service';
import { StoryResolver } from './story.resolver';
import { EngagementService } from './engagement.service';
import { EngagementResolver } from './engagement.resolver';
import { StatisticsService } from './statistics.service';
import { EmotionalArcService } from './emotional-arc.service';

@Module({
  providers: [StoryService, StoryResolver, EngagementService, EngagementResolver, StatisticsService, EmotionalArcService],
  exports: [StoryService, EngagementService, StatisticsService, EmotionalArcService],
})
export class StoryModule {}
