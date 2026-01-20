import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import { db } from '@/lib/supabase'
import { formatDuration } from '@/lib/utils'
import { Play } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Dashboard() {
  const { user, profile } = useAuth()
  const [stats, setStats] = useState({
    focusMinutes: 0,
    activeHabits: 0,
    streak: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      if (!user) return
      try {
        setLoading(true)
        // Load sessions for today
        const today = new Date().toISOString().split('T')[0]
        const sessions = await db.getSessions(user.id, 50)
        const todaySessions = sessions.filter(s => s.started_at.startsWith(today))
        const totalMinutes = todaySessions.reduce((acc, s) => acc + (s.actual_duration || 0), 0)

        // Load active habits
        const habits = await db.getHabits(user.id)
        
        setStats({
          focusMinutes: totalMinutes,
          activeHabits: habits.length,
          streak: 0 // Will implement streak later
        })
      } catch (error) {
        console.error('Error loading dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [user])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Ready to build some deep work habits?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Today's Focus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-600">
              {loading ? '...' : formatDuration(stats.focusMinutes)}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {stats.focusMinutes > 0 ? 'Keep it up!' : 'No sessions yet'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Active Habits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {loading ? '...' : stats.activeHabits}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {stats.activeHabits > 0 ? 'Habits in progress' : 'Create your first habit'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Current Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {loading ? '...' : `${stats.streak} 🔥`}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {stats.streak > 0 ? "You're on fire!" : 'Start your journey'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Start</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 space-y-4">
            <div className="text-6xl animate-bounce">⏰</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Ready for your next focus session?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Jump into a 25-minute Pomodoro session and maintain your flow.
            </p>
            <Link to="/timer">
              <button className="mt-6 px-8 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-all hover:scale-105 shadow-lg shadow-indigo-200 dark:shadow-none inline-flex items-center">
                <Play className="w-4 h-4 mr-2 fill-current" />
                Start Focus Session
              </button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}