import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Note } from '../entities/note.entity';
import { NoteLink } from '../entities/note-link.entity';
import { NoteImage } from '../entities/note-image.entity';
import { User } from '../entities/user.entity';
import { NotesService } from './notes.service';
import { NotesResolver } from './notes.resolver';
import { StreakModule } from '../streak/streak.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([Note, NoteLink, NoteImage, User]),
    StreakModule,
  ],
  providers: [NotesService, NotesResolver],
})
export class NotesModule {}
