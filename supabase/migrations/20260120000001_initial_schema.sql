-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USER PROFILES (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  timezone TEXT DEFAULT 'UTC',
  onboarded_at TIMESTAMP,
  pro_tier BOOLEAN DEFAULT false,
  pro_expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- HABITS
CREATE TABLE habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('morning_ritual', 'evening_ritual', 'anytime')) DEFAULT 'anytime',
  frequency TEXT DEFAULT 'daily',
  target_days JSONB DEFAULT '[1,2,3,4,5,6,7]',
  color TEXT DEFAULT '#6366F1',
  icon TEXT DEFAULT 'check',
  archived BOOLEAN DEFAULT false,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_habits_user_active ON habits(user_id, archived) WHERE archived = false;
CREATE INDEX idx_habits_position ON habits(user_id, position);

-- HABIT LOGS (for streak tracking)
CREATE TABLE habit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id UUID REFERENCES habits(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  completed_date DATE NOT NULL,
  completed_at TIMESTAMP DEFAULT NOW(),
  notes TEXT,
  UNIQUE(habit_id, completed_date)
);

CREATE INDEX idx_habit_logs_user_date ON habit_logs(user_id, completed_date DESC);
CREATE INDEX idx_habit_logs_habit_date ON habit_logs(habit_id, completed_date DESC);

-- FOCUS SESSIONS
CREATE TABLE focus_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('work', 'study', 'code', 'creative', 'reading')),
  duration_minutes INTEGER NOT NULL,
  actual_duration INTEGER,
  mode TEXT DEFAULT 'pomodoro' CHECK (mode IN ('pomodoro', 'deep_work', 'custom')),
  started_at TIMESTAMP NOT NULL,
  ended_at TIMESTAMP,
  completed BOOLEAN DEFAULT false,
  interrupted BOOLEAN DEFAULT false,
  linked_task_id TEXT,
  linked_task_title TEXT,
  ambient_sound TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sessions_user_date ON focus_sessions(user_id, started_at DESC);
CREATE INDEX idx_sessions_completed ON focus_sessions(user_id, completed);

-- SESSION MOODS (for AI analysis)
CREATE TABLE session_moods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES focus_sessions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  mood_before INTEGER CHECK (mood_before BETWEEN 1 AND 5),
  mood_after INTEGER CHECK (mood_after BETWEEN 1 AND 5),
  energy_before INTEGER CHECK (energy_before BETWEEN 1 AND 5),
  energy_after INTEGER CHECK (energy_after BETWEEN 1 AND 5),
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_session_moods_user ON session_moods(user_id, created_at DESC);

-- AI INSIGHTS
CREATE TABLE ai_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  insight_type TEXT NOT NULL CHECK (insight_type IN ('weekly_summary', 'pattern_detected', 'suggestion', 'burnout_warning')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  data JSONB,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_insights_user_unread ON ai_insights(user_id, read, created_at DESC);

-- FOCUS ROOMS (social feature)
CREATE TABLE focus_rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_by UUID REFERENCES profiles(id) NOT NULL,
  room_code TEXT UNIQUE NOT NULL,
  is_public BOOLEAN DEFAULT false,
  max_participants INTEGER DEFAULT 10,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_rooms_public ON focus_rooms(is_public, created_at DESC);
CREATE INDEX idx_rooms_code ON focus_rooms(room_code);

-- ROOM PARTICIPANTS
CREATE TABLE room_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES focus_rooms(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMP DEFAULT NOW(),
  left_at TIMESTAMP,
  current_session_id UUID REFERENCES focus_sessions(id),
  UNIQUE(room_id, user_id)
);

CREATE INDEX idx_room_participants_active ON room_participants(room_id, user_id) WHERE left_at IS NULL;

-- USER SETTINGS
CREATE TABLE user_settings (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  pomodoro_work_min INTEGER DEFAULT 25,
  pomodoro_break_min INTEGER DEFAULT 5,
  deep_work_min INTEGER DEFAULT 90,
  auto_start_breaks BOOLEAN DEFAULT true,
  session_reminders BOOLEAN DEFAULT true,
  habit_reminders BOOLEAN DEFAULT true,
  reminder_time TIME DEFAULT '09:00:00',
  theme TEXT DEFAULT 'auto' CHECK (theme IN ('light', 'dark', 'auto')),
  color_scheme TEXT DEFAULT 'indigo',
  notion_token TEXT,
  todoist_token TEXT,
  calendar_connected BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ACHIEVEMENTS
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  tier TEXT DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- USER ACHIEVEMENTS
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  achievement_id UUID REFERENCES achievements(id) NOT NULL,
  unlocked_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

CREATE INDEX idx_user_achievements ON user_achievements(user_id, unlocked_at DESC);

-- SYNC QUEUE (for offline-first)
CREATE TABLE sync_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  action_type TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  synced_at TIMESTAMP,
  failed_attempts INTEGER DEFAULT 0
);

CREATE INDEX idx_sync_queue_pending ON sync_queue(user_id, synced_at) WHERE synced_at IS NULL;

-- Seed initial achievements
INSERT INTO achievements (code, name, description, icon, tier) VALUES
  ('first_session', 'First Steps', 'Complete your first focus session', '🎯', 'bronze'),
  ('streak_7', 'Week Warrior', 'Maintain a 7-day habit streak', '🔥', 'bronze'),
  ('streak_30', 'Monthly Master', 'Maintain a 30-day habit streak', '⭐', 'silver'),
  ('focus_25h', '25 Hour Focus', 'Accumulate 25 hours of focus time', '⏰', 'silver'),
  ('focus_100h', 'Century Club', 'Accumulate 100 hours of focus time', '💯', 'gold'),
  ('early_bird', 'Early Bird', 'Start a session before 7 AM', '🌅', 'bronze'),
  ('night_owl', 'Night Owl', 'Complete a session after 10 PM', '🦉', 'bronze'),
  ('deep_work', 'Deep Work Master', 'Complete 10 deep work sessions (90+ min)', '🧠', 'gold'),
  ('habit_collector', 'Habit Collector', 'Create 10 different habits', '📚', 'silver'),
  ('perfect_week', 'Perfect Week', 'Complete all habits for 7 consecutive days', '✨', 'platinum');
