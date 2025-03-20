"use client"

import type React from "react"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { BrandLogo } from "@/components/brand-logo"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Github, ArrowRight, Sparkles, Zap } from "lucide-react"
import Link from "next/link"

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard")
    }
  }, [status, router])

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-pulse text-center">
          <BrandLogo size="lg" animated />
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-slate-50 to-zinc-100 dark:from-zinc-950 dark:via-slate-950 dark:to-zinc-900 overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.02] pointer-events-none"></div>

      {/* Gradient orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-500/20 dark:bg-indigo-500/10 rounded-full blur-3xl opacity-30 animate-pulse-slow pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-3xl opacity-30 animate-pulse-slow pointer-events-none"></div>

      <header className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex items-center justify-between">
          <BrandLogo animated />
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/pricing">Pricing</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/features">Features</Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="https://github.com/wanhei1/video_clip" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <Github className="h-4 w-4" />
              </a>
            </Button>
            <ThemeToggle />
            <Button size="sm" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-4">
            <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300">
              <Sparkles className="h-3.5 w-3.5 mr-1" />
              Professional Video Editing Made Simple
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-zinc-900 via-indigo-800 to-purple-900 dark:from-white dark:via-indigo-300 dark:to-purple-300 bg-clip-text text-transparent animate-gradient-shift bg-[length:300%_100%]">
            Precision Video Timestamps & Clips
          </h1>

          <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-8 max-w-2xl mx-auto">
            Record timestamps, extract high-quality clips, and collaborate with your team. The perfect tool for content
            creators and video editors.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              asChild
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0"
            >
              <Link href="/signup">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="group">
              <Link href="/demo" className="flex items-center">
                <Zap className="mr-2 h-4 w-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                Try Demo
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-16">
          <FeatureCard
            icon={<Zap className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />}
            title="Precise Timestamps"
            description="Record timestamps with millisecond precision for perfect clip extraction."
            gradient="from-blue-500 to-indigo-500"
          />
          <FeatureCard
            icon={<div className="h-6 w-6 text-purple-600 dark:text-purple-400"><Scissors /></div>}
            title="High-Quality Exports"
            description="Extract clips in multiple formats with our premium quality preservation technology."
            gradient="from-indigo-500 to-purple-500"
          />
          <FeatureCard
            icon={<div className="h-6 w-6 text-pink-600 dark:text-pink-400"><Users /></div>}
            title="Team Collaboration"
            description="Share projects with your team and collaborate on video editing in real-time."
            gradient="from-purple-500 to-pink-500"
          />
        </div>

        {/* CTA section */}
        <div className="mt-24 max-w-3xl mx-auto text-center">
          <div className="relative p-8 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-10 dark:opacity-20"></div>
            <div className="absolute inset-0 bg-dot-pattern opacity-10"></div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-zinc-800 dark:text-zinc-200 relative z-10">
              Ready to transform your video editing workflow?
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6 relative z-10">
              Join thousands of professionals who trust Video Clipper for their editing needs.
            </p>
            <Button
              size="lg"
              asChild
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 relative z-10"
            >
              <Link href="/signup">Start Free Trial</Link>
            </Button>
          </div>
        </div>
      </main>

      <footer className="container mx-auto px-4 py-8 mt-12 border-t border-zinc-200 dark:border-zinc-800 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <BrandLogo size="sm" />
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/terms" className="text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300">
              Privacy
            </Link>
            <Link href="/contact" className="text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300">
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

function FeatureCard({
  icon,
  title,
  description,
  gradient,
}: {
  icon: React.ReactNode
  title: string
  description: string
  gradient: string
}) {
  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 group hover:shadow-md transition-all">
      <div
        className={`bg-gradient-to-br ${gradient} p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
        {title}
      </h3>
      <p className="text-zinc-600 dark:text-zinc-400">{description}</p>
    </div>
  )
}

function Users() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function Scissors() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <line x1="20" y1="4" x2="8.12" y2="15.88" />
      <line x1="14.47" y1="14.48" x2="20" y2="20" />
      <line x1="8.12" y1="8.12" x2="12" y2="12" />
    </svg>
  )
}

