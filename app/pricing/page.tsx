"use client"

import { useUser } from "@/contexts/user-context"
import { BrandLogo } from "@/components/brand-logo"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/user-nav"
import { PricingPlans } from "@/components/pricing-plans"
import { Check } from "lucide-react"
import Link from "next/link"

export default function PricingPage() {
  const { user } = useUser()

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-slate-50 to-zinc-100 dark:from-zinc-950 dark:via-slate-950 dark:to-zinc-900">
      <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur-sm dark:bg-zinc-950/80 dark:border-zinc-800">
        <div className="container flex h-16 items-center justify-between py-4">
          <BrandLogo />
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/features">Features</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/pricing">Pricing</Link>
            </Button>
            <ThemeToggle />
            {user ? (
              <UserNav />
            ) : (
              <Button size="sm" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container py-12">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-800 dark:text-zinc-200 md:text-4xl mb-4">
            Choose Your Plan
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Select the perfect plan for your needs. Upgrade anytime to unlock more features and capabilities.
          </p>
        </div>

        <PricingPlans />

        <div className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-200 mb-8 text-center">
            Compare Plans
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-4 border-b border-zinc-200 dark:border-zinc-800"></th>
                  <th className="p-4 border-b border-zinc-200 dark:border-zinc-800 text-center">
                    <div className="font-medium text-zinc-800 dark:text-zinc-200">Free</div>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400">$0/month</div>
                  </th>
                  <th className="p-4 border-b border-zinc-200 dark:border-zinc-800 text-center bg-indigo-50 dark:bg-indigo-900/20">
                    <div className="font-medium text-zinc-800 dark:text-zinc-200">Pro</div>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400">$9.99/month</div>
                  </th>
                  <th className="p-4 border-b border-zinc-200 dark:border-zinc-800 text-center">
                    <div className="font-medium text-zinc-800 dark:text-zinc-200">Team</div>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400">$24.99/month</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-4 border-b border-zinc-200 dark:border-zinc-800 font-medium text-zinc-800 dark:text-zinc-200">
                    Record Timestamps
                  </td>
                  <td className="p-4 border-b border-zinc-200 dark:border-zinc-800 text-center">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 border-b border-zinc-200 dark:border-zinc-800 text-center bg-indigo-50 dark:bg-indigo-900/20">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 border-b border-zinc-200 dark:border-zinc-800 text-center">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-zinc-200 dark:border-zinc-800 font-medium text-zinc-800 dark:text-zinc-200">
                    Basic Clip Extraction
                  </td>
                  <td className="p-4 border-b border-zinc-200 dark:border-zinc-800 text-center">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 border-b border-zinc-200 dark:border-zinc-800 text-center bg-indigo-50 dark:bg-indigo-900/20">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 border-b border-zinc-200 dark:border-zinc-800 text-center">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-zinc-200 dark:border-zinc-800 font-medium text-zinc-800 dark:text-zinc-200">
                    Export to CSV/JSON
                  </td>
                  <td className="p-4 border-b border-zinc-200 dark:border-zinc-800 text-center">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 border-b border-zinc-200 dark:border-zinc-800 text-center bg-indigo-50 dark:bg-indigo-900/20">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 border-b border-zinc-200 dark:border-zinc-800 text-center">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-zinc-200 dark:border-zinc-800 font-medium text-zinc-800 dark:text-zinc-200">
                    High-Quality Exports
                  </td>
                  <td className="p-4 border-b border-zinc-200 dark:border-zinc-800 text-center">
                    <span className="text-zinc-400 dark:text-zinc-600">—</span>
                  </td>
                  <td className="p-4 border-b border-zinc-200 dark:border-zinc-800 text-center bg-indigo-50 dark:bg-indigo-900/20">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 border-b border-zinc-200 dark:border-zinc-800 text-center">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-zinc-200 dark:border-zinc-800 font-medium text-zinc-800 dark:text-zinc-200">
                    Batch Processing
                  </td>
                  <td className="p-4 border-b border-zinc-200 dark:border-zinc-800 text-center">
                    <span className="text-zinc-400 dark:text-zinc-600">—</span>
                  </td>
                  <td className="p-4 border-b border-zinc-200 dark:border-zinc-800 text-center bg-indigo-50 dark:bg-indigo-900/20">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 border-b border-zinc-200 dark:border-zinc-800 text-center">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-zinc-200 dark:border-zinc-800 font-medium text-zinc-800 dark:text-zinc-200">
                    Cloud Storage
                  </td>
                  <td className="p-4 border-b border-zinc-200 dark:border-zinc-800 text-center">
                    <span className="text-zinc-400 dark:text-zinc-600">—</span>
                  </td>
                  <td className="p-4 border-b border-zinc-200 dark:border-zinc-800 text-center bg-indigo-50 dark:bg-indigo-900/20">
                    <div className="text-sm text-zinc-700 dark:text-zinc-300">5GB</div>
                  </td>
                  <td className="p-4 border-b border-zinc-200 dark:border-zinc-800 text-center">
                    <div className="text-sm text-zinc-700 dark:text-zinc-300">50GB</div>
                  </td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-zinc-200 dark:border-zinc-800 font-medium text-zinc-800 dark:text-zinc-200">
                    Team Collaboration
                  </td>
                  <td className="p-4 border-b border-zinc-200 dark:border-zinc-800 text-center">
                    <span className="text-zinc-400 dark:text-zinc-600">—</span>
                  </td>
                  <td className="p-4 border-b border-zinc-200 dark:border-zinc-800 text-center bg-indigo-50 dark:bg-indigo-900/20">
                    <span className="text-zinc-400 dark:text-zinc-600">—</span>
                  </td>
                  <td className="p-4 border-b border-zinc-200 dark:border-zinc-800 text-center">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-zinc-200 dark:border-zinc-800 font-medium text-zinc-800 dark:text-zinc-200">
                    API Access
                  </td>
                  <td className="p-4 border-b border-zinc-200 dark:border-zinc-800 text-center">
                    <span className="text-zinc-400 dark:text-zinc-600">—</span>
                  </td>
                  <td className="p-4 border-b border-zinc-200 dark:border-zinc-800 text-center bg-indigo-50 dark:bg-indigo-900/20">
                    <span className="text-zinc-400 dark:text-zinc-600">—</span>
                  </td>
                  <td className="p-4 border-b border-zinc-200 dark:border-zinc-800 text-center">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-zinc-200 dark:border-zinc-800 font-medium text-zinc-800 dark:text-zinc-200">
                    Priority Support
                  </td>
                  <td className="p-4 border-b border-zinc-200 dark:border-zinc-800 text-center">
                    <span className="text-zinc-400 dark:text-zinc-600">—</span>
                  </td>
                  <td className="p-4 border-b border-zinc-200 dark:border-zinc-800 text-center bg-indigo-50 dark:bg-indigo-900/20">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 border-b border-zinc-200 dark:border-zinc-800 text-center">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            All plans include a 14-day money-back guarantee. No questions asked.
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-1">
            Need help choosing?{" "}
            <a
              href="#"
              className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Contact our team
            </a>
          </p>
        </div>
      </main>

      <footer className="container mx-auto px-4 py-8 mt-12 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <BrandLogo size="sm" />
          <p className="text-sm text-zinc-500 dark:text-zinc-600 mt-4 md:mt-0">
            © {new Date().getFullYear()} Video Clipper. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

