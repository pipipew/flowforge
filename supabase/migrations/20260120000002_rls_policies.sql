-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_moods ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_queue ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- HABITS POLICIES
CREATE POLICY "Users can view own habits" ON habits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own habits" ON habits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own habits" ON habits
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own habits" ON habits
  FOR DELETE USING (auth.uid() = user_id);

-- HABIT LOGS POLICIES
CREATE POLICY "Users can view own habit logs" ON habit_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own habit logs" ON habit_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own habit logs" ON habit_logs
  FOR DELETE USING (auth.uid() = user_id);

-- FOCUS SESSIONS POLICIES
CREATE POLICY "Users can view own sessions" ON focus_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sessions" ON focus_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON focus_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions" ON focus_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- SESSION MOODS POLICIES
CREATE POLICY "Users can view own moods" ON session_moods
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own moods" ON session_moods
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- AI INSIGHTS POLICIES
CREATE POLICY "Users can view own insights" ON ai_insights
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own insights" ON ai_insights
  FOR UPDATE USING (auth.uid() = user_id);

-- FOCUS ROOMS POLICIES
CREATE POLICY "Users can view public rooms" ON focus_rooms
  FOR SELECT USING (is_public = true OR created_by = auth.uid());

CREATE POLICY "Users can create rooms" ON focus_rooms
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Creators can update own rooms" ON focus_rooms
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Creators can delete own rooms" ON focus_rooms
  FOR DELETE USING (auth.uid() = created_by);

-- ROOM PARTICIPANTS POLICIES
CREATE POLICY "Users can view room participants" ON room_participants
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM focus_rooms
      WHERE focus_rooms.id = room_participants.room_id
      AND (focus_rooms.is_public = true OR focus_rooms.created_by = auth.uid())
    )
  );

CREATE POLICY "Users can join rooms" ON room_participants
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own participation" ON room_participants
  FOR UPDATE USING (auth.uid() = user_id);

-- USER SETTINGS POLICIES
CREATE POLICY "Users can view own settings" ON user_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON user_settings
  FOR UPDATE USING (auth.uid() = user_id);

-- ACHIEVEMENTS - Public read
CREATE POLICY "Anyone can view achievements" ON achievements
  FOR SELECT USING (true);

-- USER ACHIEVEMENTS POLICIES
CREATE POLICY "Users can view own achievements" ON user_achievements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert achievements" ON user_achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- SYNC QUEUE POLICIES
CREATE POLICY "Users can view own sync queue" ON sync_queue
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sync items" ON sync_queue
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sync items" ON sync_queue
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sync items" ON sync_queue
  FOR DELETE USING (auth.uid() = user_id);
