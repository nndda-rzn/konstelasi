import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { NotesService } from './notes.service';
import { Note } from '../entities/note.entity';
import { NoteLink } from '../entities/note-link.entity';
import { NoteImage } from '../entities/note-image.entity';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { CreateNoteInput, UpdateNotePositionInput, UpdateNoteContentInput, CreateNoteLinkInput, AddNoteImageInput, UpdateNoteLinkInput } from './dto/note.input';

@Resolver(() => Note)
@UseGuards(GqlAuthGuard)
export class NotesResolver {
  constructor(private readonly notesService: NotesService) {}

  @Query(() => [Note])
  async getNotes(@CurrentUser() user: any) {
    return this.notesService.findAllByUser(user.id);
  }

  @Mutation(() => Note)
  async createNote(
    @CurrentUser() user: any,
    @Args('input') input: CreateNoteInput,
  ) {
    return this.notesService.createNote(user.id, input);
  }

  @Mutation(() => Note)
  async updateNotePosition(
    @CurrentUser() user: any,
    @Args('input') input: UpdateNotePositionInput,
  ) {
    return this.notesService.updatePosition(user.id, input);
  }

  @Mutation(() => Note)
  async updateNoteContent(
    @CurrentUser() user: any,
    @Args('input') input: UpdateNoteContentInput,
  ) {
    return this.notesService.updateContent(user.id, input);
  }

  @Mutation(() => Boolean)
  async deleteNote(
    @CurrentUser() user: any,
    @Args('id') id: string,
  ) {
    return this.notesService.deleteNote(user.id, id);
  }

  @Mutation(() => NoteLink)
  async createNoteLink(
    @CurrentUser() user: any,
    @Args('input') input: CreateNoteLinkInput,
  ) {
    return this.notesService.createNoteLink(user.id, input);
  }

  @Mutation(() => NoteLink)
  async updateNoteLink(
    @CurrentUser() user: any,
    @Args('input') input: UpdateNoteLinkInput,
  ) {
    return this.notesService.updateNoteLink(user.id, input);
  }

  @Mutation(() => Boolean)
  async deleteNoteLink(
    @CurrentUser() user: any,
    @Args('id') id: string,
  ) {
    return this.notesService.deleteNoteLink(user.id, id);
  }

  @Mutation(() => NoteImage)
  async addNoteImage(
    @CurrentUser() user: any,
    @Args('input') input: AddNoteImageInput,
  ) {
    return this.notesService.addNoteImage(user.id, input);
  }

  @Mutation(() => Boolean)
  async deleteNoteImage(
    @CurrentUser() user: any,
    @Args('id') id: string,
  ) {
    return this.notesService.deleteNoteImage(user.id, id);
  }
}
