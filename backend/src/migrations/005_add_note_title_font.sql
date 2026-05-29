-- Add titleFont column to note table.
-- This allows users to customize the font family of each note's title,
-- with the value persisted on the server (sync across devices, exports,
-- versioning, sharing) instead of localStorage.
--
-- The column is nullable; null means "use the default UI font".
ALTER TABLE "note" ADD COLUMN IF NOT EXISTS "title_font" text NULL;
