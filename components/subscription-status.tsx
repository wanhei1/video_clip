"use client"

import { useUser } from "@/contexts/user-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Crown, ExternalLink } from "lucide-react"
import Link from "next/link"

export function SubscriptionStatus() {
  const { user } = useUser()

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href="/login">Login</Link>
        </Button>
        <Button
          size="sm"
          className="bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-700 dark:hover:bg-indigo-600"
          asChild
        >
          <Link href="/pricing">Upgrade</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {user.isPro ? (
        <Badge
          variant="outline"
          className="bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-300 dark:border-indigo-800 px-2 py-1 flex items-center gap-1"
        >
          <Crown className="h-3.5 w-3.5" />
          <span>Pro</span>
        </Badge>
      ) : (
        <Button
          size="sm"
          className="bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-700 dark:hover:bg-indigo-600"
          asChild
        >
          <Link href="/pricing">
            Upgrade to Pro
            <ExternalLink className="ml-1 h-3.5 w-3.5" />
          </Link>
        </Button>
      )}
    </div>
  )
}

