"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BrandLogo } from "@/components/brand-logo"
import Link from "next/link"
import { Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
        setIsLoading(false)
        return
      }

      if (result?.ok) {
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("An unexpected error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  // Function to auto-fill demo credentials
  const fillDemoCredentials = (demoEmail: string) => {
    setEmail(demoEmail)
    setPassword("password123")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-zinc-50 dark:bg-zinc-900">
      <Card className="max-w-md w-full">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <BrandLogo size="lg" />
          </div>
          <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">Sign in to your account to continue</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="text-center text-sm pt-2">
            <p className="font-medium">Demo accounts (click to auto-fill):</p>
            <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
              <button
                type="button"
                onClick={() => fillDemoCredentials("free@example.com")}
                className="p-2 rounded bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-left"
              >
                <div className="font-medium">Free User</div>
                <div>free@example.com</div>
                <div>password123</div>
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials("pro@example.com")}
                className="p-2 rounded bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-800/30 transition-colors text-left"
              >
                <div className="font-medium">Pro User</div>
                <div>pro@example.com</div>
                <div>password123</div>
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials("team@example.com")}
                className="p-2 rounded bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-800/30 transition-colors text-left"
              >
                <div className="font-medium">Team User</div>
                <div>team@example.com</div>
                <div>password123</div>
              </button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-center text-sm">
            Don't have an account?{" "}
            <Link
              href="#"
              className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
            >
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

