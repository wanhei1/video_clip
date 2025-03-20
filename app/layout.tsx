import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { UserProvider } from "@/contexts/user-context"
import { Analytics } from "@vercel/analytics/react"


import { SessionProvider } from "@/components/session-provider"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Video Clipper - Professional Video Timestamp Tool",
  description: "Record timestamps and extract high-quality clips from your videos with precision",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192x192.svg", sizes: "192x192" },
      { url: "/icon-512x512.svg", sizes: "512x512" }
    ],
    apple: "/apple-touch-icon.svg",
    shortcut: "/favicon.ico"
  },
  manifest: "/manifest.json",
  themeColor: "#6366f1",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SessionProvider>
            <UserProvider>
              {children}
              <Analytics />
              <Toaster />
            </UserProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'