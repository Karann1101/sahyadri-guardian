"use client"

import { useState, useEffect } from "react"

interface User {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const data = await res.json()
        setUser({
          id: data.user.id,
          displayName: data.user.displayName,
          email: data.user.email,
          photoURL: "/placeholder-user.jpg"
        })
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
      throw new Error('Login failed')
    }

    const data = await res.json()
    setUser({
      id: data.user.id,
      displayName: data.user.displayName,
      email: data.user.email,
      photoURL: "/placeholder-user.jpg"
    })
  }

  const signOut = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' })
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setUser(null)
    }
  }

  return {
    user,
    loading,
    signIn,
    signOut,
    checkAuth
  }
}
