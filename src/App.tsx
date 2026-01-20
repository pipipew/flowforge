import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { AuthPage } from '@/components/auth/AuthPage'
import { AuthCallback } from '@/components/auth/AuthCallback'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Layout } from '@/components/layout/Layout'
import { Dashboard } from '@/pages/Dashboard'
import { Timer } from '@/pages/Timer'
import { Habits } from '@/pages/Habits'
import { Onboarding } from '@/pages/Onboarding'
import { Toaster } from '@/components/ui/sonner'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Placeholder routes - to be implemented */}
          <Route
            path="/timer"
            element={
              <ProtectedRoute>
                <Layout>
                  <Timer />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/habits"
            element={
              <ProtectedRoute>
                <Layout>
                  <Habits />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Layout>
                  <div className="text-center py-12">
                    <h2 className="text-2xl font-bold">Analytics Page</h2>
                    <p className="text-gray-600 mt-2">Coming soon in Phase 2</p>
                  </div>
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App