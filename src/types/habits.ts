// Week 3: Habit Tracking Types

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  category: HabitCategory;
  color: string;
  icon: string;
  frequency: HabitFrequency;
  target_days: number;
  created_at: string;
  updated_at: string;
  active: boolean;
  archived_at?: string;
}

export interface HabitCheckIn {
  id: string;
  habit_id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface HabitStreak {
  id: string;
  habit_id: string;
  user_id: string;
  start_date: string; // YYYY-MM-DD
  end_date?: string;
  count: number;
  is_active: boolean;
  created_at: string;
}

export interface HabitHistory {
  id: string;
  habit_id: string;
  user_id: string;
  month: string; // YYYY-MM-01
  completed_days: number;
  total_days: number;
  completion_rate: number; // 0-100
  created_at: string;
}

export type HabitCategory = 
  | 'health'
  | 'work'
  | 'learning'
  | 'wellness'
  | 'fitness'
  | 'mindfulness'
  | 'productivity'
  | 'social';

export type HabitFrequency = 
  | 'daily'
  | 'weekdays'
  | 'weekends'
  | 'weekly'
  | 'monthly';

export const HABIT_CATEGORIES: Record<HabitCategory, { label: string; color: string; icon: string }> = {
  health: { label: 'Health', color: '#ef4444', icon: 'heart' },
  work: { label: 'Work', color: '#3b82f6', icon: 'briefcase' },
  learning: { label: 'Learning', color: '#8b5cf6', icon: 'book-open' },
  wellness: { label: 'Wellness', color: '#ec4899', icon: 'sparkles' },
  fitness: { label: 'Fitness', color: '#f97316', icon: 'zap' },
  mindfulness: { label: 'Mindfulness', color: '#06b6d4', icon: 'meditation' },
  productivity: { label: 'Productivity', color: '#10b981', icon: 'target' },
  social: { label: 'Social', color: '#f59e0b', icon: 'users' },
};

export const HABIT_FREQUENCIES: Record<HabitFrequency, string> = {
  daily: 'Every Day',
  weekdays: 'Weekdays (Mon-Fri)',
  weekends: 'Weekends (Sat-Sun)',
  weekly: 'Once a Week',
  monthly: 'Once a Month',
};

export interface CreateHabitInput {
  name: string;
  description?: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  target_days?: number;
  color?: string;
  icon?: string;
}

export interface UpdateHabitInput extends Partial<CreateHabitInput> {
  id: string;
}

export interface HabitStats {
  total_habits: number;
  active_habits: number;
  completed_today: number;
  longest_streak: number;
  current_streak: number;
  completion_rate: number;
}

