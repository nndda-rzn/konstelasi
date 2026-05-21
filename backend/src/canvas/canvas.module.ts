import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Canvas } from '../entities/canvas.entity';
import { CanvasService } from './canvas.service';
import { CanvasResolver } from './canvas.resolver';

@Module({
  imports: [MikroOrmModule.forFeature([Canvas])],
  providers: [CanvasService, CanvasResolver],
})
export class CanvasModule {}