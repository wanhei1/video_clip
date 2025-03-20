"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useUser } from "@/contexts/user-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Loader2, Sparkles, Crown, Users, Zap } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

interface PricingPlan {
  id: string
  name: string
  description: string
  price: string
  features: string[]
  priceId: string
  icon: React.ElementType
  gradient: string
  popular?: boolean
}

export function PricingPlans() {
  const { user } = useUser()
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [priceIds, setPriceIds] = useState<{
    proPriceId: string
    teamPriceId: string
  }>({
    proPriceId: "",
    teamPriceId: "",
  })

  const pricingPlans: PricingPlan[] = [
    {
      id: "free",
      name: "Free",
      description: "Essential features for casual users",
      price: "$0",
      features: ["Record timestamps", "Basic clip extraction", "Export to CSV/JSON", "Standard video formats support"],
      priceId: "",
      icon: Zap,
      gradient: "from-zinc-400 to-zinc-500",
    },
    {
      id: "pro",
      name: "Pro",
      description: "Advanced features for professionals",
      price: "$9.99",
      features: [
        "Everything in Free",
        "High-quality exports",
        "Batch processing",
        "Cloud storage for clips (5GB)",
        "Advanced editing tools",
        "Priority support",
      ],
      priceId: priceIds.proPriceId,
      icon: Crown,
      gradient: "from-indigo-500 to-indigo-600",
      popular: true,
    },
    {
      id: "team",
      name: "Team",
      description: "Collaboration features for teams",
      price: "$24.99",
      features: [
        "Everything in Pro",
        "Team collaboration",
        "Shared projects",
        "Admin dashboard",
        "Usage analytics",
        "API access",
        "Cloud storage for clips (50GB)",
        "Dedicated support",
      ],
      priceId: priceIds.teamPriceId,
      icon: Users,
      gradient: "from-purple-500 to-purple-600",
    },
  ]

  useEffect(() => {
    async function fetchPriceIds() {
      try {
        const response = await fetch("/api/config")
        const data = await response.json()
        setPriceIds(data)
      } catch (error) {
        console.error("Error fetching price IDs:", error)
      }
    }

    fetchPriceIds()
  }, [])

  const handleSubscribe = async (plan: PricingPlan) => {
    if (plan.id === "free") {
      toast({
        title: "You are already on the Free plan",
        description: "Enjoy the free features of Video Clipper!",
      })
      return
    }

    try {
      setIsLoading(plan.id)

      // Use the correct price ID based on the plan
      const priceId = plan.id === "pro" ? priceIds.proPriceId : priceIds.teamPriceId

      if (!priceId) {
        throw new Error("Price ID not available")
      }

      const response = await fetch("/api/stripe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          // You can add metadata like user ID if needed
          metadata: user ? { userId: user.id } : undefined,
        }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error("No checkout URL returned")
      }
    } catch (error) {
      console.error("Error creating checkout session:", error)
      toast({
        title: "Something went wrong",
        description: error instanceof Error ? error.message : "Please try again later or contact support.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {pricingPlans.map((plan) => {
        const Icon = plan.icon
        const isCurrentPlan = user?.subscriptionTier === plan.id

        return (
          <Card
            key={plan.id}
            className={cn(
              "flex flex-col border-zinc-200 bg-white/90 backdrop-blur-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-900/90 relative overflow-hidden group hover:shadow-md transition-all",
              plan.popular && "ring-2 ring-indigo-500 dark:ring-indigo-400",
            )}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-medium px-3 py-1 rounded-bl-lg flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Most Popular
                </div>
              </div>
            )}

            <CardHeader>
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-full bg-gradient-to-r ${plan.gradient} text-white`}>
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-zinc-800 dark:text-zinc-200">{plan.name}</CardTitle>
              </div>
              <CardDescription className="text-zinc-600 dark:text-zinc-400">{plan.description}</CardDescription>
            </CardHeader>

            <CardContent className="flex-grow">
              <div className="mb-4 flex items-baseline">
                <span className="text-3xl font-bold text-zinc-800 dark:text-zinc-200">{plan.price}</span>
                {plan.id !== "free" && <span className="text-sm text-zinc-500 dark:text-zinc-500 ml-1">/month</span>}
              </div>

              <ul className="space-y-2 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="h-4 w-4 text-indigo-500 dark:text-indigo-400 mr-2 mt-0.5 shrink-0" />
                    <span className="text-zinc-700 dark:text-zinc-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter>
              <Button
                onClick={() => handleSubscribe(plan)}
                className={cn(
                  "w-full",
                  plan.id === "free"
                    ? "bg-zinc-200 text-zinc-800 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0",
                  isCurrentPlan && "border-2 border-green-500 dark:border-green-400",
                )}
                disabled={isLoading !== null || isCurrentPlan}
              >
                {isLoading === plan.id ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : isCurrentPlan ? (
                  "Current Plan"
                ) : (
                  "Subscribe"
                )}
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}

