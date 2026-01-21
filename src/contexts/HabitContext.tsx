import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { Habit, HabitCheckIn, HabitStreak, HabitStats, CreateHabitInput } from '../types/habits';
import { supabase } from '../lib/supabase';

interface HabitState {
  habits: Habit[];
  checkins: HabitCheckIn[];
  streaks: HabitStreak[];
  stats: HabitStats | null;
  loading: boolean;
  error: string | null;
}

type HabitAction =
  | { type: 'SET_HABITS'; payload: Habit[] }
  | { type: 'ADD_HABIT'; payload: Habit }
  | { type: 'UPDATE_HABIT'; payload: Habit }
  | { type: 'DELETE_HABIT'; payload: string }
  | { type: 'SET_CHECKINS'; payload: HabitCheckIn[] }
  | { type: 'ADD_CHECKIN'; payload: HabitCheckIn }
  | { type: 'UPDATE_CHECKIN'; payload: HabitCheckIn }
  | { type: 'SET_STREAKS'; payload: HabitStreak[] }
  | { type: 'SET_STATS'; payload: HabitStats }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: HabitState = {
  habits: [],
  checkins: [],
  streaks: [],
  stats: null,
  loading: false,
  error: null,
};

const habitReducer = (state: HabitState, action: HabitAction): HabitState => {
  switch (action.type) {
    case 'SET_HABITS':
      return { ...state, habits: action.payload };
    case 'ADD_HABIT':
      return { ...state, habits: [...state.habits, action.payload] };
    case 'UPDATE_HABIT':
      return {
        ...state,
        habits: state.habits.map((h) => (h.id === action.payload.id ? action.payload : h)),
      };
    case 'DELETE_HABIT':
      return { ...state, habits: state.habits.filter((h) => h.id !== action.payload) };
    case 'SET_CHECKINS':
      return { ...state, checkins: action.payload };
    case 'ADD_CHECKIN':
      return { ...state, checkins: [...state.checkins, action.payload] };
    case 'UPDATE_CHECKIN':
      return {
        ...state,
        checkins: state.checkins.map((c) => (c.id === action.payload.id ? action.payload : c)),
      };
    case 'SET_STREAKS':
      return { ...state, streaks: action.payload };
    case 'SET_STATS':
      return { ...state, stats: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

interface HabitContextType extends HabitState {
  createHabit: (input: CreateHabitInput) => Promise<void>;
  updateHabit: (habitId: string, input: Partial<CreateHabitInput>) => Promise<void>;
  deleteHabit: (habitId: string) => Promise<void>;
  toggleHabitCheckIn: (habitId: string, date: string, completed: boolean) => Promise<void>;
  getHabits: () => Promise<void>;
  getCheckIns: (habitId?: string) => Promise<void>;
  getStreaks: () => Promise<void>;
  calculateStats: () => Promise<void>;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(habitReducer, initialState);

  const getHabits = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      dispatch({ type: 'SET_HABITS', payload: data || [] });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const createHabit = useCallback(
    async (input: CreateHabitInput) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        // Check free tier limit (max 3 habits)
        if (state.habits.length >= 3) {
          throw new Error('Free tier limited to 3 habits. Upgrade for more.');
        }

        const { data, error } = await supabase
          .from('habits')
          .insert([{ ...input, user_id: user.id }])
          .select()
          .single();

        if (error) throw error;
        dispatch({ type: 'ADD_HABIT', payload: data });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
        throw error;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [state.habits.length]
  );

  const updateHabit = useCallback(async (habitId: string, input: Partial<CreateHabitInput>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { data, error } = await supabase
        .from('habits')
        .update(input)
        .eq('id', habitId)
        .select()
        .single();

      if (error) throw error;
      dispatch({ type: 'UPDATE_HABIT', payload: data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const deleteHabit = useCallback(async (habitId: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { error } = await supabase.from('habits').delete().eq('id', habitId);
      if (error) throw error;
      dispatch({ type: 'DELETE_HABIT', payload: habitId });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const toggleHabitCheckIn = useCallback(
    async (habitId: string, date: string, completed: boolean) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
          .from('habit_checkins')
          .upsert(
            [
              {
                habit_id: habitId,
                user_id: user.id,
                date,
                completed,
              },
            ],
            { onConflict: 'habit_id,date' }
          )
          .select()
          .single();

        if (error) throw error;
        dispatch({ type: 'UPDATE_CHECKIN', payload: data });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    []
  );

  const getCheckIns = useCallback(async (habitId?: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let query = supabase
        .from('habit_checkins')
        .select('*')
        .eq('user_id', user.id);

      if (habitId) {
        query = query.eq('habit_id', habitId);
      }

      const { data, error } = await query.order('date', { ascending: false });
      if (error) throw error;
      dispatch({ type: 'SET_CHECKINS', payload: data || [] });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const getStreaks = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('habit_streaks')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (error) throw error;
      dispatch({ type: 'SET_STREAKS', payload: data || [] });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const calculateStats = useCallback(async () => {
    try {
      const totalHabits = state.habits.length;
      const activeHabits = state.habits.filter((h) => h.active).length;
      const today = new Date().toISOString().split('T')[0];
      const completedToday = state.checkins.filter(
        (c) => c.date === today && c.completed
      ).length;
      const longestStreak = Math.max(...state.streaks.map((s) => s.count), 0);
      const currentStreak = state.streaks
        .filter((s) => s.is_active)
        .reduce((max, s) => Math.max(max, s.count), 0);
      const completionRate =
        totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0;

      dispatch({
        type: 'SET_STATS',
        payload: {
          total_habits: totalHabits,
          active_habits: activeHabits,
          completed_today: completedToday,
          longest_streak: longestStreak,
          current_streak: currentStreak,
          completion_rate: completionRate,
        },
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  }, [state.habits, state.checkins, state.streaks]);

  const value: HabitContextType = {
    ...state,
    createHabit,
    updateHabit,
    deleteHabit,
    toggleHabitCheckIn,
    getHabits,
    getCheckIns,
    getStreaks,
    calculateStats,
  };

  return <HabitContext.Provider value={value}>{children}</HabitContext.Provider>;
};

export const useHabits = (): HabitContextType => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits must be used within HabitProvider');
  }
  return context;
};

