import { Scissors } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface BrandLogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
  variant?: "default" | "minimal"
  animated?: boolean
}

export function BrandLogo({ className, size = "md", variant = "default", animated = false }: BrandLogoProps) {
  const sizeClasses = {
    sm: "text-lg md:text-xl",
    md: "text-2xl md:text-3xl",
    lg: "text-3xl md:text-4xl",
  }

  return (
    <Link href="/" className={cn("flex items-center gap-2 font-bold tracking-tight", className)}>
      <div className="relative">
        <div
          className={cn(
            "absolute inset-0 bg-indigo-500 rounded-full blur-lg opacity-30 dark:opacity-40",
            animated && "animate-pulse",
          )}
        />
        <div
          className={cn(
            "relative bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-2 rounded-full",
            animated && "transition-transform hover:scale-110",
          )}
        >
          <Scissors
            className={cn({
              "h-4 w-4": size === "sm",
              "h-5 w-5": size === "md",
              "h-6 w-6": size === "lg",
            })}
          />
        </div>
      </div>
      {variant === "default" && (
        <span
          className={cn(
            "bg-gradient-to-r from-zinc-900 to-zinc-700 bg-clip-text text-transparent dark:from-zinc-100 dark:to-zinc-400",
            sizeClasses[size],
            animated &&
              "transition-all hover:from-indigo-600 hover:to-purple-600 dark:hover:from-indigo-400 dark:hover:to-purple-400",
          )}
        >
          Video<span className="text-indigo-600 dark:text-indigo-400">Clipper</span>
        </span>
      )}
    </Link>
  )
}

