import { useState, useEffect } from 'react'
import { useTimerStore, TimerMode, SessionCategory } from '@/store/useTimerStore'
import { useTimer } from '@/hooks/useTimer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Settings2, 
  Briefcase, 
  GraduationCap, 
  Code, 
  Palette, 
  BookOpen 
} from 'lucide-react'
import { cn, formatTime } from '@/lib/utils'
import { db } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

const CATEGORIES: { id: SessionCategory; label: string; icon: any }[] = [
  { id: 'work', label: 'Work', icon: Briefcase },
  { id: 'study', label: 'Study', icon: GraduationCap },
  { id: 'code', label: 'Code', icon: Code },
  { id: 'creative', label: 'Creative', icon: Palette },
  { id: 'reading', label: 'Reading', icon: BookOpen },
]

const MODES: { id: TimerMode; label: string; duration: number }[] = [
  { id: 'pomodoro', label: 'Pomodoro', duration: 25 },
  { id: 'deep_work', label: 'Deep Work', duration: 90 },
  { id: 'custom', label: 'Custom', duration: 60 },
]

export function Timer() {
  useTimer() // Hook to manage the worker
  const { user } = useAuth()
  const { 
    status, 
    timeLeft, 
    totalDuration, 
    mode, 
    category, 
    startedAt,
    start, 
    pause, 
    resume, 
    stop, 
    reset,
    setCategory
  } = useTimerStore()

  const [customDuration] = useState(60)
  const [showMoodModal, setShowMoodModal] = useState(false)

  const progress = ((totalDuration - timeLeft) / totalDuration) * 100
  const radius = 120
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  useEffect(() => {
    if (status === 'completed' && user) {
      handleComplete()
    }
  }, [status, user])

  const handleComplete = async () => {
    try {
      if (!user || !startedAt) return

      await db.createSession({
        user_id: user.id,
        category,
        duration_minutes: Math.ceil(totalDuration / 60),
        actual_duration: Math.ceil((totalDuration - timeLeft) / 60),
        mode,
        started_at: startedAt,
        ended_at: new Date().toISOString(),
        completed: true,
      })
      
      toast.success('Focus session completed! Great job.')
      setShowMoodModal(true)
    } catch (error) {
      console.error('Error saving session:', error)
      toast.error('Failed to save session, but you still did the work!')
    }
  }

  const handleStart = (m: typeof MODES[0]) => {
    const duration = m.id === 'custom' ? customDuration * 60 : m.duration * 60
    start(duration, m.id, category)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Focus Timer</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {status === 'running' ? "Keep going, you're doing great!" : 'Select a mode and start focusing.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Settings Panel */}
        <Card className={cn("lg:col-span-1", status !== 'idle' && "opacity-50 pointer-events-none")}>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center">
                <Settings2 className="w-4 h-4 mr-2" />
                Session Category
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={cn(
                      "flex items-center p-3 rounded-lg border transition-all text-left",
                      category === cat.id 
                        ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600" 
                        : "border-gray-200 dark:border-gray-800 hover:border-indigo-300"
                    )}
                  >
                    <cat.icon className="w-4 h-4 mr-3" />
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <h3 className="font-semibold">Timer Mode</h3>
              <div className="space-y-2">
                {MODES.map((m) => (
                  <Button
                    key={m.id}
                    variant={mode === m.id ? 'default' : 'outline'}
                    className="w-full justify-start"
                    onClick={() => handleStart(m)}
                  >
                    {m.label} ({m.duration}m)
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timer Display */}
        <Card className="lg:col-span-2 overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
          <CardContent className="p-12 flex flex-col items-center justify-center space-y-12">
            {/* Circular Progress */}
            <div className="relative w-72 h-72">
              <svg className="w-full h-full -rotate-90">
                {/* Background Circle */}
                <circle
                  cx="144"
                  cy="144"
                  r={radius}
                  className="stroke-gray-200 dark:stroke-gray-800 fill-none"
                  strokeWidth="12"
                />
                {/* Progress Circle */}
                <circle
                  cx="144"
                  cy="144"
                  r={radius}
                  className="stroke-indigo-600 fill-none transition-all duration-1000 ease-linear"
                  strokeWidth="12"
                  strokeDasharray={circumference}
                  style={{ strokeDashoffset }}
                  strokeLinecap="round"
                />
              </svg>
              {/* Timer Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-6xl font-bold font-mono tracking-tighter">
                  {formatTime(timeLeft)}
                </span>
                <span className="text-sm font-medium text-gray-500 uppercase tracking-widest mt-2">
                  {status}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {status === 'idle' ? (
                <Button 
                  size="lg" 
                  className="h-16 px-12 rounded-full bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none transition-all hover:scale-105"
                  onClick={() => handleStart(MODES.find(m => m.id === mode) || MODES[0])}
                >
                  <Play className="w-6 h-6 mr-2 fill-current" />
                  Start Session
                </Button>
              ) : (
                <>
                  {status === 'running' ? (
                    <Button 
                      size="icon" 
                      variant="outline"
                      className="w-16 h-16 rounded-full border-2"
                      onClick={pause}
                    >
                      <Pause className="w-6 h-6" />
                    </Button>
                  ) : status === 'paused' ? (
                    <Button 
                      size="icon" 
                      className="w-16 h-16 rounded-full bg-indigo-600 hover:bg-indigo-700"
                      onClick={resume}
                    >
                      <Play className="w-6 h-6 fill-current" />
                    </Button>
                  ) : null}
                  
                  <Button 
                    size="icon" 
                    variant="outline"
                    className="w-16 h-16 rounded-full border-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={stop}
                  >
                    <Square className="w-6 h-6 fill-current" />
                  </Button>
                </>
              )}
              
              {status === 'completed' && (
                <Button 
                  variant="outline" 
                  size="icon"
                  className="w-16 h-16 rounded-full border-2"
                  onClick={reset}
                >
                  <RotateCcw className="w-6 h-6" />
                </Button>
              )}
            </div>

            {/* Active Task/Info */}
            <div className="text-center space-y-1">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold uppercase tracking-wider">
                {category}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {mode === 'pomodoro' ? 'Standard Focus Session' : 
                 mode === 'deep_work' ? 'Long Deep Work Session' : 
                 'Custom Focus Session'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mood Modal Placeholder */}
      {showMoodModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md p-8 text-center space-y-6 animate-in zoom-in-95">
            <h2 className="text-2xl font-bold">How do you feel?</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Quickly check in on your mood and energy after that session.
            </p>
            <div className="flex justify-center gap-4 py-4">
              {[1, 2, 3, 4, 5].map((m) => (
                <button
                  key={m}
                  onClick={() => setShowMoodModal(false)}
                  className="w-12 h-12 text-2xl flex items-center justify-center rounded-full border hover:bg-indigo-50 hover:border-indigo-300 transition-all"
                >
                  {m === 1 ? '😫' : m === 2 ? '😕' : m === 3 ? '😐' : m === 4 ? '😊' : '🤩'}
                </button>
              ))}
            </div>
            <Button className="w-full" variant="outline" onClick={() => setShowMoodModal(false)}>
              Skip
            </Button>
          </Card>
        </div>
      )}
    </div>
  )
}
