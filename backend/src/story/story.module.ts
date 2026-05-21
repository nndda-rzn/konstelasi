import { Module } from '@nestjs/common';
import { StoryService } from './story.service';
import { StoryResolver } from './story.resolver';
import { EngagementService } from './engagement.service';
import { EngagementResolver } from './engagement.resolver';

@Module({
  providers: [StoryService, StoryResolver, EngagementService, EngagementResolver],
  exports: [StoryService, EngagementService],
})
export class StoryModule {}
