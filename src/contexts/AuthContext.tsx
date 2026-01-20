import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, db } from '@/lib/supabase'
import type { User as AppUser } from '@/types'

interface AuthContextType {
  user: User | null
  profile: AppUser | null
  session: Session | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signInWithGithub: () => Promise<void>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<AppUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const loadProfile = async (userId: string) => {
    try {
      const profileData = await db.getProfile(userId)
      setProfile(profileData as AppUser)
      
      // Create profile if it doesn't exist
      if (!profileData) {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        if (authUser) {
          const newProfile = {
            id: authUser.id,
            email: authUser.email!,
            full_name: authUser.user_metadata.full_name || authUser.user_metadata.name || null,
            avatar_url: authUser.user_metadata.avatar_url || null,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            pro_tier: false,
            created_at: new Date().toISOString(),
          }
          
          const { error } = await supabase
            .from('profiles')
            .insert(newProfile)
          
          if (!error) {
            setProfile(newProfile as AppUser)
          }
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    }
  }

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        loadProfile(session.user.id)
      }
      
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await loadProfile(session.user.id)
      } else {
        setProfile(null)
      }
      
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      console.error('Error signing in with Google:', error)
      throw error
    }
  }

  const signInWithGithub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      console.error('Error signing in with GitHub:', error)
      throw error
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error)
      throw error
    }
    setUser(null)
    setProfile(null)
    setSession(null)
  }

  const refreshProfile = async () => {
    if (user) {
      await loadProfile(user.id)
    }
  }

  const value = {
    user,
    profile,
    session,
    loading,
    signInWithGoogle,
    signInWithGithub,
    signOut,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
