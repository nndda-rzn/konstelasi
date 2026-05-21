import { PostgreSqlDriver, defineConfig } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';
import { User } from './entities/user.entity';
import { Note } from './entities/note.entity';
import { NoteImage } from './entities/note-image.entity';
import { NoteLink } from './entities/note-link.entity';
import { Tag } from './entities/tag.entity';
import { Canvas } from './entities/canvas.entity';
import { WritingStreak } from './entities/writing-streak.entity';
import { NoteVersion } from './entities/note-version.entity';
import { Story } from './entities/story.entity';
import { StoryAccess } from './entities/story-access.entity';
import { StoryEngagement } from './entities/story-engagement.entity';
import * as dotenv from 'dotenv';

// Load environment variables if not already loaded
dotenv.config();

export default defineConfig({
  driver: PostgreSqlDriver,
  clientUrl: process.env.DATABASE_URL,
  entities: [User, Note, NoteImage, NoteLink, Tag, Canvas, WritingStreak, NoteVersion, Story, StoryAccess, StoryEngagement],
  extensions: [Migrator],
  migrations: {
    path: './src/migrations',
  },
  allowGlobalContext: true,
  debug: process.env.NODE_ENV !== 'production',
});
