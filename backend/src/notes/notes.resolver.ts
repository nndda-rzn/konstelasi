import { Resolver, Query, Mutation, Args, Parent, ResolveField } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { NotesService } from './notes.service';
import { Note } from '../entities/note.entity';
import { NoteLink } from '../entities/note-link.entity';
import { NoteImage } from '../entities/note-image.entity';
import { NoteVersion } from '../entities/note-version.entity';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { CreateNoteInput, UpdateNotePositionInput, UpdateNoteContentInput, CreateNoteLinkInput, AddNoteImageInput, UpdateNoteLinkInput, UpdateNoteSizeInput, BatchUpdateNoteInput } from './dto/note.input';

@Resolver(() => Note)
@UseGuards(GqlAuthGuard)
export class NotesResolver {
  constructor(private readonly notesService: NotesService) {}

  private isTimeLocked(note: Note): boolean {
    return Boolean(note.unlockDate && note.unlockDate.getTime() > Date.now());
  }

  @ResolveField(() => String, { name: 'content', nullable: true })
  resolveContent(@Parent() note: Note): string | null {
    if (this.isTimeLocked(note)) return null;
    return note.content || null;
  }

  @ResolveField(() => [NoteImage], { name: 'images', nullable: 'itemsAndList' })
  async resolveImages(@Parent() note: Note): Promise<NoteImage[]> {
    if (this.isTimeLocked(note)) return [];
    if (!note.images.isInitialized()) await note.images.init();
    return note.images.getItems();
  }

  @Query(() => [Note])
  async getNotes(
    @CurrentUser() user: any,
    @Args('canvasId', { nullable: true }) canvasId?: string,
    @Args('tagIds', { type: () => [String], nullable: true }) tagIds?: string[]
  ) {
    return this.notesService.findAllByUser(user.id, { canvasId, tagIds });
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

  @Mutation(() => Note)
  async updateNoteSize(
    @CurrentUser() user: any,
    @Args('input') input: UpdateNoteSizeInput,
  ) {
    return this.notesService.updateSize(user.id, input);
  }

  @Mutation(() => [Note])
  async batchUpdateNotes(
    @CurrentUser() user: any,
    @Args('inputs', { type: () => [BatchUpdateNoteInput] }) inputs: BatchUpdateNoteInput[],
  ) {
    return this.notesService.batchUpdateNotes(user.id, inputs);
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

  // Archive Feature
  @Query(() => [Note])
  async getArchivedNotes(
    @CurrentUser() user: any,
    @Args('canvasId', { nullable: true }) canvasId?: string,
  ) {
    return this.notesService.getArchivedNotes(user.id, canvasId);
  }

  @Mutation(() => Note)
  async archiveNote(
    @CurrentUser() user: any,
    @Args('id') id: string,
  ) {
    return this.notesService.archiveNote(user.id, id);
  }

  @Mutation(() => Note)
  async unarchiveNote(
    @CurrentUser() user: any,
    @Args('id') id: string,
  ) {
    return this.notesService.unarchiveNote(user.id, id);
  }

  // Note Versioning
  @Query(() => [NoteVersion])
  async getNoteVersions(
    @CurrentUser() user: any,
    @Args('noteId') noteId: string,
  ) {
    return this.notesService.getNoteVersions(user.id, noteId);
  }

  @Mutation(() => Note)
  async restoreNoteVersion(
    @CurrentUser() user: any,
    @Args('versionId') versionId: string,
  ) {
    return this.notesService.restoreVersion(user.id, versionId);
  }
}
