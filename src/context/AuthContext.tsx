'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import authService from '@/services/authService'
import { AuthUser } from '@/types/auth'

interface AuthContextType {
  user: AuthUser | null
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated on app load
    const checkAuth = async () => {
      try {
        const currentUser = authService.getCurrentUser()
        const isAuthenticated = authService.isAuthenticated()
        
        if (isAuthenticated && currentUser) {
          setUser(currentUser)
        } else {
          // Validate token if user data exists but might be expired
          const isValid = await authService.validateToken()
          if (!isValid) {
            authService.logout()
          } else {
            setUser(currentUser)
          }
        }
      } catch (error) {
        console.error('Auth check error:', error)
        authService.logout()
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await authService.login({ username, password })
      
      if (result.success && result.user) {
        setUser(result.user)
        return { success: true }
      } else {
        return { 
          success: false, 
          error: result.error?.message || 'Login failed' 
        }
      }
    } catch (error: any) {
      console.error('Login error:', error)
      return { 
        success: false, 
        error: error.message || 'An error occurred during login' 
      }
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  const value = {
    user,
    login,
    logout,
    isLoading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
