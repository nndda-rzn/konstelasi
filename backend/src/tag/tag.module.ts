import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Tag } from '../entities/tag.entity';
import { TagService } from './tag.service';
import { TagResolver } from './tag.resolver';

@Module({
  imports: [MikroOrmModule.forFeature([Tag])],
  providers: [TagService, TagResolver],
})
export class TagModule {}