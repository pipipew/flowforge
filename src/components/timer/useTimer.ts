import { useState, useCallback, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createFocusSession, updateFocusSession, createSessionMood } from '@/lib/supabase';

export interface TimerState {
  totalSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
  isPaused: boolean;
  sessionId: string | null;
}

export interface TimerConfig {
  workMinutes: number;
  breakMinutes: number;
  category: string;
  mode: 'pomodoro' | 'deep_work' | 'custom';
}

const defaultConfig: TimerConfig = {
  workMinutes: 25,
  breakMinutes: 5,
  category: 'work',
  mode: 'pomodoro'
};

export function useTimer(config: Partial<TimerConfig> = {}) {
  const { user } = useAuth();
  const finalConfig = { ...defaultConfig, ...config };
  
  const [state, setState] = useState<TimerState>({
    totalSeconds: finalConfig.workMinutes * 60,
    remainingSeconds: finalConfig.workMinutes * 60,
    isRunning: false,
    isPaused: false,
    sessionId: null
  });

  const [moodBefore, setMoodBefore] = useState<number | null>(null);
  const [moodAfter, setMoodAfter] = useState<number | null>(null);
  
  const timerInterval = useRef<NodeJS.Timeout | null>(null);
  const sessionStartTime = useRef<Date | null>(null);

  const startSession = useCallback(async () => {
    if (!user) return;
    
    try {
      const session = await createFocusSession({
        user_id: user.id,
        category: finalConfig.category,
        duration_minutes: finalConfig.workMinutes,
        mode: finalConfig.mode,
        started_at: new Date().toISOString()
      });
      
      setState(prev => ({
        ...prev,
        isRunning: true,
        isPaused: false,
        sessionId: session.id
      }));
      
      sessionStartTime.current = new Date();
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  }, [user, finalConfig]);

  const pauseTimer = useCallback(() => {
    setState(prev => ({
      ...prev,
      isRunning: false,
      isPaused: true
    }));
  }, []);

  const resumeTimer = useCallback(() => {
    setState(prev => ({
      ...prev,
      isRunning: true,
      isPaused: false
    }));
  }, []);

  const stopTimer = useCallback(async () => {
    if (timerInterval.current) clearInterval(timerInterval.current);
    
    if (state.sessionId && user) {
      try {
        const actualDuration = Math.round(
          (sessionStartTime.current ? (new Date().getTime() - sessionStartTime.current.getTime()) / 1000 / 60 : finalConfig.workMinutes)
        );
        
        await updateFocusSession(state.sessionId, {
          ended_at: new Date().toISOString(),
          completed: state.remainingSeconds <= 0,
          actual_duration: actualDuration
        });
        
        if (moodBefore && moodAfter) {
          await createSessionMood({
            session_id: state.sessionId,
            user_id: user.id,
            mood_before: moodBefore,
            mood_after: moodAfter,
            energy_before: 3,
            energy_after: 3
          });
        }
      } catch (error) {
        console.error('Failed to update session:', error);
      }
    }
    
    setState({
      totalSeconds: finalConfig.workMinutes * 60,
      remainingSeconds: finalConfig.workMinutes * 60,
      isRunning: false,
      isPaused: false,
      sessionId: null
    });
    
    setMoodBefore(null);
    setMoodAfter(null);
  }, [state.sessionId, state.remainingSeconds, user, moodBefore, moodAfter, finalConfig]);

  useEffect(() => {
    if (state.isRunning && state.remainingSeconds > 0) {
      timerInterval.current = setInterval(() => {
        setState(prev => ({
          ...prev,
          remainingSeconds: prev.remainingSeconds - 1
        }));
      }, 1000);
    } else if (state.remainingSeconds === 0 && state.isRunning) {
      stopTimer();
    }
    
    return () => {
      if (timerInterval.current) clearInterval(timerInterval.current);
    };
  }, [state.isRunning, state.remainingSeconds, stopTimer]);

  const resetTimer = useCallback(() => {
    if (timerInterval.current) clearInterval(timerInterval.current);
    setState({
      totalSeconds: finalConfig.workMinutes * 60,
      remainingSeconds: finalConfig.workMinutes * 60,
      isRunning: false,
      isPaused: false,
      sessionId: null
    });
  }, [finalConfig]);

  return {
    state,
    startSession,
    pauseTimer,
    resumeTimer,
    stopTimer,
    resetTimer,
    moodBefore,
    setMoodBefore,
    moodAfter,
    setMoodAfter
  };
}
