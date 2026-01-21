import { supabase } from './supabase';
import { HabitStreak } from '../types/habits';

/**
 * Habit Service - Business logic for habit tracking
 */

/**
 * Calculate or update streak for a habit
 * @param habitId - The habit ID
 * @param userId - The user ID
 * @returns Updated streak information
 */
export async function calculateStreak(habitId: string, userId: string) {
  try {
    // Get all check-ins for this habit, ordered by date
    const { data: checkins, error: checkinsError } = await supabase
      .from('habit_checkins')
      .select('date, completed')
      .eq('habit_id', habitId)
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (checkinsError) throw checkinsError;
    if (!checkins || checkins.length === 0) {
      return { count: 0, is_active: false, start_date: null, end_date: null };
    }

    // Find the active streak (from today going back)
    let streakCount = 0;
    let streakStartDate: string | null = null;
    let isActive = false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < checkins.length; i++) {
      const currentDate = new Date(checkins[i].date);
      currentDate.setHours(0, 0, 0, 0);

      if (checkins[i].completed) {
        if (streakCount === 0) {
          // First completed day in streak
          streakStartDate = checkins[i].date;
          streakCount = 1;
          isActive =
            currentDate.getTime() === today.getTime() ||
            (i > 0 &&
              new Date(checkins[i - 1].date).getTime() ===
                today.getTime());
        } else {
          // Check if consecutive
          const prevDate = new Date(checkins[i - 1].date);
          prevDate.setHours(0, 0, 0, 0);
          const expectedPrevDate = new Date(currentDate);
          expectedPrevDate.setDate(expectedPrevDate.getDate() + 1);

          if (prevDate.getTime() === expectedPrevDate.getTime()) {
            streakCount++;
            streakStartDate = checkins[i].date;
          } else {
            // Streak broken
            break;
          }
        }
      } else if (i === 0) {
        // First checkin today is not completed
        break;
      }
    }

    return {
      count: streakCount,
      is_active: isActive,
      start_date: streakStartDate,
      end_date: null,
    };
  } catch (error) {
    console.error('Error calculating streak:', error);
    throw error;
  }
}

/**
 * Update or create streak record in database
 */
export async function updateStreakRecord(
  habitId: string,
  userId: string,
  streak: any
) {
  try {
    if (streak.count === 0) {
      // No active streak, nothing to record
      return;
    }

    const { data, error } = await supabase
      .from('habit_streaks')
      .upsert(
        [
          {
            habit_id: habitId,
            user_id: userId,
            start_date: streak.start_date,
            count: streak.count,
            is_active: streak.is_active,
          },
        ],
        { onConflict: 'habit_id,start_date' }
      )
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating streak record:', error);
    throw error;
  }
}

/**
 * Calculate monthly habit completion stats
 */
export async function calculateMonthlyStats(
  habitId: string,
  userId: string,
  month: Date = new Date()
) {
  try {
    const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
    const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);

    const monthStartStr = monthStart.toISOString().split('T')[0];
    const monthEndStr = monthEnd.toISOString().split('T')[0];

    const { data: checkins, error } = await supabase
      .from('habit_checkins')
      .select('completed')
      .eq('habit_id', habitId)
      .eq('user_id', userId)
      .gte('date', monthStartStr)
      .lte('date', monthEndStr);

    if (error) throw error;

    const completedDays = checkins?.filter((c) => c.completed).length || 0;
    const totalDays = monthEnd.getDate();
    const completionRate = (completedDays / totalDays) * 100;

    return {
      month: monthStartStr,
      completed_days: completedDays,
      total_days: totalDays,
      completion_rate: Math.round(completionRate),
    };
  } catch (error) {
    console.error('Error calculating monthly stats:', error);
    throw error;
  }
}

/**
 * Save monthly stats to database
 */
export async function saveMonthlyStats(
  habitId: string,
  userId: string,
  stats: any
) {
  try {
    const { data, error } = await supabase
      .from('habit_history')
      .upsert([{ habit_id: habitId, user_id: userId, ...stats }], {
        onConflict: 'habit_id,month',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving monthly stats:', error);
    throw error;
  }
}

