'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user?.isAuthenticated) {
      router.push('/auth/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-foreground border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-primary-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user?.isAuthenticated) {
    return null
  }

  return <>{children}</>
}
