export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  timezone?: string
  onboarded_at?: string
  pro_tier: boolean
  pro_expires_at?: string
  created_at: string
}

export interface Habit {
  id: string
  user_id: string
  name: string
  description?: string
  category: 'morning_ritual' | 'evening_ritual' | 'anytime'
  frequency: string
  target_days: number[]
  color: string
  icon: string
  archived: boolean
  position: number
  created_at: string
  updated_at: string
}

export interface HabitLog {
  id: string
  habit_id: string
  user_id: string
  completed_date: string
  completed_at: string
  notes?: string
}

export interface FocusSession {
  id: string
  user_id: string
  category: 'work' | 'study' | 'code' | 'creative' | 'reading'
  duration_minutes: number
  actual_duration?: number
  mode: 'pomodoro' | 'deep_work' | 'custom'
  started_at: string
  ended_at?: string
  completed: boolean
  interrupted: boolean
  linked_task_id?: string
  linked_task_title?: string
  ambient_sound?: string
  notes?: string
  created_at: string
}

export interface SessionMood {
  id: string
  session_id: string
  user_id: string
  mood_before?: number
  mood_after?: number
  energy_before?: number
  energy_after?: number
  tags?: string[]
  created_at: string
}

export interface UserSettings {
  user_id: string
  pomodoro_work_min: number
  pomodoro_break_min: number
  deep_work_min: number
  auto_start_breaks: boolean
  session_reminders: boolean
  habit_reminders: boolean
  reminder_time: string
  theme: 'light' | 'dark' | 'auto'
  color_scheme: string
  notion_token?: string
  todoist_token?: string
  calendar_connected: boolean
  created_at: string
  updated_at: string
}

export interface Achievement {
  id: string
  code: string
  name: string
  description?: string
  icon?: string
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  created_at: string
}

export interface UserAchievement {
  id: string
  user_id: string
  achievement_id: string
  unlocked_at: string
  achievement?: Achievement
}

export interface AIInsight {
  id: string
  user_id: string
  insight_type: 'weekly_summary' | 'pattern_detected' | 'suggestion' | 'burnout_warning'
  title: string
  content: string
  data?: Record<string, unknown>
  read: boolean
  created_at: string
}

export interface FocusRoom {
  id: string
  name: string
  created_by: string
  room_code: string
  is_public: boolean
  max_participants: number
  created_at: string
}

export interface RoomParticipant {
  id: string
  room_id: string
  user_id: string
  joined_at: string
  left_at?: string
  current_session_id?: string
}

export interface WeeklyStats {
  total_focus_minutes: number
  completed_sessions: number
  interrupted_sessions: number
  avg_session_minutes: number
  total_sessions: number
  habit_completion_rate: number
  active_habits: number
}

export interface DailyBreakdown {
  date: string
  total_minutes: number
  session_count: number
}
