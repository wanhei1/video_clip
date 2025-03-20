"use client"

import { useUser } from "@/contexts/user-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { SubscriptionBadge } from "@/components/subscription-badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CreditCard, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function BillingPage() {
  const { user } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 处理取消订阅
  const handleCancelSubscription = async () => {
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/subscription/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setSuccess(true)
    } catch (error) {
      console.error("Error cancelling subscription:", error)
      setError(error instanceof Error ? error.message : "Please try again later or contact support.")
    } finally {
      setIsLoading(false)
    }
  }

  // 处理恢复订阅
  const handleResumeSubscription = async () => {
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/subscription/resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setSuccess(true)
    } catch (error) {
      console.error("Error resuming subscription:", error)
      setError(error instanceof Error ? error.message : "Please try again later or contact support.")
    } finally {
      setIsLoading(false)
    }
  }

  // 处理更新支付方式
  const handleUpdatePaymentMethod = async () => {
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/subscription/update-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error("No update URL returned")
      }
    } catch (error) {
      console.error("Error updating payment method:", error)
      setError(error instanceof Error ? error.message : "Please try again later or contact support.")
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="container py-10">
        <Card>
          <CardHeader>
            <CardTitle>Billing</CardTitle>
            <CardDescription>You need to be logged in to view billing information.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-10 max-w-4xl">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" asChild className="gap-1">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Subscription</CardTitle>
              <SubscriptionBadge tier={user.subscriptionTier} />
            </div>
            <CardDescription>
              Manage your subscription and billing information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {success && (
              <Alert className="bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Your subscription has been updated successfully.
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-1">
              <h3 className="font-medium">Current Plan</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {user.subscriptionTier === "free" ? (
                  "You are currently on the Free plan."
                ) : user.subscriptionTier === "pro" ? (
                  "You are currently on the Pro plan."
                ) : (
                  "You are currently on the Team plan."
                )}
              </p>
            </div>

            <Separator />

            <div className="space-y-1">
              <h3 className="font-medium">Payment Method</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {user.subscriptionTier === "free" ? (
                  "No payment method on file."
                ) : (
                  "Credit card ending in ****"
                )}
              </p>
            </div>

            <div className="pt-4 flex flex-wrap gap-3">
              {user.subscriptionTier === "free" ? (
                <Button asChild>
                  <Link href="/pricing">Upgrade Plan</Link>
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={handleUpdatePaymentMethod} disabled={isLoading}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Update Payment Method
                  </Button>
                  <Button variant="outline" onClick={handleCancelSubscription} disabled={isLoading} className="text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400">
                    Cancel Subscription
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Billing History</CardTitle>
            <CardDescription>
              View your past invoices and payment history
            </CardDescription>
          </CardHeader>
          <CardContent>
            {user.subscriptionTier === "free" ? (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                No billing history available for free accounts.
              </p>
            ) : (
              <div className="rounded-md border">
                <div className="p-4 text-sm">
                  <div className="grid grid-cols-4 font-medium">
                    <div>Date</div>
                    <div>Amount</div>
                    <div>Status</div>
                    <div className="text-right">Invoice</div>
                  </div>
                </div>
                <Separator />
                <div className="p-4 text-sm">
                  <div className="grid grid-cols-4">
                    <div>May 1, 2023</div>
                    <div>$9.99</div>
                    <div className="text-green-600 dark:text-green-400">Paid</div>
                    <div className="text-right">
                      <Button variant="link" size="sm" className="h-auto p-0">
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}