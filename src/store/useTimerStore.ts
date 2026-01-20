import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed'
export type SessionCategory = 'work' | 'study' | 'code' | 'creative' | 'reading'
export type TimerMode = 'pomodoro' | 'deep_work' | 'custom'

interface TimerState {
  status: TimerStatus
  mode: TimerMode
  category: SessionCategory
  timeLeft: number // in seconds
  totalDuration: number // in seconds
  startedAt: string | null
  
  // Actions
  start: (durationSeconds: number, mode: TimerMode, category: SessionCategory) => void
  pause: () => void
  resume: () => void
  stop: () => void
  tick: () => void
  setCategory: (category: SessionCategory) => void
  reset: () => void
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      status: 'idle',
      mode: 'pomodoro',
      category: 'work',
      timeLeft: 1500, // 25 minutes
      totalDuration: 1500,
      startedAt: null,

      start: (durationSeconds, mode, category) => {
        set({
          status: 'running',
          mode,
          category,
          timeLeft: durationSeconds,
          totalDuration: durationSeconds,
          startedAt: new Date().toISOString(),
        })
      },

      pause: () => {
        if (get().status === 'running') {
          set({ status: 'paused' })
        }
      },

      resume: () => {
        if (get().status === 'paused') {
          set({ status: 'running' })
        }
      },

      stop: () => {
        set({
          status: 'idle',
          startedAt: null,
          timeLeft: get().totalDuration,
        })
      },

      tick: () => {
        const { status, timeLeft } = get()
        if (status !== 'running') return

        if (timeLeft <= 0) {
          set({ status: 'completed', timeLeft: 0 })
          return
        }

        set({ timeLeft: timeLeft - 1 })
      },

      setCategory: (category) => set({ category }),

      reset: () => {
        set({
          status: 'idle',
          startedAt: null,
          timeLeft: 1500,
          totalDuration: 1500,
        })
      },
    }),
    {
      name: 'flowforge-timer-storage',
      partialize: (state) => ({
        mode: state.mode,
        category: state.category,
        totalDuration: state.totalDuration,
      }),
    }
  )
)
