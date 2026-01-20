import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { db } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export function Onboarding() {
  const { user, profile, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  
  const [formData, setState] = useState({
    fullName: profile?.full_name || '',
    goal: 'focus',
  })

  const handleComplete = async () => {
    if (!user) return
    try {
      setLoading(true)
      await db.updateProfile(user.id, {
        full_name: formData.fullName,
        onboarded_at: new Date().toISOString(),
      })
      
      await refreshProfile()
      toast.success('Welcome to FlowForge!')
      navigate('/dashboard', { replace: true })
    } catch (error) {
      console.error('Error during onboarding:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
              FF
            </div>
          </div>
          <CardTitle className="text-2xl">Welcome to FlowForge</CardTitle>
          <p className="text-gray-600 dark:text-gray-400">Let's set up your focus workspace</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">What should we call you?</Label>
                <Input 
                  id="name" 
                  value={formData.fullName}
                  onChange={(e) => setState({ ...formData, fullName: e.target.value })}
                  placeholder="Your Name"
                />
              </div>
              <Button 
                className="w-full bg-indigo-600" 
                onClick={() => setStep(2)}
                disabled={!formData.fullName.trim()}
              >
                Next Step
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <Label>What is your primary focus goal?</Label>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { id: 'focus', label: 'Improve concentration', icon: '🧠' },
                  { id: 'consistency', label: 'Build consistent habits', icon: '📈' },
                  { id: 'productivity', label: 'Increase output', icon: '⚡' },
                ].map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => setState({ ...formData, goal: goal.id })}
                    className={`flex items-center p-4 rounded-xl border text-left transition-all ${
                      formData.goal === goal.id 
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 ring-1 ring-indigo-600' 
                        : 'border-gray-200 dark:border-gray-800 hover:border-indigo-300'
                    }`}
                  >
                    <span className="text-2xl mr-4">{goal.icon}</span>
                    <span className="font-medium">{goal.label}</span>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>Back</Button>
                <Button className="flex-1 bg-indigo-600" onClick={handleComplete} disabled={loading}>
                  {loading ? 'Setting up...' : 'Get Started'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
