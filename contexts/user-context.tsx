"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useSession, signIn, signOut } from "next-auth/react"

type SubscriptionTier = "free" | "pro" | "team"

interface User {
  id: string
  name: string | null
  email: string | null
  image?: string | null
  subscriptionTier: SubscriptionTier
  isPro?: boolean
}

interface UserContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  hasAccess: (requiredTier: SubscriptionTier) => boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const isLoading = status === "loading"

  useEffect(() => {
    if (session?.user) {
      setUser({
        id: session.user.id || "user-id",
        name: session.user.name || null,
        email: session.user.email || null,
        image: session.user.image || null,
        subscriptionTier: (session.user.subscriptionTier as SubscriptionTier) || "free",
        isPro: session.user.subscriptionTier === "pro" || session.user.subscriptionTier === "team"
      })
    } else {
      setUser(null)
    }
  }, [session])

  async function login(email: string, password: string) {
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  async function logout() {
    try {
      await signOut({ redirect: false })
    } catch (error) {
      console.error("Logout error:", error)
      throw error
    }
  }

  function hasAccess(requiredTier: SubscriptionTier): boolean {
    if (!user) return false

    const tiers = {
      free: 0,
      pro: 1,
      team: 2,
    }

    return tiers[user.subscriptionTier] >= tiers[requiredTier]
  }

  return <UserContext.Provider value={{ user, isLoading, login, logout, hasAccess }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

