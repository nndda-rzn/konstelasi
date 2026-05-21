import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CanvasService } from './canvas.service';
import { Canvas } from '../entities/canvas.entity';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Resolver(() => Canvas)
@UseGuards(GqlAuthGuard)
export class CanvasResolver {
  constructor(private readonly canvasService: CanvasService) {}

  @Query(() => [Canvas])
  async canvases(@CurrentUser() user: any) {
    return this.canvasService.getUserCanvases(user.id);
  }

  @Query(() => Canvas)
  async canvas(
    @CurrentUser() user: any,
    @Args('id') id: string,
  ) {
    return this.canvasService.getCanvasById(user.id, id);
  }

  @Mutation(() => Canvas)
  async createCanvas(
    @CurrentUser() user: any,
    @Args('name') name: string,
    @Args('description', { nullable: true }) description?: string,
    @Args('parentId', { nullable: true }) parentId?: string,
  ) {
    return this.canvasService.createCanvas(user.id, name, description, parentId);
  }

  @Mutation(() => Canvas)
  async updateCanvas(
    @CurrentUser() user: any,
    @Args('id') id: string,
    @Args('name', { nullable: true }) name?: string,
    @Args('description', { nullable: true }) description?: string,
  ) {
    return this.canvasService.updateCanvas(user.id, id, { name, description });
  }

  @Mutation(() => Boolean)
  async deleteCanvas(
    @CurrentUser() user: any,
    @Args('id') id: string,
  ) {
    return this.canvasService.deleteCanvas(user.id, id);
  }

  // Archive Feature
  @Query(() => [Canvas])
  async archivedCanvases(@CurrentUser() user: any) {
    return this.canvasService.getArchivedCanvases(user.id);
  }

  @Mutation(() => Canvas)
  async archiveCanvas(
    @CurrentUser() user: any,
    @Args('id') id: string,
  ) {
    return this.canvasService.archiveCanvas(user.id, id);
  }

  @Mutation(() => Canvas)
  async unarchiveCanvas(
    @CurrentUser() user: any,
    @Args('id') id: string,
  ) {
    return this.canvasService.unarchiveCanvas(user.id, id);
  }

  // Nested Canvas
  @Query(() => [Canvas])
  async childCanvases(
    @CurrentUser() user: any,
    @Args('parentId') parentId: string,
  ) {
    return this.canvasService.getChildCanvases(user.id, parentId);
  }

  @Query(() => [Canvas])
  async rootCanvases(@CurrentUser() user: any) {
    return this.canvasService.getRootCanvases(user.id);
  }

  @Mutation(() => Canvas)
  async moveCanvas(
    @CurrentUser() user: any,
    @Args('id') id: string,
    @Args('parentId', { nullable: true }) parentId?: string,
  ) {
    return this.canvasService.moveCanvas(user.id, id, parentId);
  }
}