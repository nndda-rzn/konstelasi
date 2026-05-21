import { Module } from '@nestjs/common';
import { StoryService } from './story.service';
import { StoryResolver } from './story.resolver';
import { EngagementService } from './engagement.service';
import { EngagementResolver } from './engagement.resolver';
import { StatisticsService } from './statistics.service';

@Module({
  providers: [StoryService, StoryResolver, EngagementService, EngagementResolver, StatisticsService],
  exports: [StoryService, EngagementService, StatisticsService],
})
export class StoryModule {}
