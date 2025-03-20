"use client"

import { useState } from "react"
import { BrandLogo } from "@/components/brand-logo"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Play, Pause, Clock, FileVideo, Download, Plus } from "lucide-react"
import Link from "next/link"

export default function DemoPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [timestamps, setTimestamps] = useState([
    { id: 1, time: 15.5, label: "Introduction starts" },
    { id: 2, time: 45.2, label: "Key point 1" },
    { id: 3, time: 78.6, label: "Demo section" },
  ])

  const addTimestamp = () => {
    setTimestamps([
      ...timestamps,
      {
        id: timestamps.length + 1,
        time: currentTime,
        label: `Timestamp ${timestamps.length + 1}`,
      },
    ])
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    const ms = Math.floor((seconds % 1) * 10)
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}.${ms}`
  }

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
            <ThemeToggle />
            <Button size="sm" asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-5xl py-12 relative z-10">
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center gap-2 mb-2">
              <div className="h-1 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"></div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-800 dark:text-zinc-200">
                Video Clipper Demo
              </h1>
              <div className="h-1 w-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"></div>
            </div>

            <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Experience the core features of our video timestamp and clip extraction tool
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card className="border-zinc-200/50 bg-white/90 backdrop-blur-sm shadow-sm dark:border-zinc-800/50 dark:bg-zinc-900/90 overflow-hidden">
                <div className="absolute inset-0 rounded-lg p-[1px] bg-gradient-to-r from-indigo-500/10 to-purple-500/10 pointer-events-none"></div>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <FileVideo className="h-5 w-5 text-indigo-500" />
                    Video Preview
                  </CardTitle>
                  <CardDescription>Interactive demo of the video player</CardDescription>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6">
                  <div className="aspect-video bg-zinc-900 rounded-lg relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-zinc-400">Demo video player</p>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-white font-medium">{formatTime(currentTime)}</div>
                        <div className="text-white font-medium">03:24</div>
                      </div>
                      <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden mb-4">
                        <div
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${(currentTime / 204) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-center gap-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:text-white hover:bg-white/20"
                          onClick={() => {
                            setIsPlaying(!isPlaying)
                            if (!isPlaying) {
                              const interval = setInterval(() => {
                                setCurrentTime(prev => {
                                  if (prev >= 204) {
                                    clearInterval(interval)
                                    setIsPlaying(false)
                                    return 0
                                  }
                                  return prev + 0.1
                                })
                              }, 100)
                              return () => clearInterval(interval)
                            }
                          }}
                        >
                          {isPlaying ? (
                            <Pause className="h-6 w-6" />
                          ) : (
                            <Play className="h-6 w-6" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white hover:text-white hover:bg-white/20"
                          onClick={addTimestamp}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Timestamp
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="border-zinc-200/50 bg-white/90 backdrop-blur-sm shadow-sm dark:border-zinc-800/50 dark:bg-zinc-900/90 overflow-hidden">
                <div className="absolute inset-0 rounded-lg p-[1px] bg-gradient-to-r from-indigo-500/10 to-purple-500/10 pointer-events-none"></div>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-indigo-500" />
                    Timestamps
                  </CardTitle>
                  <CardDescription>Recorded video timestamps</CardDescription>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6">
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                    {timestamps.map((timestamp) => (
                      <div
                        key={timestamp.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-mono text-sm rounded-md px-2 py-1">
                            {formatTime(timestamp.time)}
                          </div>
                          <div className="text-sm font-medium">{timestamp.label}</div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4">
                    <Button className="w-full" onClick={addTimestamp}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Timestamp
                    </Button>
                  </div>

                  <div className="mt-4">
                    <Button variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Export Timestamps
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-200 mb-4">
              Ready to try the full version?
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6 max-w-2xl mx-auto">
              Sign up now to access all features and start creating precise video timestamps and clips.
            </p>
            <Button
              size="lg"
              asChild
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0"
            >
              <Link href="/signup">Create Free Account</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}