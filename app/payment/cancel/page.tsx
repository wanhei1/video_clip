import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { XCircle } from "lucide-react"
import Link from "next/link"

export default function PaymentCancelPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-50 via-slate-50 to-zinc-100 dark:from-zinc-950 dark:via-slate-950 dark:to-zinc-900 p-4 md:p-8 flex items-center justify-center">
      <Card className="max-w-md w-full border-zinc-200 bg-white/90 backdrop-blur-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-900/90">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <XCircle className="h-16 w-16 text-rose-500" />
          </div>
          <CardTitle className="text-zinc-800 dark:text-zinc-200">Payment Cancelled</CardTitle>
          <CardDescription className="text-zinc-600 dark:text-zinc-400">
            Your payment process was cancelled.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-zinc-700 dark:text-zinc-300">
          <p>No charges were made to your account.</p>
          <p className="mt-2">You can try again whenever you're ready.</p>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/">Return Home</Link>
          </Button>
          <Button
            asChild
            className="bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-700 dark:hover:bg-indigo-600"
          >
            <Link href="/pricing">Try Again</Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}

