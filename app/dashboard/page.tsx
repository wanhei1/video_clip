"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { BrandLogo } from "@/components/brand-logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VideoTimestampTool } from "@/components/video-timestamp-tool"
import { ThemeToggle } from "@/components/theme-toggle"
import { SubscriptionBadge } from "@/components/subscription-badge"
import { UserNav } from "@/components/user-nav"
import {
  Crown,
  Users,
  Zap,
  Clock,
  FileVideo,
  Settings,
  BarChart3,
  Sparkles,
  Layers,
  Compass,
  Lightbulb,
  Palette,
  Wand2,
} from "lucide-react"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true)
    // Add a small delay for animations
    const timer = setTimeout(() => {
      setMounted(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (isClient && status === "unauthenticated") {
      router.push("/login")
    }
  }, [isClient, status, router])

  // Show loading state
  if (status === "loading" || !isClient) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-zinc-50 via-slate-50 to-zinc-100 dark:from-zinc-950 dark:via-slate-950 dark:to-zinc-900">
        <div className="animate-pulse text-center">
          <BrandLogo size="lg" animated />
          <div className="mt-6 flex items-center justify-center space-x-2">
            <div className="h-2.5 w-2.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-2.5 w-2.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-2.5 w-2.5 rounded-full bg-indigo-500 animate-bounce"></div>
          </div>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">Loading your creative workspace...</p>
        </div>
      </div>
    )
  }

  // If not authenticated and client-side, show nothing (will redirect)
  if (status === "unauthenticated" && isClient) {
    return null
  }

  // Get user from session
  const user = session?.user
    ? {
        id: session.user.id || "user-id",
        name: session.user.name || "User",
        email: session.user.email || "user@example.com",
        image: session.user.image,
        subscriptionTier: (session.user.subscriptionTier as string) || "free",
      }
    : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-slate-50 to-zinc-100 dark:from-zinc-950 dark:via-slate-950 dark:to-zinc-900 overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.02] pointer-events-none"></div>

      {/* Gradient orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl opacity-30 animate-pulse-slow pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl opacity-30 animate-pulse-slow pointer-events-none"></div>

      <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur-sm dark:bg-zinc-950/80 dark:border-zinc-800">
        <div className="container flex h-16 items-center justify-between py-4">
          <BrandLogo animated />
          <div className="flex items-center gap-4">
            <SubscriptionBadge tier={user?.subscriptionTier || "free"} />
            <ThemeToggle />
            <UserNav />
          </div>
        </div>
      </header>

      <main
        className={`container max-w-6xl py-8 relative z-10 transition-all duration-500 ease-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      >
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center gap-2 mb-2">
            <div className="h-1 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"></div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-800 dark:text-zinc-200">
              Welcome, {user?.name || "Creator"}
            </h1>
            <div className="h-1 w-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"></div>
          </div>

          <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Your creative workspace for precise video timestamps and clip extraction
          </p>

          {user?.subscriptionTier !== "free" && (
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 text-sm font-medium text-indigo-700 dark:text-indigo-300 animate-fade-in">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{user?.subscriptionTier === "pro" ? "Pro" : "Team"} Features Unlocked</span>
            </div>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-10">
          <SubscriptionCard tier={user?.subscriptionTier || "free"} />
          <StatsCard />
          <QuickActionsCard />
        </div>

        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 rounded-xl blur-xl opacity-70 -z-10 animate-pulse-slow"></div>
          <Card className="border-zinc-200/50 bg-white/90 backdrop-blur-sm shadow-sm dark:border-zinc-800/50 dark:bg-zinc-900/90 overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                    Video Timestamp Studio
                  </CardTitle>
                  <CardDescription className="text-zinc-600 dark:text-zinc-400">
                    Record, extract, and manage your video timestamps with precision
                  </CardDescription>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="group hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-300 dark:hover:border-indigo-800 transition-colors"
                  >
                    <Lightbulb className="mr-1.5 h-3.5 w-3.5 group-hover:text-indigo-500 dark:group-hover:text-indigo-400" />
                    <span>Tutorial</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="group hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 dark:hover:bg-purple-900/30 dark:hover:text-purple-300 dark:hover:border-purple-800 transition-colors"
                  >
                    <Compass className="mr-1.5 h-3.5 w-3.5 group-hover:text-purple-500 dark:group-hover:text-purple-400" />
                    <span>Explore Templates</span>
                  </Button>
                </div>
              </div>
            </CardHeader>

            <Separator className="mb-4" />

            <CardContent className="pt-0">
              <Tabs defaultValue="editor" className="w-full">
                <TabsList className="mb-4 bg-zinc-100/80 dark:bg-zinc-800/50 backdrop-blur-sm rounded-lg p-1 w-full sm:w-auto">
                  <TabsTrigger
                    value="editor"
                    className="flex items-center gap-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 data-[state=active]:shadow-sm rounded-md transition-all"
                  >
                    <FileVideo className="h-3.5 w-3.5" />
                    <span>Video Editor</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="history"
                    className="flex items-center gap-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 data-[state=active]:shadow-sm rounded-md transition-all"
                  >
                    <Clock className="h-3.5 w-3.5" />
                    <span>History</span>
                  </TabsTrigger>
                  {user?.subscriptionTier !== "free" && (
                    <TabsTrigger
                      value="analytics"
                      className="flex items-center gap-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 data-[state=active]:shadow-sm rounded-md transition-all"
                    >
                      <BarChart3 className="h-3.5 w-3.5" />
                      <span>Analytics</span>
                    </TabsTrigger>
                  )}
                  <TabsTrigger
                    value="settings"
                    className="flex items-center gap-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 data-[state=active]:shadow-sm rounded-md transition-all"
                  >
                    <Settings className="h-3.5 w-3.5" />
                    <span>Settings</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="editor" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                  <VideoTimestampTool />
                </TabsContent>

                <TabsContent value="history" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                  <Card className="border-zinc-200/50 bg-white/90 backdrop-blur-sm shadow-sm dark:border-zinc-800/50 dark:bg-zinc-900/90 overflow-hidden">
                    <div className="absolute inset-0 rounded-lg p-[1px] bg-gradient-to-r from-indigo-500/10 to-purple-500/10 pointer-events-none"></div>
                    <CardHeader>
                      <CardTitle>Recent Projects</CardTitle>
                      <CardDescription>View and manage your recent video projects.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12 text-zinc-500 dark:text-zinc-400">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                          <Clock className="h-8 w-8 text-zinc-400 dark:text-zinc-500" />
                        </div>
                        <p className="text-lg font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                          No recent projects found
                        </p>
                        <p className="text-sm mt-1 max-w-md mx-auto">
                          Start by uploading a video in the editor tab to create your first project.
                        </p>
                        <Button
                          variant="outline"
                          className="mt-6 group hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-300 dark:hover:border-indigo-800 transition-colors"
                          onClick={() => document.querySelector('[data-value="editor"]')?.click()}
                        >
                          <FileVideo className="mr-2 h-4 w-4 group-hover:text-indigo-500 dark:group-hover:text-indigo-400" />
                          <span>Go to Editor</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {user?.subscriptionTier !== "free" && (
                  <TabsContent value="analytics" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                    <Card className="border-zinc-200/50 bg-white/90 backdrop-blur-sm shadow-sm dark:border-zinc-800/50 dark:bg-zinc-900/90 overflow-hidden">
                      <div className="absolute inset-0 rounded-lg p-[1px] bg-gradient-to-r from-indigo-500/10 to-purple-500/10 pointer-events-none"></div>
                      <CardHeader>
                        <CardTitle>Analytics</CardTitle>
                        <CardDescription>Track your video editing metrics and performance.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-12 text-zinc-500 dark:text-zinc-400">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                            <BarChart3 className="h-8 w-8 text-indigo-500 dark:text-indigo-400" />
                          </div>
                          <p className="text-lg font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                            Analytics Dashboard
                          </p>
                          <p className="text-sm mt-1 max-w-md mx-auto">
                            {user?.subscriptionTier === "pro" || user?.subscriptionTier === "team"
                              ? "You have access to analytics with your current plan. Start creating content to see your stats."
                              : "Upgrade to Pro or Team to access analytics."}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                )}

                <TabsContent value="settings" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                  <Card className="border-zinc-200/50 bg-white/90 backdrop-blur-sm shadow-sm dark:border-zinc-800/50 dark:bg-zinc-900/90 overflow-hidden">
                    <div className="absolute inset-0 rounded-lg p-[1px] bg-gradient-to-r from-indigo-500/10 to-purple-500/10 pointer-events-none"></div>
                    <CardHeader>
                      <CardTitle>Editor Settings</CardTitle>
                      <CardDescription>Customize your video editing experience.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-3">Video Preferences</h3>
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Default Export Format
                              </label>
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="radio"
                                    id="mp4"
                                    name="format"
                                    className="text-indigo-600"
                                    defaultChecked
                                  />
                                  <label htmlFor="mp4" className="text-sm">
                                    MP4
                                  </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <input type="radio" id="webm" name="format" className="text-indigo-600" />
                                  <label htmlFor="webm" className="text-sm">
                                    WebM
                                  </label>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Timestamp Precision
                              </label>
                              <select className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm">
                                <option>Milliseconds (0.001s)</option>
                                <option>Centiseconds (0.01s)</option>
                                <option>Deciseconds (0.1s)</option>
                                <option>Seconds (1s)</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h3 className="text-lg font-medium mb-3">Theme & Appearance</h3>
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Color Theme
                              </label>
                              <div className="flex flex-wrap gap-2">
                                <button className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 ring-2 ring-offset-2 ring-indigo-500 dark:ring-offset-zinc-900"></button>
                                <button className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600"></button>
                                <button className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-green-600"></button>
                                <button className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-pink-600"></button>
                                <button className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600"></button>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Interface Density
                              </label>
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                  <input type="radio" id="compact" name="density" className="text-indigo-600" />
                                  <label htmlFor="compact" className="text-sm">
                                    Compact
                                  </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="radio"
                                    id="comfortable"
                                    name="density"
                                    className="text-indigo-600"
                                    defaultChecked
                                  />
                                  <label htmlFor="comfortable" className="text-sm">
                                    Comfortable
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-6 py-4">
                      <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0">
                        Save Settings
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={<Wand2 className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />}
            title="AI-Powered Editing"
            description="Coming soon: Smart timestamp suggestions based on video content"
            gradient="from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-900/10"
            textGradient="from-indigo-600 to-indigo-700 dark:from-indigo-400 dark:to-indigo-300"
            isPro={true}
          />
          <FeatureCard
            icon={<Layers className="h-5 w-5 text-purple-500 dark:text-purple-400" />}
            title="Batch Processing"
            description="Process multiple videos simultaneously with our queue system"
            gradient="from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10"
            textGradient="from-purple-600 to-purple-700 dark:from-purple-400 dark:to-purple-300"
            isPro={true}
          />
          <FeatureCard
            icon={<Palette className="h-5 w-5 text-rose-500 dark:text-rose-400" />}
            title="Custom Templates"
            description="Create and save your own timestamp templates for future use"
            gradient="from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-900/10"
            textGradient="from-rose-600 to-rose-700 dark:from-rose-400 dark:to-rose-300"
          />
          <FeatureCard
            icon={<Users className="h-5 w-5 text-amber-500 dark:text-amber-400" />}
            title="Team Collaboration"
            description="Share projects with your team and collaborate in real-time"
            gradient="from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/10"
            textGradient="from-amber-600 to-amber-700 dark:from-amber-400 dark:to-amber-300"
            isPro={true}
          />
        </div>
      </main>

      <footer className="container max-w-6xl mx-auto px-4 py-6 mt-12 border-t border-zinc-200 dark:border-zinc-800 text-center">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <BrandLogo size="sm" />
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link
              href="/terms"
              className="text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/contact"
              className="text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors"
            >
              Contact
            </Link>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-600 mt-4 md:mt-0">
            © {new Date().getFullYear()} Video Clipper. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

function SubscriptionCard({ tier }: { tier: string }) {
  const tierInfo = {
    free: {
      icon: Zap,
      title: "Free Plan",
      description: "You're currently on the Free plan with basic features.",
      color: "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100",
      gradient: "from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800",
      buttonText: "Upgrade Now",
      buttonLink: "/pricing",
    },
    pro: {
      icon: Crown,
      title: "Pro Plan",
      description: "You're enjoying premium features with the Pro plan.",
      color: "bg-indigo-100 text-indigo-900 dark:bg-indigo-900/30 dark:text-indigo-100",
      gradient: "from-indigo-200 to-indigo-300 dark:from-indigo-900 dark:to-indigo-800",
      buttonText: "Manage Subscription",
      buttonLink: "/account/billing",
    },
    team: {
      icon: Users,
      title: "Team Plan",
      description: "You have access to all features with team collaboration.",
      color: "bg-purple-100 text-purple-900 dark:bg-purple-900/30 dark:text-purple-100",
      gradient: "from-purple-200 to-purple-300 dark:from-purple-900 dark:to-purple-800",
      buttonText: "Manage Team",
      buttonLink: "/account/team",
    },
  }

  const info = tierInfo[tier as keyof typeof tierInfo] || tierInfo.free
  const Icon = info.icon

  return (
    <Card className="overflow-hidden border-zinc-200/50 bg-white/90 backdrop-blur-sm shadow-sm dark:border-zinc-800/50 dark:bg-zinc-900/90 group hover:shadow-md transition-all">
      <div className="relative">
        <div className={`p-4 ${info.color} bg-gradient-to-r ${info.gradient}`}>
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            <h3 className="font-semibold">{info.title}</h3>
          </div>
        </div>
        {tier !== "free" && (
          <div className="absolute top-0 right-0">
            <div className="bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 text-xs font-medium px-2 py-0.5 rounded-bl-lg">
              Active
            </div>
          </div>
        )}
      </div>
      <CardContent className="pt-6">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{info.description}</p>
      </CardContent>
      <CardFooter>
        <Button
          asChild
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 group-hover:shadow-lg transition-all"
        >
          <Link href={info.buttonLink}>{info.buttonText}</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

function StatsCard() {
  return (
    <Card className="border-zinc-200/50 bg-white/90 backdrop-blur-sm shadow-sm dark:border-zinc-800/50 dark:bg-zinc-900/90 overflow-hidden hover:shadow-md transition-all">
      <div className="absolute inset-0 rounded-lg p-[1px] bg-gradient-to-r from-indigo-500/10 to-purple-500/10 pointer-events-none"></div>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <span>Your Stats</span>
          <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
        </CardTitle>
        <CardDescription>Track your usage and activity.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 rounded-lg bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-900/10 group hover:from-indigo-100 hover:to-indigo-200 dark:hover:from-indigo-900/30 dark:hover:to-indigo-900/40 transition-all">
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
              0
            </p>
            <p className="text-xs text-indigo-700 dark:text-indigo-300">Videos Processed</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 group hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-900/30 dark:hover:to-purple-900/40 transition-all">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
              0
            </p>
            <p className="text-xs text-purple-700 dark:text-purple-300">Clips Created</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function QuickActionsCard() {
  return (
    <Card className="border-zinc-200/50 bg-white/90 backdrop-blur-sm shadow-sm dark:border-zinc-800/50 dark:bg-zinc-900/90 overflow-hidden hover:shadow-md transition-all">
      <div className="absolute inset-0 rounded-lg p-[1px] bg-gradient-to-r from-indigo-500/10 to-purple-500/10 pointer-events-none"></div>
      <CardHeader className="pb-2">
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks you can perform.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            className="h-auto flex-col py-4 justify-start items-center group hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-300 dark:hover:border-indigo-800 transition-colors"
            onClick={() => document.querySelector('[data-value="editor"]')?.click()}
          >
            <FileVideo className="h-5 w-5 mb-1 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors" />
            <span className="text-xs">Upload Video</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col py-4 justify-start items-center group hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 dark:hover:bg-purple-900/30 dark:hover:text-purple-300 dark:hover:border-purple-800 transition-colors"
          >
            <Clock className="h-5 w-5 mb-1 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors" />
            <span className="text-xs">Recent Project</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  gradient,
  textGradient,
  isPro = false,
}: {
  icon: React.ReactNode
  title: string
  description: string
  gradient: string
  textGradient: string
  isPro?: boolean
}) {
  return (
    <Card className="overflow-hidden border-zinc-200/50 bg-white/90 backdrop-blur-sm shadow-sm dark:border-zinc-800/50 dark:bg-zinc-900/90 group hover:shadow-md transition-all">
      <CardContent className="p-6">
        <div
          className={`p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4 bg-gradient-to-br ${gradient} group-hover:scale-110 transition-transform`}
        >
          {icon}
        </div>
        <h3
          className={`text-lg font-semibold mb-2 bg-gradient-to-r ${textGradient} bg-clip-text text-transparent group-hover:translate-x-0.5 transition-transform flex items-center gap-1.5`}
        >
          {title}
          {isPro && (
            <span className="text-xs font-normal px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
              Pro
            </span>
          )}
        </h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
      </CardContent>
    </Card>
  )
}

