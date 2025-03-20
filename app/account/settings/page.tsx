"use client"

import { BrandLogo } from "@/components/brand-logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/user-nav"
import { Settings } from "@/components/settings"

export default function SettingsPage() {
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
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center gap-2 mb-2">
            <div className="h-1 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"></div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-800 dark:text-zinc-200">
              Account Settings
            </h1>
            <div className="h-1 w-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"></div>
          </div>

          <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Customize your account and application preferences
          </p>
        </div>

        <Settings />
      </main>
    </div>
  )
}