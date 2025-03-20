"use client"

import { BrandLogo } from "@/components/brand-logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/user-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Play, Clock, FileVideo, Tag, Download, Settings } from "lucide-react"
import Link from "next/link"

export default function TutorialPage() {
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
            <UserNav />
          </div>
        </div>
      </header>

      <main className="container max-w-4xl py-12 relative z-10">
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/dashboard" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>

          <div className="text-center">
            <div className="inline-flex items-center justify-center gap-2 mb-2">
              <div className="h-1 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"></div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-800 dark:text-zinc-200">
                Video Timestamp Studio Tutorial
              </h1>
              <div className="h-1 w-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"></div>
            </div>

            <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Learn how to use the Video Timestamp Studio to create precise timestamps and extract clips
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <Card className="border-zinc-200/50 bg-white/90 backdrop-blur-sm shadow-sm dark:border-zinc-800/50 dark:bg-zinc-900/90 overflow-hidden">
            <div className="absolute inset-0 rounded-lg p-[1px] bg-gradient-to-r from-indigo-500/10 to-purple-500/10 pointer-events-none"></div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5 text-indigo-500" />
                Getting Started
              </CardTitle>
              <CardDescription>Learn the basics of the Video Timestamp Studio</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-full p-2 mt-1">
                    <FileVideo className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">1. Upload a Video</h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                      Start by uploading a video file from your computer. The Video Timestamp Studio supports
                      most common video formats including MP4, WebM, and MOV.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full p-2 mt-1">
                    <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">2. Create Timestamps</h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                      While watching your video, click the "Add Timestamp" button at key moments. You can add
                      a description to each timestamp to help identify the content.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-rose-100 dark:bg-rose-900/30 rounded-full p-2 mt-1">
                    <Tag className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">3. Organize Your Timestamps</h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                      Edit, reorder, or delete timestamps as needed. You can also categorize them with tags
                      for better organization.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-amber-100 dark:bg-amber-900/30 rounded-full p-2 mt-1">
                    <Download className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">4. Export Your Work</h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                      Export your timestamps as a CSV or JSON file. You can also extract clips based on your
                      timestamps and download them as separate video files.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-emerald-100 dark:bg-emerald-900/30 rounded-full p-2 mt-1">
                    <Settings className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">5. Customize Settings</h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                      Adjust the timestamp precision, export format, and other settings to match your
                      workflow preferences.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Button asChild>
                  <Link href="/dashboard">
                    Start Using Video Timestamp Studio
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-200/50 bg-white/90 backdrop-blur-sm shadow-sm dark:border-zinc-800/50 dark:bg-zinc-900/90 overflow-hidden">
            <div className="absolute inset-0 rounded-lg p-[1px] bg-gradient-to-r from-indigo-500/10 to-purple-500/10 pointer-events-none"></div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5 text-indigo-500" />
                Video Tutorial
              </CardTitle>
              <CardDescription>Watch a quick video walkthrough of the main features</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <div className="aspect-video bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center">
                <p className="text-zinc-500 dark:text-zinc-400">Video tutorial coming soon</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}