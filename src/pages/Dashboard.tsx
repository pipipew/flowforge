import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

export function Dashboard() {
  const { profile } = useAuth()

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
            <div className="text-3xl font-bold text-indigo-600">0h 0m</div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">No sessions yet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Active Habits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">0</div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Create your first habit</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Current Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">0 🔥</div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Start your journey</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Start</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 space-y-4">
            <div className="text-6xl">⏰</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Ready for your first focus session?
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Start a 25-minute Pomodoro session and begin building your deep work habit.
            </p>
            <button className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
              Start Focus Session
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
