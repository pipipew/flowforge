import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// Helper functions for common queries
export const db = {
  // Profiles
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data
  },

  async updateProfile(userId: string, updates: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Habits
  async getHabits(userId: string, includeArchived = false) {
    let query = supabase
      .from('habits')
      .select('*')
      .eq('user_id', userId)
      .order('position', { ascending: true })
    
    if (!includeArchived) {
      query = query.eq('archived', false)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data
  },

  async createHabit(habit: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('habits')
      .insert(habit)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateHabit(habitId: string, updates: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('habits')
      .update(updates)
      .eq('id', habitId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deleteHabit(habitId: string) {
    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', habitId)
    
    if (error) throw error
  },

  // Habit Logs
  async getHabitLogs(userId: string, startDate?: string, endDate?: string) {
    let query = supabase
      .from('habit_logs')
      .select('*')
      .eq('user_id', userId)
      .order('completed_date', { ascending: false })
    
    if (startDate) query = query.gte('completed_date', startDate)
    if (endDate) query = query.lte('completed_date', endDate)
    
    const { data, error } = await query
    if (error) throw error
    return data
  },

  async toggleHabit(habitId: string, userId: string, date: string) {
    // Check if log exists
    const { data: existing } = await supabase
      .from('habit_logs')
      .select('id')
      .eq('habit_id', habitId)
      .eq('completed_date', date)
      .single()
    
    if (existing) {
      // Remove log
      const { error } = await supabase
        .from('habit_logs')
        .delete()
        .eq('id', existing.id)
      
      if (error) throw error
      return null
    } else {
      // Add log
      const { data, error } = await supabase
        .from('habit_logs')
        .insert({
          habit_id: habitId,
          user_id: userId,
          completed_date: date,
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    }
  },

  // Focus Sessions
  async createSession(session: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('focus_sessions')
      .insert(session)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateSession(sessionId: string, updates: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('focus_sessions')
      .update(updates)
      .eq('id', sessionId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getSessions(userId: string, limit = 30) {
    const { data, error } = await supabase
      .from('focus_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('started_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data
  },

  // User Settings
  async getSettings(userId: string) {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error) {
      // Settings don't exist, create default
      const { data: newSettings, error: createError } = await supabase
        .from('user_settings')
        .insert({ user_id: userId })
        .select()
        .single()
      
      if (createError) throw createError
      return newSettings
    }
    
    return data
  },

  async updateSettings(userId: string, updates: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('user_settings')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // RPC Functions
  async getWeeklyStats(userId: string) {
    const { data, error } = await supabase
      .rpc('get_weekly_stats', { p_user_id: userId })
    
    if (error) throw error
    return data
  },

  async getDailyBreakdown(userId: string, days = 7) {
    const { data, error } = await supabase
      .rpc('get_daily_breakdown', { 
        p_user_id: userId,
        p_days: days 
      })
    
    if (error) throw error
    return data
  },

  async calculateStreak(habitId: string) {
    const { data, error } = await supabase
      .rpc('calculate_habit_streak', { p_habit_id: habitId })
    
    if (error) throw error
    return data as number
  },

   // Session Stats
 async getSessionStats(userId: string) {
 const { data, error } = await supabase
 .from('focus_sessions')
 .select('*')
 .eq('user_id', userId)
 .order('started_at', { ascending: false })
 
 if (error) throw error
 
 // Calculate stats from sessions
 const totalSessions = data?.length || 0
 const totalMinutes = data?.reduce((sum: number, session: any) => sum + (session.duration_minutes || 0), 0) || 0
 const avgMood = data?.length ? data.reduce((sum: number, session: any) => sum + (session.mood_rating || 0), 0) / data.length : 0
 const completionRate = data?.length ? (data.filter((s: any) => s.completed).length / data.length) * 100 : 0
 
 return {
 totalSessions,
 totalMinutes,
 avgMood: Math.round(avgMood * 10) / 10,
 completionRate: Math.round(completionRate),
 }
 },
 async getUserSessions(userId: string, limit = 30, offset = 0) {
 const { data, error } = await supabase
 .from('focus_sessions')
 .select('*')
 .eq('user_id', userId)
 .order('started_at', { ascending: false })
 .range(offset, offset + limit - 1)
 
 if (error) throw error
 return data
 },
 async createSessionMood(sessionId: string, userId: string, moodData: Record<string, unknown>) {
 // Store mood check-in for a session
 const { data, error } = await supabase
 .from('session_moods')
 .insert({
 session_id: sessionId,
 user_id: userId,
 ...moodData,
 created_at: new Date().toISOString(),
 })
 .select()
 .single()
 
 if (error) throw error
 return data
 },
 async getSessionMoods(sessionId: string) {
 const { data, error } = await supabase
 .from('session_moods')
 .select('*')
 .eq('session_id', sessionId)
 .order('created_at', { ascending: false })
 
 if (error) throw error
 return data
 },
}
