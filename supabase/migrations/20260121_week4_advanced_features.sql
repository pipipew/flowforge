-- Week 4: Advanced Features - Database Migrations
-- Created: January 21, 2026
-- Features: AI Insights, Social Sharing, Goal Setting

-- ============================================
-- 1. AI-POWERED INSIGHTS TABLES
-- ============================================

-- Insights table: Weekly AI-generated insights
CREATE TABLE IF NOT EXISTS insights (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_number INT NOT NULL,
  year INT NOT NULL,
  productivity_score FLOAT NOT NULL DEFAULT 0,
  mood_average FLOAT NOT NULL DEFAULT 0,
  burnout_risk FLOAT NOT NULL DEFAULT 0,
  key_insight TEXT,
  recommendations JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, week_number, year)
);

-- Habit patterns table: Pattern analysis per habit
CREATE TABLE IF NOT EXISTS habit_patterns (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  habit_id BIGINT NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  completion_rate FLOAT NOT NULL DEFAULT 0,
  average_streak INT NOT NULL DEFAULT 0,
  best_day_of_week VARCHAR(10),
  worst_day_of_week VARCHAR(10),
  seasonality VARCHAR(20),
  total_completions INT DEFAULT 0,
  total_attempts INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, habit_id)
);

-- Mood trends table: Track mood over time
CREATE TABLE IF NOT EXISTS mood_trends (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  average_mood INT NOT NULL,
  total_sessions INT DEFAULT 0,
  total_habits_completed INT DEFAULT 0,
  energy_level INT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, date)
);

-- ============================================
-- 2. SOCIAL SHARING & ACHIEVEMENTS TABLES
-- ============================================

-- Achievements table: Achievement definitions
CREATE TABLE IF NOT EXISTS achievements (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL, -- 'streak', 'consistency', 'productivity', 'social'
  icon_name VARCHAR(100),
  points INT DEFAULT 0,
  unlock_condition JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User achievements: Track which achievements users have unlocked
CREATE TABLE IF NOT EXISTS user_achievements (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id BIGINT NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlock_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  shared BOOLEAN DEFAULT FALSE,
  shared_date TIMESTAMP WITH TIME ZONE,
  view_count INT DEFAULT 0,
  UNIQUE(user_id, achievement_id)
);

-- Shares table: Track user shares for analytics
CREATE TABLE IF NOT EXISTS shares (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  share_type VARCHAR(50) NOT NULL, -- 'achievement', 'weekly_stats', 'streak', 'goal'
  share_data JSONB NOT NULL,
  share_url VARCHAR(255),
  views INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Leaderboard table: Weekly rankings
CREATE TABLE IF NOT EXISTS leaderboard (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_number INT NOT NULL,
  year INT NOT NULL,
  points INT DEFAULT 0,
  rank INT,
  productivity_score FLOAT DEFAULT 0,
  habits_completed INT DEFAULT 0,
  sessions_completed INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, week_number, year)
);

-- ============================================
-- 3. GOAL SETTING TABLES
-- ============================================

-- Goals table: User goals
CREATE TABLE IF NOT EXISTS goals (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category VARCHAR(50), -- 'habit', 'session', 'productivity', 'custom'
  target_metric VARCHAR(100),
  target_value INT NOT NULL,
  current_value INT DEFAULT 0,
  start_date DATE NOT NULL,
  target_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'completed', 'abandoned'
  priority INT DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Milestones table: Goal milestones
CREATE TABLE IF NOT EXISTS milestones (
  id BIGSERIAL PRIMARY KEY,
  goal_id BIGINT NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target_value INT,
  milestone_order INT DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  completed_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Goal progress table: Track progress updates
CREATE TABLE IF NOT EXISTS goal_progress (
  id BIGSERIAL PRIMARY KEY,
  goal_id BIGINT NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  value_change INT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Goal habits: Link goals to habits
CREATE TABLE IF NOT EXISTS goal_habits (
  id BIGSERIAL PRIMARY KEY,
  goal_id BIGINT NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  habit_id BIGINT NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(goal_id, habit_id)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Insights indexes
CREATE INDEX IF NOT EXISTS idx_insights_user_week ON insights(user_id, week_number, year);
CREATE INDEX IF NOT EXISTS idx_habit_patterns_user ON habit_patterns(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_trends_user_date ON mood_trends(user_id, date);

-- Social indexes
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_shares_user ON shares(user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_week ON leaderboard(week_number, year);

-- Goal indexes
CREATE INDEX IF NOT EXISTS idx_goals_user_status ON goals(user_id, status);
CREATE INDEX IF NOT EXISTS idx_milestones_goal ON milestones(goal_id);
CREATE INDEX IF NOT EXISTS idx_goal_progress_goal_date ON goal_progress(goal_id, date);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all new tables
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_habits ENABLE ROW LEVEL SECURITY;

-- Insights RLS: Users can only see their own insights
CREATE POLICY "Users can see own insights" ON insights
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own insights" ON insights
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Habit patterns RLS
CREATE POLICY "Users can see own habit patterns" ON habit_patterns
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own habit patterns" ON habit_patterns
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own habit patterns" ON habit_patterns
  FOR UPDATE USING (auth.uid() = user_id);

-- Mood trends RLS
CREATE POLICY "Users can see own mood trends" ON mood_trends
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own mood trends" ON mood_trends
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own mood trends" ON mood_trends
  FOR UPDATE USING (auth.uid() = user_id);

-- User achievements RLS
CREATE POLICY "Users can see all achievements" ON achievements
  FOR SELECT USING (TRUE);
CREATE POLICY "Users can see own user achievements" ON user_achievements
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own achievements" ON user_achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Shares RLS
CREATE POLICY "Users can see own shares" ON shares
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own shares" ON shares
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Leaderboard RLS: Public read, only server can write
CREATE POLICY "Anyone can see leaderboard" ON leaderboard
  FOR SELECT USING (TRUE);

-- Goals RLS
CREATE POLICY "Users can see own goals" ON goals
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own goals" ON goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goals" ON goals
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own goals" ON goals
  FOR DELETE USING (auth.uid() = user_id);

-- Milestones RLS: Through goal access
CREATE POLICY "Users can see own milestones" ON milestones
  FOR SELECT USING (goal_id IN (SELECT id FROM goals WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert own milestones" ON milestones
  FOR INSERT WITH CHECK (goal_id IN (SELECT id FROM goals WHERE user_id = auth.uid()));
CREATE POLICY "Users can update own milestones" ON milestones
  FOR UPDATE USING (goal_id IN (SELECT id FROM goals WHERE user_id = auth.uid()));

-- Goal progress RLS
CREATE POLICY "Users can see own goal progress" ON goal_progress
  FOR SELECT USING (goal_id IN (SELECT id FROM goals WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert own goal progress" ON goal_progress
  FOR INSERT WITH CHECK (goal_id IN (SELECT id FROM goals WHERE user_id = auth.uid()));

-- Goal habits RLS
CREATE POLICY "Users can see own goal habits" ON goal_habits
  FOR SELECT USING (goal_id IN (SELECT id FROM goals WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert own goal habits" ON goal_habits
  FOR INSERT WITH CHECK (goal_id IN (SELECT id FROM goals WHERE user_id = auth.uid()));

-- ============================================
-- MIGRATE UP COMPLETE
-- ============================================
