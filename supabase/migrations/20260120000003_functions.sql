-- Function to calculate current streak for a habit
CREATE OR REPLACE FUNCTION calculate_habit_streak(p_habit_id UUID)
RETURNS INTEGER AS $$
DECLARE
  streak_count INTEGER := 0;
  check_date DATE := CURRENT_DATE;
  has_log BOOLEAN;
BEGIN
  LOOP
    SELECT EXISTS (
      SELECT 1 FROM habit_logs 
      WHERE habit_id = p_habit_id 
      AND completed_date = check_date
    ) INTO has_log;
    
    EXIT WHEN NOT has_log;
    
    streak_count := streak_count + 1;
    check_date := check_date - INTERVAL '1 day';
  END LOOP;
  
  RETURN streak_count;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to get user weekly stats
CREATE OR REPLACE FUNCTION get_weekly_stats(p_user_id UUID)
RETURNS JSON AS $$
SELECT json_build_object(
  'total_focus_minutes', COALESCE(SUM(fs.duration_minutes), 0),
  'completed_sessions', COUNT(*) FILTER (WHERE fs.completed = true),
  'interrupted_sessions', COUNT(*) FILTER (WHERE fs.interrupted = true),
  'avg_session_minutes', ROUND(AVG(fs.duration_minutes), 0),
  'total_sessions', COUNT(*),
  'habit_completion_rate', (
    SELECT COALESCE(ROUND(
      COUNT(hl.*)::NUMERIC / NULLIF(
        (SELECT COUNT(*) FROM habits WHERE user_id = p_user_id AND archived = false) * 7,
        0
      ) * 100, 1
    ), 0)
    FROM habit_logs hl
    WHERE hl.user_id = p_user_id
    AND hl.completed_date >= CURRENT_DATE - INTERVAL '7 days'
  ),
  'active_habits', (
    SELECT COUNT(*) FROM habits WHERE user_id = p_user_id AND archived = false
  )
)
FROM focus_sessions fs
WHERE fs.user_id = p_user_id
AND fs.started_at >= CURRENT_DATE - INTERVAL '7 days';
$$ LANGUAGE sql STABLE;

-- Function to get daily session breakdown
CREATE OR REPLACE FUNCTION get_daily_breakdown(p_user_id UUID, p_days INTEGER DEFAULT 7)
RETURNS JSON AS $$
SELECT json_agg(
  json_build_object(
    'date', day::date,
    'total_minutes', COALESCE(SUM(duration_minutes), 0),
    'session_count', COUNT(fs.id)
  ) ORDER BY day DESC
)
FROM generate_series(
  CURRENT_DATE - (p_days - 1) * INTERVAL '1 day',
  CURRENT_DATE,
  INTERVAL '1 day'
) AS day
LEFT JOIN focus_sessions fs ON 
  DATE(fs.started_at) = day::date AND 
  fs.user_id = p_user_id AND
  fs.completed = true
GROUP BY day;
$$ LANGUAGE sql STABLE;

-- Function to check and award achievements
CREATE OR REPLACE FUNCTION check_achievements(p_user_id UUID)
RETURNS TABLE(achievement_code TEXT, achievement_name TEXT) AS $$
DECLARE
  v_total_focus_hours NUMERIC;
  v_max_streak INTEGER;
  v_total_sessions INTEGER;
  v_deep_work_count INTEGER;
  v_habit_count INTEGER;
BEGIN
  -- Calculate stats
  SELECT COALESCE(SUM(duration_minutes) / 60.0, 0) INTO v_total_focus_hours
  FROM focus_sessions WHERE user_id = p_user_id AND completed = true;
  
  SELECT COUNT(*) INTO v_total_sessions
  FROM focus_sessions WHERE user_id = p_user_id AND completed = true;
  
  SELECT COUNT(*) INTO v_deep_work_count
  FROM focus_sessions 
  WHERE user_id = p_user_id AND completed = true AND mode = 'deep_work';
  
  SELECT COUNT(*) INTO v_habit_count
  FROM habits WHERE user_id = p_user_id;

  -- Award first_session
  IF v_total_sessions >= 1 THEN
    INSERT INTO user_achievements (user_id, achievement_id)
    SELECT p_user_id, a.id FROM achievements a
    WHERE a.code = 'first_session'
    AND NOT EXISTS (
      SELECT 1 FROM user_achievements ua
      WHERE ua.user_id = p_user_id AND ua.achievement_id = a.id
    )
    ON CONFLICT DO NOTHING
    RETURNING (SELECT code FROM achievements WHERE id = achievement_id),
              (SELECT name FROM achievements WHERE id = achievement_id);
  END IF;

  -- Award focus hour milestones
  IF v_total_focus_hours >= 25 THEN
    INSERT INTO user_achievements (user_id, achievement_id)
    SELECT p_user_id, a.id FROM achievements a
    WHERE a.code = 'focus_25h'
    AND NOT EXISTS (
      SELECT 1 FROM user_achievements ua
      WHERE ua.user_id = p_user_id AND ua.achievement_id = a.id
    )
    ON CONFLICT DO NOTHING;
  END IF;

  IF v_total_focus_hours >= 100 THEN
    INSERT INTO user_achievements (user_id, achievement_id)
    SELECT p_user_id, a.id FROM achievements a
    WHERE a.code = 'focus_100h'
    AND NOT EXISTS (
      SELECT 1 FROM user_achievements ua
      WHERE ua.user_id = p_user_id AND ua.achievement_id = a.id
    )
    ON CONFLICT DO NOTHING;
  END IF;

  -- Award deep work master
  IF v_deep_work_count >= 10 THEN
    INSERT INTO user_achievements (user_id, achievement_id)
    SELECT p_user_id, a.id FROM achievements a
    WHERE a.code = 'deep_work'
    AND NOT EXISTS (
      SELECT 1 FROM user_achievements ua
      WHERE ua.user_id = p_user_id AND ua.achievement_id = a.id
    )
    ON CONFLICT DO NOTHING;
  END IF;

  -- Award habit collector
  IF v_habit_count >= 10 THEN
    INSERT INTO user_achievements (user_id, achievement_id)
    SELECT p_user_id, a.id FROM achievements a
    WHERE a.code = 'habit_collector'
    AND NOT EXISTS (
      SELECT 1 FROM user_achievements ua
      WHERE ua.user_id = p_user_id AND ua.achievement_id = a.id
    )
    ON CONFLICT DO NOTHING;
  END IF;

  -- Return newly awarded achievements
  RETURN QUERY
  SELECT a.code, a.name
  FROM user_achievements ua
  JOIN achievements a ON a.id = ua.achievement_id
  WHERE ua.user_id = p_user_id
  AND ua.unlocked_at > NOW() - INTERVAL '1 minute';
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-create user settings on profile creation
CREATE OR REPLACE FUNCTION create_user_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_profile_created
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_user_settings();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_habits_updated_at BEFORE UPDATE ON habits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
