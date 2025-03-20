"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Loader2 } from "lucide-react"
import Link from "next/link"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [isVerifying, setIsVerifying] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    async function verifyPayment() {
      if (!sessionId) {
        setIsVerifying(false)
        return
      }

      try {
        // Here you would typically verify the payment with your backend
        // For demo purposes, we'll just simulate a successful verification
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setIsSuccess(true)
      } catch (error) {
        console.error("Error verifying payment:", error)
        setIsSuccess(false)
      } finally {
        setIsVerifying(false)
      }
    }

    verifyPayment()
  }, [sessionId])

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-50 via-slate-50 to-zinc-100 dark:from-zinc-950 dark:via-slate-950 dark:to-zinc-900 p-4 md:p-8 flex items-center justify-center">
      <Card className="max-w-md w-full border-zinc-200 bg-white/90 backdrop-blur-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-900/90">
        <CardHeader className="text-center">
          {isVerifying ? (
            <>
              <CardTitle className="text-zinc-800 dark:text-zinc-200">Verifying Payment</CardTitle>
              <CardDescription className="text-zinc-600 dark:text-zinc-400">
                Please wait while we verify your payment...
              </CardDescription>
            </>
          ) : isSuccess ? (
            <>
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-zinc-800 dark:text-zinc-200">Payment Successful!</CardTitle>
              <CardDescription className="text-zinc-600 dark:text-zinc-400">
                Thank you for your purchase. Your subscription is now active.
              </CardDescription>
            </>
          ) : (
            <>
              <CardTitle className="text-zinc-800 dark:text-zinc-200">Payment Verification Failed</CardTitle>
              <CardDescription className="text-zinc-600 dark:text-zinc-400">
                We couldn't verify your payment. Please contact support if you believe this is an error.
              </CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent>
          {isVerifying ? (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
            </div>
          ) : isSuccess ? (
            <div className="text-center space-y-2 text-zinc-700 dark:text-zinc-300">
              <p>Your account has been upgraded to Pro!</p>
              <p>You now have access to all premium features.</p>
            </div>
          ) : (
            <div className="text-center text-zinc-700 dark:text-zinc-300">
              <p>Session ID: {sessionId || "Not provided"}</p>
              <p className="mt-2">Please try again or contact our support team for assistance.</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            asChild
            className="bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-700 dark:hover:bg-indigo-600"
          >
            <Link href="/">Return to Dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}

