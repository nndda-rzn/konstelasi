-- Migration: Add Archive, Writing Streak, and Nested Canvases features
-- Date: 2026-05-21

-- 1. Add archive columns to Note table
ALTER TABLE "note" ADD COLUMN IF NOT EXISTS "is_archived" boolean DEFAULT false;
ALTER TABLE "note" ADD COLUMN IF NOT EXISTS "archived_at" timestamptz;

-- 2. Add archive and nested canvas columns to Canvas table
ALTER TABLE "canvas" ADD COLUMN IF NOT EXISTS "is_archived" boolean DEFAULT false;
ALTER TABLE "canvas" ADD COLUMN IF NOT EXISTS "archived_at" timestamptz;
ALTER TABLE "canvas" ADD COLUMN IF NOT EXISTS "parent_id" uuid REFERENCES "canvas"("id") ON DELETE SET NULL;
ALTER TABLE "canvas" ADD COLUMN IF NOT EXISTS "level" integer DEFAULT 0;
ALTER TABLE "canvas" ADD COLUMN IF NOT EXISTS "order" integer DEFAULT 0;

-- 3. Create Writing Streak table
CREATE TABLE IF NOT EXISTS "writing_streak" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "current_streak" integer DEFAULT 0,
  "longest_streak" integer DEFAULT 0,
  "total_write_days" integer DEFAULT 0,
  "last_write_date" timestamptz,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT "writing_streak_user_unique" UNIQUE ("user_id")
);

-- 4. Create index for performance
CREATE INDEX IF NOT EXISTS "idx_note_is_archived" ON "note" ("is_archived");
CREATE INDEX IF NOT EXISTS "idx_canvas_is_archived" ON "canvas" ("is_archived");
CREATE INDEX IF NOT EXISTS "idx_canvas_parent_id" ON "canvas" ("parent_id");
CREATE INDEX IF NOT EXISTS "idx_writing_streak_user_id" ON "writing_streak" ("user_id");
