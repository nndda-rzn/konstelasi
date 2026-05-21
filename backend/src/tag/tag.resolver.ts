import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TagService } from './tag.service';
import { Tag } from '../entities/tag.entity';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Resolver(() => Tag)
@UseGuards(GqlAuthGuard)
export class TagResolver {
  constructor(private readonly tagService: TagService) {}

  @Query(() => [Tag])
  async tags(@CurrentUser() user: any) {
    return this.tagService.getUserTags(user.id);
  }

  @Query(() => Tag)
  async tag(
    @CurrentUser() user: any,
    @Args('id') id: string,
  ) {
    return this.tagService.getTagById(user.id, id);
  }

  @Mutation(() => Tag)
  async createTag(
    @CurrentUser() user: any,
    @Args('name') name: string,
    @Args('color', { nullable: true }) color?: string,
    @Args('description', { nullable: true }) description?: string,
  ) {
    return this.tagService.createTag(user.id, name, color, description);
  }

  @Mutation(() => Tag)
  async updateTag(
    @CurrentUser() user: any,
    @Args('id') id: string,
    @Args('name', { nullable: true }) name?: string,
    @Args('color', { nullable: true }) color?: string,
    @Args('description', { nullable: true }) description?: string,
  ) {
    return this.tagService.updateTag(user.id, id, { name, color, description });
  }

  @Mutation(() => Boolean)
  async deleteTag(
    @CurrentUser() user: any,
    @Args('id') id: string,
  ) {
    return this.tagService.deleteTag(user.id, id);
  }

  @Mutation(() => Boolean)
  async assignTagsToNote(
    @CurrentUser() user: any,
    @Args('noteId') noteId: string,
    @Args('tagIds', { type: () => [String] }) tagIds: string[],
  ) {
    await this.tagService.assignTagsToNote(user.id, noteId, tagIds);
    return true;
  }

  @Mutation(() => Boolean)
  async removeTagFromNote(
    @CurrentUser() user: any,
    @Args('noteId') noteId: string,
    @Args('tagId') tagId: string,
  ) {
    await this.tagService.removeTagFromNote(user.id, noteId, tagId);
    return true;
  }
}