import { useState, useEffect } from 'react'
import { db } from '@/lib/supabase'
import { SessionStats as SessionStatsType } from '@/types'

interface SessionStatsProps {
  userId: string
  className?: string
}

export const SessionStats: React.FC<SessionStatsProps> = ({ userId, className = '' }) => {
  const [stats, setStats] = useState<SessionStatsType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const sessionStats = await db.getSessionStats(userId)
        setStats(sessionStats)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load session stats')
        setStats(null)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchStats()
    }
  }, [userId])

  if (loading) {
    return (
      <div className={`bg-gray-900 border border-gray-700 rounded-lg p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-700 rounded w-1/3"></div>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className={`bg-red-950 border border-red-700 rounded-lg p-6 ${className}`}>
        <p className="text-red-400 text-sm">{error || 'No stats available'}</p>
      </div>
    )
  }

  return (
    <div className={`bg-gray-900 border border-gray-700 rounded-lg p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-white mb-4">Session Statistics</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-2">Total Sessions</p>
          <p className="text-2xl font-bold text-cyan-400">{stats.totalSessions}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-2">Total Minutes</p>
          <p className="text-2xl font-bold text-cyan-400">{stats.totalMinutes}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-2">Avg Mood</p>
          <p className="text-2xl font-bold text-cyan-400">{stats.avgMood.toFixed(1)}/5</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-2">Completion Rate</p>
          <p className="text-2xl font-bold text-cyan-400">{stats.completionRate}%</p>
        </div>
      </div>
    </div>
  )
}
