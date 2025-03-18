"use client"

import { forwardRef, useState, useEffect, useRef, type ForwardedRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize, Minimize, Settings } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Add a new prop to accept timestamps and activeTimestamp
interface VideoPlayerProps {
  src: string
  timestamps?: Array<{
    id: string
    startTime: number
    endTime: number | null
    label: string
  }>
  activeTimestamp?: string | null
  onTimeUpdate?: (time: number) => void
}

export const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(
  ({ src, timestamps = [], activeTimestamp = null, onTimeUpdate }, ref: ForwardedRef<HTMLVideoElement>) => {
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(1)
    const [isMuted, setIsMuted] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [playbackRate, setPlaybackRate] = useState("1")
    const [showControls, setShowControls] = useState(true)
    const [isHovering, setIsHovering] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Connect the forwarded ref to our local ref
    useEffect(() => {
      if (typeof ref === "function") {
        ref(videoRef.current)
      } else if (ref) {
        ref.current = videoRef.current
      }
    }, [ref])

    useEffect(() => {
      const video = videoRef.current
      if (!video) return

      const handleTimeUpdate = () => {
        setCurrentTime(video.currentTime)
        if (typeof onTimeUpdate === "function") {
          onTimeUpdate(video.currentTime)
        }
      }
      const onDurationChange = () => setDuration(video.duration)
      const onPlay = () => setIsPlaying(true)
      const onPause = () => setIsPlaying(false)
      const onVolumeChange = () => {
        setVolume(video.volume)
        setIsMuted(video.muted)
      }

      video.addEventListener("timeupdate", handleTimeUpdate)
      video.addEventListener("durationchange", onDurationChange)
      video.addEventListener("play", onPlay)
      video.addEventListener("pause", onPause)
      video.addEventListener("volumechange", onVolumeChange)

      return () => {
        video.removeEventListener("timeupdate", handleTimeUpdate)
        video.removeEventListener("durationchange", onDurationChange)
        video.removeEventListener("play", onPlay)
        video.removeEventListener("pause", onPause)
        video.removeEventListener("volumechange", onVolumeChange)
      }
    }, [onTimeUpdate])

    useEffect(() => {
      const handleFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement)
      }

      document.addEventListener("fullscreenchange", handleFullscreenChange)
      return () => {
        document.removeEventListener("fullscreenchange", handleFullscreenChange)
      }
    }, [])

    useEffect(() => {
      if (videoRef.current) {
        videoRef.current.playbackRate = Number(playbackRate)
      }
    }, [playbackRate])

    // Handle keyboard shortcuts
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        // Only handle shortcuts if the video player is in focus
        if (!containerRef.current?.contains(document.activeElement)) return

        switch (e.key.toLowerCase()) {
          case " ":
          case "k":
            e.preventDefault()
            togglePlay()
            break
          case "j":
            e.preventDefault()
            skipBackward()
            break
          case "l":
            e.preventDefault()
            skipForward()
            break
          case "m":
            e.preventDefault()
            toggleMute()
            break
          case "f":
            e.preventDefault()
            toggleFullscreen()
            break
          case "arrowleft":
            e.preventDefault()
            skipBackward()
            break
          case "arrowright":
            e.preventDefault()
            skipForward()
            break
          case "arrowup":
            e.preventDefault()
            if (videoRef.current) {
              const newVolume = Math.min(1, videoRef.current.volume + 0.1)
              videoRef.current.volume = newVolume
            }
            break
          case "arrowdown":
            e.preventDefault()
            if (videoRef.current) {
              const newVolume = Math.max(0, videoRef.current.volume - 0.1)
              videoRef.current.volume = newVolume
            }
            break
        }
      }

      window.addEventListener("keydown", handleKeyDown)
      return () => {
        window.removeEventListener("keydown", handleKeyDown)
      }
    }, [])

    // Auto-hide controls
    useEffect(() => {
      if (isHovering || !isPlaying) {
        setShowControls(true)
        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current)
        }
        return
      }

      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }

      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false)
      }, 2000)

      return () => {
        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current)
        }
      }
    }, [isHovering, isPlaying])

    const togglePlay = useCallback(() => {
      if (!videoRef.current) return

      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
    }, [isPlaying])

    const toggleMute = useCallback(() => {
      if (!videoRef.current) return

      videoRef.current.muted = !isMuted
    }, [isMuted])

    const handleVolumeChange = useCallback(
      (value: number[]) => {
        if (!videoRef.current) return

        const newVolume = value[0]
        videoRef.current.volume = newVolume

        if (newVolume === 0) {
          videoRef.current.muted = true
        } else if (isMuted) {
          videoRef.current.muted = false
        }
      },
      [isMuted],
    )

    const handleSeek = useCallback((value: number[]) => {
      if (!videoRef.current) return

      videoRef.current.currentTime = value[0]
    }, [])

    const skipForward = useCallback(() => {
      if (!videoRef.current) return

      videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, duration)
    }, [duration])

    const skipBackward = useCallback(() => {
      if (!videoRef.current) return

      videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10, 0)
    }, [])

    const toggleFullscreen = useCallback(() => {
      if (!containerRef.current) return

      if (!isFullscreen) {
        containerRef.current.requestFullscreen()
      } else {
        document.exitFullscreen()
      }
    }, [isFullscreen])

    const formatTime = useCallback((time: number) => {
      const minutes = Math.floor(time / 60)
      const seconds = Math.floor(time % 60)
      return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    }, [])

    // Add this function to render timestamp markers
    const renderTimestampMarkers = useCallback(() => {
      if (!timestamps.length || !duration) return null

      return timestamps.map((timestamp) => {
        const startPercent = (timestamp.startTime / duration) * 100
        const isActive = activeTimestamp === timestamp.id

        // If there's an end time, render a range
        if (timestamp.endTime !== null) {
          const endPercent = (timestamp.endTime / duration) * 100
          const width = endPercent - startPercent

          return (
            <div
              key={timestamp.id}
              className="absolute top-0 z-10 h-full"
              style={{ left: `${startPercent}%`, width: `${width}%` }}
            >
              <div
                className={`h-full rounded-sm transition-colors ${
                  isActive ? "bg-rose-500/40 dark:bg-rose-500/60" : "bg-indigo-500/20 dark:bg-indigo-500/40"
                }`}
              />
            </div>
          )
        }

        // Otherwise just render a marker for the start time
        return (
          <div
            key={timestamp.id}
            className={`absolute top-0 z-10 h-full w-1 transition-colors ${
              isActive ? "bg-rose-500 dark:bg-rose-400" : "bg-indigo-500/60 dark:bg-indigo-400/60"
            }`}
            style={{ left: `${startPercent}%` }}
          />
        )
      })
    }, [timestamps, duration, activeTimestamp])

    // Improved UI based on the requirements
    return (
      <div
        ref={containerRef}
        className={cn(
          "group relative overflow-hidden rounded-lg bg-black transition-all",
          isFullscreen ? "fixed inset-0 z-50 rounded-none" : "aspect-video w-full",
        )}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={() => {
          setIsHovering(true)
          setShowControls(true)
        }}
        tabIndex={0}
      >
        <video ref={videoRef} src={src} className="h-full w-full" onClick={togglePlay} playsInline />

        {/* Play/Pause overlay for center of video */}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-opacity",
            isPlaying ? "opacity-0" : "opacity-100",
            !showControls && "opacity-0",
          )}
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-20 w-20 rounded-full bg-black/30 text-white backdrop-blur-sm transition-transform hover:bg-black/40 hover:scale-105"
            onClick={togglePlay}
          >
            {isPlaying ? <Pause className="h-10 w-10" /> : <Play className="h-10 w-10 ml-1" />}
          </Button>
        </div>

        {/* Controls overlay */}
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-4 transition-all",
            showControls ? "opacity-100" : "opacity-0",
            isFullscreen ? "pb-8" : "",
          )}
        >
          {/* Progress bar with timestamp markers */}
          <div className="mb-4 relative">
            {renderTimestampMarkers()}
            <Slider
              value={[currentTime]}
              min={0}
              max={duration || 100}
              step={0.01}
              onValueChange={handleSeek}
              className="relative z-20 [&>span:first-child]:h-1.5 [&>span:first-child]:bg-white/30 [&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:bg-white [&>span:first-child_span]:bg-indigo-500 dark:[&>span:first-child_span]:bg-indigo-400"
            />
          </div>

          {/* Control buttons */}
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white" onClick={togglePlay}>
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">{isPlaying ? "Pause (k)" : "Play (k)"}</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white" onClick={skipBackward}>
                    <SkipBack className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Rewind 10s (j)</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white" onClick={skipForward}>
                    <SkipForward className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Forward 10s (l)</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="flex items-center gap-2 ml-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white" onClick={toggleMute}>
                      {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">{isMuted ? "Unmute (m)" : "Mute (m)"}</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div className="w-24">
                <Slider
                  value={[isMuted ? 0 : volume]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                  className="[&>span:first-child]:h-1 [&>span:first-child]:bg-white/30 [&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_[role=slider]]:bg-white [&>span:first-child_span]:bg-white"
                />
              </div>
            </div>

            <div className="text-sm text-white ml-2">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>

            {/* Playback speed dropdown */}
            <div className="ml-auto flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-white">
                    <Settings className="h-4 w-4 mr-1" />
                    {playbackRate}x
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[180px]">
                  <DropdownMenuLabel>Playback Speed</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup value={playbackRate} onValueChange={setPlaybackRate}>
                    <DropdownMenuRadioItem value="0.25">0.25x</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="0.5">0.5x</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="0.75">0.75x</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="1">1x (Normal)</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="1.25">1.25x</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="1.5">1.5x</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="1.75">1.75x</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="2">2x</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white" onClick={toggleFullscreen}>
                      {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">{isFullscreen ? "Exit Fullscreen (f)" : "Fullscreen (f)"}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>
    )
  },
)

VideoPlayer.displayName = "VideoPlayer"

