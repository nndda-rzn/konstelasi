import { Module } from '@nestjs/common';
import { StreakService } from './streak.service';
import { StreakResolver } from './streak.resolver';

@Module({
  providers: [StreakService, StreakResolver],
  exports: [StreakService],
})
export class StreakModule {}
