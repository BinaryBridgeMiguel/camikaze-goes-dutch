-- ==========================================
-- Camikaze Goes Dutch - Supabase Schema
-- Run this in Supabase SQL Editor
-- ==========================================

-- Users table (simple auth with username/pin)
CREATE TABLE IF NOT EXISTS camikaze_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    pin_hash TEXT, -- Simple 4-digit pin (hashed)
    display_name TEXT DEFAULT 'Camikaze',
    avatar TEXT DEFAULT '🦊',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_active TIMESTAMPTZ DEFAULT NOW()
);

-- User progress (XP, levels, streaks)
CREATE TABLE IF NOT EXISTS camikaze_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES camikaze_users(id) ON DELETE CASCADE,
    level INTEGER DEFAULT 1,
    total_xp INTEGER DEFAULT 0,
    current_level_xp INTEGER DEFAULT 0,
    xp_to_next_level INTEGER DEFAULT 100,
    streak INTEGER DEFAULT 0,
    last_active_date DATE,
    
    -- Statistics
    total_exercises INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    lessons_completed INTEGER DEFAULT 0,
    flashcards_learned INTEGER DEFAULT 0,
    has_perfect_lesson BOOLEAN DEFAULT FALSE,
    studied_late_night BOOLEAN DEFAULT FALSE,
    total_study_time INTEGER DEFAULT 0, -- minutes
    
    -- Settings
    sound_enabled BOOLEAN DEFAULT TRUE,
    tts_enabled BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id)
);

-- Theme progress (0-100 per theme)
CREATE TABLE IF NOT EXISTS camikaze_theme_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES camikaze_users(id) ON DELETE CASCADE,
    theme_id TEXT NOT NULL,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, theme_id)
);

-- Themes explored (for achievements)
CREATE TABLE IF NOT EXISTS camikaze_themes_explored (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES camikaze_users(id) ON DELETE CASCADE,
    theme_id TEXT NOT NULL,
    first_explored_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, theme_id)
);

-- Exercise history (for weak point detection)
CREATE TABLE IF NOT EXISTS camikaze_exercise_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES camikaze_users(id) ON DELETE CASCADE,
    theme_id TEXT NOT NULL,
    exercise_type TEXT NOT NULL,
    item TEXT, -- Word or sentence
    correct BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Flashcard spaced repetition data
CREATE TABLE IF NOT EXISTS camikaze_flashcards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES camikaze_users(id) ON DELETE CASCADE,
    card_id TEXT NOT NULL, -- e.g., "horses:het paard"
    ease_factor DECIMAL(3,2) DEFAULT 2.50,
    interval_days INTEGER DEFAULT 1,
    repetitions INTEGER DEFAULT 0,
    next_review TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, card_id)
);

-- Achievements unlocked
CREATE TABLE IF NOT EXISTS camikaze_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES camikaze_users(id) ON DELETE CASCADE,
    achievement_id TEXT NOT NULL,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, achievement_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_progress_user ON camikaze_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_theme_progress_user ON camikaze_theme_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_exercise_history_user ON camikaze_exercise_history(user_id);
CREATE INDEX IF NOT EXISTS idx_exercise_history_correct ON camikaze_exercise_history(user_id, correct);
CREATE INDEX IF NOT EXISTS idx_flashcards_user ON camikaze_flashcards(user_id);
CREATE INDEX IF NOT EXISTS idx_flashcards_review ON camikaze_flashcards(user_id, next_review);
CREATE INDEX IF NOT EXISTS idx_achievements_user ON camikaze_achievements(user_id);

-- Enable Row Level Security
ALTER TABLE camikaze_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE camikaze_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE camikaze_theme_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE camikaze_themes_explored ENABLE ROW LEVEL SECURITY;
ALTER TABLE camikaze_exercise_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE camikaze_flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE camikaze_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies (allow all for anon key since we use simple auth)
-- Users can read/write their own data based on user_id passed in request

CREATE POLICY "Users can read own data" ON camikaze_users
    FOR SELECT USING (true);

CREATE POLICY "Users can insert" ON camikaze_users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own data" ON camikaze_users
    FOR UPDATE USING (true);

-- Progress policies
CREATE POLICY "Read own progress" ON camikaze_progress
    FOR SELECT USING (true);

CREATE POLICY "Insert progress" ON camikaze_progress
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Update own progress" ON camikaze_progress
    FOR UPDATE USING (true);

-- Theme progress policies
CREATE POLICY "Read theme progress" ON camikaze_theme_progress
    FOR SELECT USING (true);

CREATE POLICY "Insert theme progress" ON camikaze_theme_progress
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Update theme progress" ON camikaze_theme_progress
    FOR UPDATE USING (true);

-- Themes explored policies
CREATE POLICY "Read themes explored" ON camikaze_themes_explored
    FOR SELECT USING (true);

CREATE POLICY "Insert themes explored" ON camikaze_themes_explored
    FOR INSERT WITH CHECK (true);

-- Exercise history policies
CREATE POLICY "Read exercise history" ON camikaze_exercise_history
    FOR SELECT USING (true);

CREATE POLICY "Insert exercise history" ON camikaze_exercise_history
    FOR INSERT WITH CHECK (true);

-- Flashcard policies
CREATE POLICY "Read flashcards" ON camikaze_flashcards
    FOR SELECT USING (true);

CREATE POLICY "Insert flashcards" ON camikaze_flashcards
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Update flashcards" ON camikaze_flashcards
    FOR UPDATE USING (true);

-- Achievement policies
CREATE POLICY "Read achievements" ON camikaze_achievements
    FOR SELECT USING (true);

CREATE POLICY "Insert achievements" ON camikaze_achievements
    FOR INSERT WITH CHECK (true);

-- Function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_progress_timestamp
    BEFORE UPDATE ON camikaze_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_theme_progress_timestamp
    BEFORE UPDATE ON camikaze_theme_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_flashcards_timestamp
    BEFORE UPDATE ON camikaze_flashcards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Insert default user for Camille
INSERT INTO camikaze_users (username, display_name, avatar)
VALUES ('camille', 'Camikaze', '🦊')
ON CONFLICT (username) DO NOTHING;

-- Create her initial progress record
INSERT INTO camikaze_progress (user_id)
SELECT id FROM camikaze_users WHERE username = 'camille'
ON CONFLICT (user_id) DO NOTHING;

-- ==========================================
-- Done! The database is ready for Camikaze!
-- ==========================================
