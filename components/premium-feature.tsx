"use client"

import type React from "react"

import { useUser } from "@/contexts/user-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lock, Sparkles } from "lucide-react"
import Link from "next/link"

interface PremiumFeatureProps {
  requiredTier: "pro" | "team"
  fallback?: React.ReactNode
  children: React.ReactNode
}

export function PremiumFeature({ requiredTier, fallback, children }: PremiumFeatureProps) {
  const { user, hasAccess } = useUser()

  if (!user || !hasAccess(requiredTier)) {
    return (
      <div className="relative">
        {fallback || (
          <Card className="p-6 flex flex-col items-center justify-center text-center space-y-4 min-h-[200px] border-dashed border-2 border-zinc-300 dark:border-zinc-700 bg-zinc-100/50 dark:bg-zinc-800/50 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-lg"></div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center">
              <Lock className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Premium Feature</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                This feature is available on the {requiredTier.charAt(0).toUpperCase() + requiredTier.slice(1)} plan or
                higher.
              </p>
            </div>
            <Button
              asChild
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0"
            >
              <Link href="/pricing" className="flex items-center gap-1">
                <Sparkles className="h-4 w-4" />
                Upgrade Now
              </Link>
            </Button>
          </Card>
        )}
      </div>
    )
  }

  return <>{children}</>
}

