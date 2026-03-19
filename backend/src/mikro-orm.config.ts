import { PostgreSqlDriver, defineConfig } from '@mikro-orm/postgresql';
import { User } from './entities/user.entity';
import { Note } from './entities/note.entity';
import { NoteImage } from './entities/note-image.entity';
import { NoteLink } from './entities/note-link.entity';
import * as dotenv from 'dotenv';

// Load environment variables if not already loaded
dotenv.config();

export default defineConfig({
  driver: PostgreSqlDriver,
  // Ensure you set DATABASE_URL in your .env file
  // Example for Supabase: postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
  clientUrl: process.env.DATABASE_URL,
  entities: [User, Note, NoteImage, NoteLink],
  // Sync the database schema directly for development
  // In production, use migrations
  allowGlobalContext: true,
  debug: process.env.NODE_ENV !== 'production',
});
