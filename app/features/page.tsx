"use client"

import { BrandLogo } from "@/components/brand-logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/user-nav"
import { SubscriptionBadge } from "@/components/subscription-badge"
import { Check, Sparkles, Zap, Clock, Cloud, Users, Wand2, FileVideo, Layers, Palette } from "lucide-react"
import Link from "next/link"

export default function FeaturesPage() {
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

      <main className="container max-w-6xl py-12 relative z-10">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center gap-2 mb-2">
            <div className="h-1 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"></div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-800 dark:text-zinc-200">
              ClipApp Features
            </h1>
            <div className="h-1 w-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"></div>
          </div>

          <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Discover all the powerful features available in our video editing platform
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
          <FeatureCard
            icon={<FileVideo className="h-6 w-6 text-indigo-500" />}
            title="Advanced Video Editing"
            description="Precise timestamp marking, clip extraction, and frame-by-frame analysis for detailed video review."
            tier="free"
          />
          <FeatureCard
            icon={<Clock className="h-6 w-6 text-indigo-500" />}
            title="Timestamp Management"
            description="Create, organize and export timestamps with custom labels and shortcuts for efficient workflow."
            tier="free"
          />
          <FeatureCard
            icon={<Palette className="h-6 w-6 text-purple-500" />}
            title="Custom Templates"
            description="Create and save custom timestamp templates for different types of videos and analysis needs."
            tier="pro"
          />
          <FeatureCard
            icon={<Layers className="h-6 w-6 text-purple-500" />}
            title="Batch Processing"
            description="Process multiple videos simultaneously with our queue system for maximum productivity."
            tier="pro"
          />
          <FeatureCard
            icon={<Cloud className="h-6 w-6 text-purple-500" />}
            title="Cloud Storage"
            description="Store your clips and projects in the cloud with 5GB of secure storage space included."
            tier="pro"
          />
          <FeatureCard
            icon={<Wand2 className="h-6 w-6 text-purple-500" />}
            title="AI-Powered Editing"
            description="Leverage AI to automatically detect key moments and generate timestamps in your videos."
            tier="pro"
          />
          <FeatureCard
            icon={<Users className="h-6 w-6 text-blue-500" />}
            title="Team Collaboration"
            description="Share projects with your team and collaborate in real-time with role-based permissions."
            tier="team"
          />
          <FeatureCard
            icon={<Zap className="h-6 w-6 text-blue-500" />}
            title="Advanced Analytics"
            description="Get detailed insights into your video content with comprehensive analytics and reports."
            tier="team"
          />
          <FeatureCard
            icon={<Sparkles className="h-6 w-6 text-blue-500" />}
            title="Priority Support"
            description="Get priority access to our support team and exclusive early access to new features."
            tier="team"
          />
        </div>

        <div className="flex justify-center">
          <Button asChild size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0">
            <Link href="/pricing" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              View Pricing Plans
            </Link>
          </Button>
        </div>
      </main>
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  tier: "free" | "pro" | "team"
}

function FeatureCard({ icon, title, description, tier }: FeatureCardProps) {
  return (
    <Card className="border-zinc-200/50 bg-white/90 backdrop-blur-sm shadow-sm dark:border-zinc-800/50 dark:bg-zinc-900/90 overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <div className="absolute inset-0 rounded-lg p-[1px] bg-gradient-to-r from-indigo-500/10 to-purple-500/10 pointer-events-none"></div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          {icon}
          <SubscriptionBadge tier={tier} size="sm" />
        </div>
        <CardTitle className="text-lg font-medium mt-2">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm text-zinc-600 dark:text-zinc-400">
          {description}
        </CardDescription>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="flex items-center text-xs text-indigo-600 dark:text-indigo-400 font-medium">
          <Check className="h-3.5 w-3.5 mr-1" />
          {tier === "free" ? "Available in Free Plan" : tier === "pro" ? "Available in Pro Plan" : "Available in Team Plan"}
        </div>
      </CardFooter>
    </Card>
  )
}