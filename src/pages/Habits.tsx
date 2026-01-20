import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { db } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Plus, 
  CheckCircle2, 
  Circle, 
  Flame, 
  MoreVertical, 
  Trash2, 
  Archive,
  Edit2
} from 'lucide-react'
import { toast } from 'sonner'
import { cn, getTodayDate } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Habit {
  id: string
  name: string
  description: string
  color: string
  icon: string
  streak?: number
  completed_today?: boolean
}

export function Habits() {
  const { user } = useAuth()
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newHabitName, setNewHabitName] = useState('')
  const [newHabitDesc, setNewHabitDesc] = useState('')

  const loadHabits = async () => {
    if (!user) return
    try {
      setLoading(true)
      const data = await db.getHabits(user.id)
      const today = getTodayDate()
      const logs = await db.getHabitLogs(user.id, today, today)
      
      const habitsWithStatus = await Promise.all(data.map(async (h: any) => {
        const streak = await db.calculateStreak(h.id)
        return {
          ...h,
          streak,
          completed_today: logs.some((l: any) => l.habit_id === h.id)
        }
      }))
      
      setHabits(habitsWithStatus)
    } catch (error) {
      console.error('Error loading habits:', error)
      toast.error('Failed to load habits')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadHabits()
  }, [user])

  const handleToggleHabit = async (habit: Habit) => {
    if (!user) return
    try {
      const today = getTodayDate()
      await db.toggleHabit(habit.id, user.id, today)
      
      setHabits(habits.map(h => 
        h.id === habit.id ? { ...h, completed_today: !h.completed_today, streak: (h.streak || 0) + (h.completed_today ? -1 : 1) } : h
      ))
      
      if (!habit.completed_today) {
        toast.success(`Habit "${habit.name}" completed for today!`)
      }
    } catch (error) {
      console.error('Error toggling habit:', error)
      toast.error('Failed to update habit')
    }
  }

  const handleAddHabit = async () => {
    if (!user || !newHabitName.trim()) return
    try {
      await db.createHabit({
        user_id: user.id,
        name: newHabitName,
        description: newHabitDesc,
        category: 'anytime',
      })
      
      toast.success('Habit created successfully!')
      setShowAddModal(false)
      setNewHabitName('')
      setNewHabitDesc('')
      loadHabits()
    } catch (error) {
      console.error('Error creating habit:', error)
      toast.error('Failed to create habit')
    }
  }

  const handleDeleteHabit = async (id: string) => {
    try {
      await db.deleteHabit(id)
      setHabits(habits.filter(h => h.id !== id))
      toast.success('Habit deleted')
    } catch (error) {
      console.error('Error deleting habit:', error)
      toast.error('Failed to delete habit')
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Daily Habits</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Build consistency through daily repetitions.
          </p>
        </div>
        
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Habit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Habit</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Habit Name</Label>
                <Input 
                  id="name" 
                  placeholder="e.g. Morning Meditation" 
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">Description (optional)</Label>
                <Input 
                  id="desc" 
                  placeholder="e.g. 10 minutes after waking up" 
                  value={newHabitDesc}
                  onChange={(e) => setNewHabitDesc(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button onClick={handleAddHabit} disabled={!newHabitName.trim()}>Create Habit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading && habits.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : habits.length === 0 ? (
        <Card className="p-12 text-center space-y-4">
          <div className="text-6xl">📝</div>
          <h2 className="text-xl font-semibold">No habits yet</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
            Small changes lead to big results. Start by creating your first daily habit today.
          </p>
          <Button variant="outline" onClick={() => setShowAddModal(true)}>
            Create Your First Habit
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {habits.map((habit) => (
            <Card key={habit.id} className={cn(
              "transition-all duration-300",
              habit.completed_today && "bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-800"
            )}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-4">
                    <button 
                      onClick={() => handleToggleHabit(habit)}
                      className={cn(
                        "mt-1 w-8 h-8 rounded-full flex items-center justify-center transition-all",
                        habit.completed_today 
                          ? "bg-indigo-600 text-white" 
                          : "border-2 border-gray-300 dark:border-gray-700 text-gray-300 dark:text-gray-700 hover:border-indigo-400"
                      )}
                    >
                      {habit.completed_today ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                    <div>
                      <h3 className={cn(
                        "text-lg font-bold transition-all",
                        habit.completed_today ? "text-indigo-900 dark:text-indigo-100 line-through opacity-70" : "text-gray-900 dark:text-white"
                      )}>
                        {habit.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                        {habit.description || 'Daily habit'}
                      </p>
                      
                      <div className="mt-3 flex items-center space-x-3">
                        <div className="inline-flex items-center text-orange-600 font-bold text-sm">
                          <Flame className="w-4 h-4 mr-1 fill-current" />
                          {habit.streak || 0} Day Streak
                        </div>
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => toast.info('Edit coming soon')}>
                        <Edit2 className="w-4 h-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toast.info('Archive coming soon')}>
                        <Archive className="w-4 h-4 mr-2" /> Archive
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteHabit(habit.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
