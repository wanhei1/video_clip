import { Crown, Zap, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface SubscriptionBadgeProps {
  tier: string
  size?: "sm" | "md" | "lg"
  className?: string
}

export function SubscriptionBadge({ tier, size = "md", className }: SubscriptionBadgeProps) {
  const tierConfig = {
    free: {
      icon: Zap,
      label: "Free",
      variant: "outline",
      className:
        "bg-gradient-to-r from-zinc-100 to-zinc-200 text-zinc-900 border-zinc-300 dark:from-zinc-800 dark:to-zinc-700 dark:text-zinc-100 dark:border-zinc-600",
    },
    pro: {
      icon: Crown,
      label: "Pro",
      variant: "outline",
      className:
        "bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-900 border-indigo-300 dark:from-indigo-900/30 dark:to-indigo-800/30 dark:text-indigo-100 dark:border-indigo-700",
    },
    team: {
      icon: Users,
      label: "Team",
      variant: "outline",
      className:
        "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-900 border-purple-300 dark:from-purple-900/30 dark:to-purple-800/30 dark:text-purple-100 dark:border-purple-700",
    },
  }

  const config = tierConfig[tier as keyof typeof tierConfig] || tierConfig.free
  const Icon = config.icon

  const sizeClasses = {
    sm: "px-1.5 py-0.5 text-xs",
    md: "px-2 py-1 text-xs",
    lg: "px-2.5 py-1.5 text-sm",
  }

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-3.5 w-3.5",
    lg: "h-4 w-4",
  }

  return (
    <Badge
      variant="outline"
      className={cn("flex items-center gap-1 font-medium shadow-sm", config.className, sizeClasses[size], className)}
    >
      <Icon className={iconSizes[size]} />
      <span>{config.label}</span>
    </Badge>
  )
}

