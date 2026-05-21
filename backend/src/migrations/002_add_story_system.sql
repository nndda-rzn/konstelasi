-- Migration: Add Story System Tables
-- Phase 1: Foundation & Core Story System

-- 1. Create Story table
CREATE TABLE IF NOT EXISTS "story" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" varchar(255) NOT NULL,
  "subtitle" varchar(255),
  "description" text,
  "cover_image" varchar(500),
  "story_type" varchar(50) NOT NULL DEFAULT 'custom',
  "status" varchar(50) NOT NULL DEFAULT 'draft',
  "privacy_level" varchar(50) NOT NULL DEFAULT 'private',
  "theme" varchar(100),
  "author_note" text,
  "user_id" uuid NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "is_archived" boolean NOT NULL DEFAULT false,
  "archived_at" timestamptz,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

-- 2. Create Story Access table
CREATE TABLE IF NOT EXISTS "story_access" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "story_id" uuid NOT NULL REFERENCES "story"("id") ON DELETE CASCADE,
  "granted_to_id" uuid NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "access_level" varchar(50) NOT NULL DEFAULT 'view',
  "granted_at" timestamptz NOT NULL DEFAULT now(),
  "expires_at" timestamptz
);

-- 3. Add story columns to Note table
ALTER TABLE "note" ADD COLUMN IF NOT EXISTS "story_id" uuid REFERENCES "story"("id") ON DELETE SET NULL;
ALTER TABLE "note" ADD COLUMN IF NOT EXISTS "story_node_type" varchar(50);
ALTER TABLE "note" ADD COLUMN IF NOT EXISTS "story_metadata" text;
ALTER TABLE "note" ADD COLUMN IF NOT EXISTS "is_locked" boolean NOT NULL DEFAULT false;

-- 4. Create indexes
CREATE INDEX IF NOT EXISTS "idx_story_user_id" ON "story" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_story_status" ON "story" ("status");
CREATE INDEX IF NOT EXISTS "idx_story_privacy" ON "story" ("privacy_level");
CREATE INDEX IF NOT EXISTS "idx_story_access_story_id" ON "story_access" ("story_id");
CREATE INDEX IF NOT EXISTS "idx_story_access_granted_to" ON "story_access" ("granted_to_id");
CREATE INDEX IF NOT EXISTS "idx_note_story_id" ON "note" ("story_id");
CREATE INDEX IF NOT EXISTS "idx_note_story_node_type" ON "note" ("story_node_type");
