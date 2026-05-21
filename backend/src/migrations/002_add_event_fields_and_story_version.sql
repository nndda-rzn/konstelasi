-- Migration: Add eventDate, eventLocation to note table and create story_version table
-- Run this in Supabase SQL Editor

-- Add new columns to note table
ALTER TABLE note ADD COLUMN IF NOT EXISTS event_date TIMESTAMPTZ;
ALTER TABLE note ADD COLUMN IF NOT EXISTS event_location VARCHAR(255);

-- Create story_version table
CREATE TABLE IF NOT EXISTS story_version (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID NOT NULL REFERENCES story(id) ON DELETE CASCADE,
  version INTEGER NOT NULL DEFAULT 1,
  label VARCHAR(255),
  notes TEXT,
  snapshot TEXT NOT NULL,
  node_count INTEGER NOT NULL DEFAULT 0,
  word_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for faster version queries
CREATE INDEX IF NOT EXISTS idx_story_version_story_id ON story_version(story_id);
CREATE INDEX IF NOT EXISTS idx_story_version_version ON story_version(story_id, version DESC);
