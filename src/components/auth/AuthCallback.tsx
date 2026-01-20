import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

export function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    // Handle the OAuth callback
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // Check if user has completed onboarding
        supabase
          .from('profiles')
          .select('onboarded_at')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            if (data?.onboarded_at) {
              navigate('/dashboard', { replace: true })
            } else {
              navigate('/onboarding', { replace: true })
            }
          })
      } else {
        navigate('/auth', { replace: true })
      }
    })
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="text-gray-600 dark:text-gray-400">Completing sign in...</p>
      </div>
    </div>
  )
}
