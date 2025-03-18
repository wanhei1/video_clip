import { VideoTimestampTool } from "@/components/video-timestamp-tool"
import { ThemeToggle } from "@/components/theme-toggle"
import { Github } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-50 via-slate-50 to-zinc-100 dark:from-zinc-950 dark:via-slate-950 dark:to-zinc-900 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-800 dark:text-zinc-200 md:text-4xl">Video Clipper</h1>
            <p className="text-zinc-600 dark:text-zinc-400">Record timestamps and extract clips with precision</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <a href="https://github.com/wanhei1/video_clip" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <Github className="h-4 w-4" />
              </a>
            </Button>
            <ThemeToggle />
          </div>
        </header>
        <VideoTimestampTool />
        <footer className="mt-12 text-center text-sm text-zinc-500 dark:text-zinc-600">
          <p>© {new Date().getFullYear()} ClipApp. All rights reserved.</p>
        </footer>
      </div>
    </main>
  )
}

