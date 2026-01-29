-- ==========================================
-- Camikaze Goes Dutch - Supabase Migration
-- Run this in your Supabase SQL Editor
-- ==========================================

-- Create the users table for Camikaze Goes Dutch
CREATE TABLE IF NOT EXISTS camikaze_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username TEXT DEFAULT 'Camikaze',
    avatar TEXT DEFAULT '🦊',
    level INTEGER DEFAULT 1,
    total_xp INTEGER DEFAULT 0,
    current_level_xp INTEGER DEFAULT 0,
    xp_to_next_level INTEGER DEFAULT 100,
    streak INTEGER DEFAULT 0,
    last_active_date TEXT,
    stats JSONB DEFAULT '{
        "totalExercises": 0,
        "correctAnswers": 0,
        "lessonsCompleted": 0,
        "themesExplored": [],
        "totalStudyTime": 0,
        "hasPerfectLesson": false,
        "studiedLateNight": false,
        "flashcardsLearned": 0
    }'::jsonb,
    theme_progress JSONB DEFAULT '{
        "horses": 0,
        "going-out": 0,
        "house": 0,
        "animals": 0,
        "music": 0,
        "bar-restaurant": 0,
        "grammar": 0
    }'::jsonb,
    exercise_history JSONB DEFAULT '[]'::jsonb,
    flashcards JSONB DEFAULT '{}'::jsonb,
    achievements JSONB DEFAULT '[]'::jsonb,
    settings JSONB DEFAULT '{
        "soundEnabled": true,
        "ttsEnabled": true
    }'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE camikaze_users ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read/write (simple app, no auth)
CREATE POLICY "Allow all operations" ON camikaze_users
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_camikaze_users_updated 
    ON camikaze_users(updated_at DESC);

-- ==========================================
-- Done! The app is ready to use.
-- ==========================================
