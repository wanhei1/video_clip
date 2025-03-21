"use client"

import { useState, useRef, useCallback, useEffect, type ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  FileVideo,
  Scissors,
  FileJson,
  FileSpreadsheet,
  Download,
  X,
  AlertTriangle,
  Info,
  Keyboard,
  Settings,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Progress } from "./ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { Separator } from "./ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Add this at the top of the file, after the imports
import { useUser } from "@/contexts/user-context"
import { PremiumFeature } from "@/components/premium-feature"
import { VideoPlayer } from "@/components/video-player"
import { TimestampList } from "@/components/timestamp-list"

// Extend HTMLVideoElement type to include captureStream method
declare global {
  interface HTMLVideoElement {
    captureStream?: () => MediaStream
    mozCaptureStream?: () => MediaStream
  }
}

type Timestamp = {
  id: string
  startTime: number
  endTime: number | null
  label: string
}

// Inside the VideoTimestampTool component, add this near the top
export function VideoTimestampTool() {
  const { user, hasAccess } = useUser()

  const [videoSrc, setVideoSrc] = useState<string | null>(null)
  const [videoName, setVideoName] = useState<string>("")
  const [timestamps, setTimestamps] = useState<Timestamp[]>([])
  const [activeTimestamp, setActiveTimestamp] = useState<string | null>(null)
  const [selectedTimestamp, setSelectedTimestamp] = useState<string | null>(null)
  const [clipName, setClipName] = useState<string>("")
  const [isExtractingAll, setIsExtractingAll] = useState(false)
  const [extractionProgress, setExtractionProgress] = useState({ current: 0, total: 0 })
  const [exportFormat, setExportFormat] = useState<"mp4" | "webm">("mp4")
  const [showFormatDialog, setShowFormatDialog] = useState(false)
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [currentVideoTime, setCurrentVideoTime] = useState(0)
  const [performanceMode, setPerformanceMode] = useState<"balanced" | "performance" | "quality">("balanced")
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<BlobPart[]>([])
  const extractionCancelRef = useRef<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Check browser support for MediaRecorder
  const [browserSupport, setBrowserSupport] = useState({
    mediaRecorder: typeof MediaRecorder !== "undefined",
    captureStream: false,
    mp4Support: false,
  })

  // 根据性能模式应用不同级别的优化
  const applyPerformanceMode = useCallback(() => {
    if (!videoRef.current) return;
    
    switch (performanceMode) {
      case "performance":
        // 性能优先模式 - 最大限度提高性能
        videoRef.current.style.imageRendering = 'pixelated';
        videoRef.current.style.transform = 'translateZ(0)';
        
        // 降低分辨率和帧率
        if (videoRef.current.videoWidth > 640) {
          videoRef.current.style.width = '640px';
          videoRef.current.style.height = 'auto';
        }
        
        // 告知用户已应用性能模式
        toast({
          title: "性能模式已启用",
          description: "视频质量已降低以提高播放流畅度",
        });
        break;
        
      case "quality":
        // 质量优先模式 - 提供最佳视频质量
        videoRef.current.style.imageRendering = 'auto';
        videoRef.current.style.transform = '';
        videoRef.current.style.width = '100%';
        videoRef.current.style.height = 'auto';
        
        toast({
          title: "质量模式已启用",
          description: "视频将以最佳质量播放，可能影响性能",
        });
        break;
        
      case "balanced":
      default:
        // 平衡模式 - 默认设置
        videoRef.current.style.imageRendering = 'auto';
        videoRef.current.style.transform = '';
        
        // 根据视频分辨率自动调整
        if (videoRef.current.videoWidth > 1920) {
          videoRef.current.style.imageRendering = 'pixelated';
        }
        break;
    }
  }, [performanceMode]);
  
  // 在性能模式变化或视频加载时应用设置
  useEffect(() => {
    if (videoSrc) {
      applyPerformanceMode();
    }
  }, [performanceMode, videoSrc, applyPerformanceMode]);

  useEffect(() => {
    // Check for captureStream support
    const video = document.createElement("video")
    const hasCapture = !!video.captureStream || !!video.mozCaptureStream

    // Check for MP4 support
    const mp4Support = typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported("video/mp4")

    setBrowserSupport({
      mediaRecorder: typeof MediaRecorder !== "undefined",
      captureStream: hasCapture,
      mp4Support,
    })

    // Set default export format based on support
    if (!mp4Support) {
      setExportFormat("webm")
    }
  }, [])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (e.key.toLowerCase()) {
        case "b":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            handleStartTimestamp()
          }
          break
        case "e":
          if ((e.ctrlKey || e.metaKey) && activeTimestamp) {
            e.preventDefault()
            handleEndTimestamp()
          }
          break
        case "o":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            fileInputRef.current?.click()
          }
          break
        case "?":
          e.preventDefault()
          setShowKeyboardShortcuts(true)
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [activeTimestamp])

  // Handle file drag and drop
  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault()
      setIsDragging(true)
    }

    const handleDragLeave = () => {
      setIsDragging(false)
    }

    const handleDrop = (e: DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0]
        if (file.type.startsWith("video/")) {
          handleVideoFile(file)
        } else {
          toast({
            title: "Invalid file type",
            description: "Please drop a video file.",
            variant: "destructive",
          })
        }
      }
    }

    document.addEventListener("dragover", handleDragOver)
    document.addEventListener("dragleave", handleDragLeave)
    document.addEventListener("drop", handleDrop)

    return () => {
      document.removeEventListener("dragover", handleDragOver)
      document.removeEventListener("dragleave", handleDragLeave)
      document.removeEventListener("drop", handleDrop)
    }
  }, [])

  // 更新用户统计数据的函数
  const updateUserStats = useCallback(async (stats: { videosProcessed?: number; clipsCreated?: number }) => {
    try {
      const response = await fetch('/api/user-stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stats),
      })

      if (!response.ok) {
        console.error('Failed to update user stats')
      }
    } catch (error) {
      console.error('Error updating user stats:', error)
    }
  }, [])

  const handleVideoFile = useCallback((file: File) => {
    const url = URL.createObjectURL(file)
    setVideoSrc(url)
    setVideoName(file.name.replace(/\.[^/.]+$/, "")) // Remove extension
    setTimestamps([])
    setActiveTimestamp(null)

    // 预处理视频以优化性能
    if (videoRef.current) {
      // 设置较低的初始播放质量
      videoRef.current.style.imageRendering = 'auto';
      
      // 预先设置一个较低的回放速度，提高初始加载性能
      videoRef.current.defaultPlaybackRate = 1.0;
      
      // 设置视频预加载行为
      videoRef.current.preload = "metadata";
      
      // 优化视频初始大小
      videoRef.current.style.width = "100%";
      videoRef.current.style.height = "auto";
      
      // 监听视频加载完成事件，应用进一步优化
      const onLoadedMetadata = () => {
        // 检查视频分辨率，对高分辨率视频应用更强的优化
        if (videoRef.current) {
          const { videoWidth, videoHeight } = videoRef.current;
          
          if (videoWidth > 1280 || videoHeight > 720) {
            // 高分辨率视频，应用更强的优化
            videoRef.current.style.imageRendering = 'pixelated';
            
            // 告知用户正在优化高分辨率视频
            toast({
              title: "高分辨率视频",
              description: "已自动应用性能优化以提高播放流畅度",
            });
          }
        }
      };
      
      videoRef.current.addEventListener('loadedmetadata', onLoadedMetadata);
      
      // 返回清理函数
      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener('loadedmetadata', onLoadedMetadata);
        }
      };
    }

    // 更新视频处理计数
    updateUserStats({ videosProcessed: 1 })
  }, [updateUserStats])

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        handleVideoFile(file)
      }
    },
    [handleVideoFile],
  )

  const handleStartTimestamp = useCallback(() => {
    if (!videoRef.current) return

    const currentTime = videoRef.current.currentTime
    const id = crypto.randomUUID()

    setTimestamps((prev) => [
      ...prev,
      {
        id,
        startTime: currentTime,
        endTime: null,
        label: `Timestamp ${prev.length + 1}`,
      },
    ])

    setActiveTimestamp(id)

    toast({
      title: "Recording started",
      description: "Click 'End Recording' when you want to finish this timestamp.",
    })
  }, [])

  const handleEndTimestamp = useCallback(() => {
    if (!videoRef.current || !activeTimestamp) return

    const currentTime = videoRef.current.currentTime

    setTimestamps((prev) =>
      prev.map((timestamp) => (timestamp.id === activeTimestamp ? { ...timestamp, endTime: currentTime } : timestamp)),
    )

    setActiveTimestamp(null)

    toast({
      title: "Recording ended",
      description: "Timestamp saved successfully.",
    })
  }, [activeTimestamp])

  const updateTimestampLabel = useCallback((id: string, label: string) => {
    setTimestamps((prev) => prev.map((timestamp) => (timestamp.id === id ? { ...timestamp, label } : timestamp)))
  }, [])

  const deleteTimestamp = useCallback(
    (id: string) => {
      setTimestamps((prev) => prev.filter((timestamp) => timestamp.id !== id))
      if (activeTimestamp === id) {
        setActiveTimestamp(null)
      }
    },
    [activeTimestamp],
  )

  const seekToTime = useCallback((time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time
      videoRef.current.play()
    }
  }, [])

  // Format time for filenames
  const formatTimeForFilename = useCallback((time: number) => {
    return `${time.toFixed(1)}s`
  }, [])

  // New functions for clip extraction and export
  const prepareClipExtraction = useCallback(
    (id: string) => {
      const timestamp = timestamps.find((t) => t.id === id)
      if (!timestamp || timestamp.endTime === null) return

      setSelectedTimestamp(id)
      // Format filename: videoname_jump_index_starttime-endtime
      const index = timestamps.findIndex((t) => t.id === id) + 1
      setClipName(
        `${videoName}_jump_${index}_${formatTimeForFilename(timestamp.startTime)}-${formatTimeForFilename(timestamp.endTime)}`,
      )
    },
    [timestamps, videoName, formatTimeForFilename],
  )

  const extractClip = useCallback(async () => {
    if (!videoRef.current || !selectedTimestamp) return

    const timestamp = timestamps.find((t) => t.id === selectedTimestamp)
    if (!timestamp || timestamp.endTime === null) return

    // 在处理前应用性能优化
    applyPerformanceMode()

    try {
      // 显示处理中提示
      toast({
        title: "准备提取剪辑",
        description: "正在准备视频数据，请稍候...",
      })

      // Set video to start time
      videoRef.current.currentTime = timestamp.startTime

      // 性能优化：使用超低质量设置来提高性能
      const lowQualityOptions = {
        videoBitsPerSecond: 500000, // 进一步降低比特率
        mimeType: MediaRecorder.isTypeSupported("video/mp4") ? "video/mp4" : "video/webm"
      }
      const fileExtension = lowQualityOptions.mimeType === "video/mp4" ? "mp4" : "webm"

      // Create a MediaRecorder to capture the video output
      const stream = videoRef.current?.captureStream
        ? videoRef.current.captureStream()
        : videoRef.current?.mozCaptureStream?.()

      if (!stream) {
        toast({
          title: "Browser not supported",
          description: "Your browser doesn't support video capture. Try using Chrome or Firefox.",
          variant: "destructive",
        })
        return
      }

      // 性能优化：限制视频轨道的分辨率
      const videoTracks = stream.getVideoTracks()
      if (videoTracks.length > 0) {
        try {
          const settings = videoTracks[0].getSettings()
          // 尝试应用约束以降低分辨率
          await videoTracks[0].applyConstraints({
            width: { ideal: 640 },
            height: { ideal: 360 },
            frameRate: { ideal: 15 }
          })
        } catch (e) {
          console.warn("无法应用视频约束:", e)
        }
      }

      mediaRecorderRef.current = new MediaRecorder(stream, lowQualityOptions)
      chunksRef.current = []

      // 性能优化：增加数据可用性事件的时间间隔，减少事件触发频率
      mediaRecorderRef.current.ondataavailable = (e) => {
        chunksRef.current.push(e.data)
      }

      mediaRecorderRef.current.onstop = () => {
        // 显示处理中提示
        toast({
          title: "正在处理视频",
          description: "正在生成剪辑文件，请稍候...",
        })

        // 使用setTimeout延迟处理，让UI有机会更新
        setTimeout(() => {
          const blob = new Blob(chunksRef.current, { type: lowQualityOptions.mimeType })
          const url = URL.createObjectURL(blob)

          // Create download link
          const a = document.createElement("a")
          a.href = url
          a.download = `${clipName}.${fileExtension}`
          a.click()

          // Clean up
          URL.revokeObjectURL(url)
          chunksRef.current = [] // 清空数组释放内存
          setSelectedTimestamp(null)

          toast({
            title: "Clip extracted",
            description: `Clip saved as ${clipName}.${fileExtension}`,
          })

          // 更新剪辑创建计数
          updateUserStats({ clipsCreated: 1 })
        }, 100) // 短暂延迟让UI有机会更新
      }

      // 性能优化：使用更大的时间片段减少处理开销和事件触发频率
      mediaRecorderRef.current.start(2000) // 每2秒触发一次dataavailable事件
      videoRef.current.play()

      // Stop recording after the clip duration
      const duration = timestamp.endTime - timestamp.startTime
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
          mediaRecorderRef.current.stop()
          videoRef.current?.pause()
        }
      }, duration * 1000)

      toast({
        title: "Extracting clip",
        description: `Your clip is being prepared for download as ${fileExtension.toUpperCase()}.`,
      })
    } catch (error) {
      console.error("Error extracting clip:", error)
      toast({
        title: "Error extracting clip",
        description: "There was a problem extracting your clip. This feature may not be supported in your browser.",
        variant: "destructive",
      })
    }
  }, [selectedTimestamp, timestamps, clipName, updateUserStats, applyPerformanceMode])

  // Modify the extractAllClips function to check for Pro access
  const extractAllClips = useCallback(async () => {
    // Check if user has Pro access
    if (!hasAccess("pro")) {
      toast({
        title: "Premium Feature",
        description: "Batch clip extraction is available on the Pro plan or higher.",
        variant: "destructive",
      })
      return
    }

    // 在批量处理前应用性能优化
    applyPerformanceMode()

    const clipsToExtract = timestamps.filter((t) => t.endTime !== null)

    if (clipsToExtract.length === 0) {
      toast({
        title: "No clips to extract",
        description: "You need to have timestamps with both start and end times to extract clips.",
        variant: "destructive",
      })
      return
    }

    // 性能优化：预先计算所有剪辑信息，减少处理过程中的计算
    const clipsInfo = clipsToExtract.map((timestamp, index) => {
      return {
        timestamp,
        index,
        clipFileName: `${videoName}_jump_${index + 1}_${formatTimeForFilename(timestamp.startTime)}-${formatTimeForFilename(timestamp.endTime || 0)}`,
        duration: timestamp.endTime! - timestamp.startTime
      }
    })

    try {
      setIsExtractingAll(true)
      extractionCancelRef.current = false

      // 使用低质量设置来提高性能
      const lowQualityOptions = {
        videoBitsPerSecond: 1000000, // 降低比特率
        mimeType: exportFormat === "mp4" && MediaRecorder.isTypeSupported("video/mp4") ? "video/mp4" : "video/webm"
      }
      const fileExtension = lowQualityOptions.mimeType === "video/mp4" ? "mp4" : "webm"

      for (let i = 0; i < clipsInfo.length; i++) {
        // Check if cancelled
        if (extractionCancelRef.current) {
          toast({
            title: "Extraction cancelled",
            description: `Extracted ${i} of ${clipsInfo.length} clips before cancellation.`,
          })
          break
        }

        const { timestamp, clipFileName, duration, index } = clipsInfo[i]
        setExtractionProgress({ current: i + 1, total: clipsInfo.length })

        // Wait for video to be ready
        if (!videoRef.current) continue

        // Set video to start time
        videoRef.current.currentTime = timestamp.startTime

        // 性能优化：降低视频捕获帧率和质量
        const stream = videoRef.current?.captureStream
          ? videoRef.current.captureStream()
          : videoRef.current?.mozCaptureStream?.()

        if (!stream) {
          toast({
            title: "Browser not supported",
            description: "Your browser doesn't support video capture. Try using Chrome or Firefox.",
            variant: "destructive",
          })
          setIsExtractingAll(false)
          return
        }

        // 性能优化：限制视频轨道的分辨率
        const videoTracks = stream.getVideoTracks()
        if (videoTracks.length > 0) {
          try {
            const settings = videoTracks[0].getSettings()
            // 尝试应用约束以降低分辨率
            await videoTracks[0].applyConstraints({
              width: { ideal: 640 },
              height: { ideal: 360 },
              frameRate: { ideal: 15 }
            })
          } catch (e) {
            console.warn("无法应用视频约束:", e)
          }
        }

        // Create a promise to handle the clip extraction
        await new Promise<void>((resolve) => {
          mediaRecorderRef.current = new MediaRecorder(stream, lowQualityOptions)
          chunksRef.current = []

          // 性能优化：增加数据可用性事件的时间间隔，减少事件触发频率
          mediaRecorderRef.current.ondataavailable = (e) => {
            chunksRef.current.push(e.data)
          }

          mediaRecorderRef.current.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: lowQualityOptions.mimeType })
            const url = URL.createObjectURL(blob)

            // Create download link
            const a = document.createElement("a")
            a.href = url
            a.download = `${clipFileName}.${fileExtension}`
            a.click()

            // Clean up
            URL.revokeObjectURL(url)
            chunksRef.current = [] // 清空数组释放内存
            resolve()
          }

          // 性能优化：使用较大的时间片段减少处理开销
          mediaRecorderRef.current.start(1000) // 每秒触发一次dataavailable事件
          videoRef.current!.play()

          // Stop recording after the clip duration
          setTimeout(() => {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
              mediaRecorderRef.current.stop()
              videoRef.current?.pause()
            }
          }, duration * 1000)
        })

        // 性能优化：在处理下一个剪辑前进行垃圾回收
        if (window.gc) {
          try {
            window.gc()
          } catch (e) {
            console.warn("手动垃圾回收失败", e)
          }
        }

        // 性能优化：增加更长的延迟，让浏览器有充分时间进行垃圾回收
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // 主动释放不再需要的资源
        if (mediaRecorderRef.current) {
          mediaRecorderRef.current = null
        }

        // 强制进行一次垃圾回收
        if (window.gc) {
          try {
            window.gc()
          } catch (e) {
            console.warn("手动垃圾回收失败", e)
          }
        }
      }

      if (!extractionCancelRef.current) {
        toast({
          title: "All clips extracted",
          description: `Successfully extracted ${clipsInfo.length} clips as ${exportFormat.toUpperCase()}.`,
        })

        // 更新剪辑创建计数（修复重复调用的问题）
        updateUserStats({ clipsCreated: clipsInfo.length })

        // 性能优化：清理资源
        if (mediaRecorderRef.current) {
          mediaRecorderRef.current = null
        }
        chunksRef.current = []
      }
    } catch (error) {
      console.error("Error extracting clips:", error)
      toast({
        title: "Error extracting clips",
        description: "There was a problem extracting your clips.",
        variant: "destructive",
      })
    } finally {
      setIsExtractingAll(false)
    }
  }, [timestamps, videoName, formatTimeForFilename, exportFormat, hasAccess, updateUserStats, applyPerformanceMode])

  const cancelExtraction = useCallback(() => {
    extractionCancelRef.current = true
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop()
    }
    videoRef.current?.pause()
    toast({
      title: "Cancelling extraction",
      description: "Extraction will stop after the current clip completes.",
    })
  }, [])

  const exportTimestamps = useCallback(
    (format: "csv" | "json") => {
      if (!timestamps.length) {
        toast({
          title: "No timestamps to export",
          description: "Record some timestamps first before exporting.",
          variant: "destructive",
        })
        return
      }

      let content: string
      let mimeType: string
      let filename: string

      if (format === "csv") {
        // Create CSV content
        const headers = "video,jump_number,start_time,end_time,duration,output_file\n"
        const rows = timestamps
          .map((t, index) => {
            const duration = t.endTime !== null ? (t.endTime - t.startTime).toFixed(2) : ""
            const startTimeFormatted = `${t.startTime.toFixed(2)}s`
            const endTimeFormatted = t.endTime !== null ? `${t.endTime.toFixed(2)}s` : "N/A"
            const durationFormatted = duration ? `${duration}s` : "N/A"
            // Create output_file format
            const outputFile =
              t.endTime !== null
                ? `${videoName}_jump_${index + 1}_${t.startTime.toFixed(1)}s-${t.endTime.toFixed(1)}s.${exportFormat}`
                : "No jump detected"
            return `${videoName},"${index + 1}",${startTimeFormatted},${endTimeFormatted},${durationFormatted},"${outputFile}"`
          })
          .join("\n")

        content = headers + rows
        mimeType = "text/csv"
        filename = `${videoName || "jump_detection_summary"}.csv`
      } else {
        // Create JSON format
        const jsonData = {
          videoName: videoName,
          jumps: timestamps
            .filter((t) => t.endTime !== null)
            .map((t, index) => ({
              number: index + 1,
              startTime: t.startTime,
              endTime: t.endTime,
              duration: t.endTime !== null ? t.endTime - t.startTime : 0,
            })),
        }

        content = JSON.stringify(jsonData, null, 2)
        mimeType = "application/json"
        filename = `${videoName || "timestamps"}_jumps.json`
      }

      // Create download link
      const blob = new Blob([content], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      a.click()

      // Clean up
      URL.revokeObjectURL(url)

      toast({
        title: `Timestamps exported as ${format.toUpperCase()}`,
        description: `File saved as ${filename}`,
      })
    },
    [timestamps, videoName, exportFormat],
  )

  const handleTimeUpdate = useCallback((time: number) => {
    setCurrentVideoTime(time)
  }, [])

  // Modify the return JSX to implement feature gating
  return (
    <div
      className={`relative ${isDragging ? 'after:absolute after:inset-0 after:bg-zinc-950/20 after:backdrop-blur-sm after:z-50 after:border-2 after:border-dashed after:border-zinc-400 after:rounded-lg after:flex after:items-center after:justify-center after:text-zinc-100 after:text-xl after:pointer-events-none after:content-["Drop_video_file_here"]' : ""}`}
    >
      <Tabs defaultValue="record" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="record">Record</TabsTrigger>
            <TabsTrigger value="extract">Extract</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
            <TabsTrigger value="ai">AI Tools</TabsTrigger>
            <TabsTrigger value="batch">Batch</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Settings className="h-3.5 w-3.5" />
                  <span className="text-xs">性能模式</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>视频性能选项</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup 
                  value={performanceMode} 
                  onValueChange={(value) => setPerformanceMode(value as "balanced" | "performance" | "quality")}
                >
                  <DropdownMenuRadioItem value="quality">质量优先</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="balanced">平衡模式</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="performance">性能优先</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={() => setShowKeyboardShortcuts(true)} className="gap-1.5">
                    <Keyboard className="h-3.5 w-3.5" />
                    <span className="text-xs">Shortcuts</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View keyboard shortcuts</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <TabsContent value="record" className="mt-0">
          <Card className="border-zinc-200 bg-white/90 backdrop-blur-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-900/90">
            <CardHeader>
              <CardTitle className="text-zinc-800 dark:text-zinc-200">Record Timestamps</CardTitle>
              <CardDescription className="text-zinc-600 dark:text-zinc-400">
                Upload a video and record timestamps for important moments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!videoSrc ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 p-8">
                  <FileVideo className="mb-4 h-10 w-10 text-zinc-500 dark:text-zinc-400" />
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">No video selected</p>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500 text-center max-w-md">
                    Upload a video to start recording timestamps. You can also drag and drop a video file here.
                  </p>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-700 dark:hover:bg-indigo-600"
                  >
                    <FileVideo className="mr-2 h-4 w-4" />
                    Select Video
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <VideoPlayer
                      ref={videoRef}
                      src={videoSrc}
                      timestamps={timestamps}
                      activeTimestamp={activeTimestamp}
                      onTimeUpdate={handleTimeUpdate}
                    />

                    <div className="flex flex-wrap gap-2">
                      {activeTimestamp ? (
                        <Button
                          onClick={handleEndTimestamp}
                          className="bg-rose-600 hover:bg-rose-700 text-white dark:bg-rose-700 dark:hover:bg-rose-600"
                        >
                          End Recording
                        </Button>
                      ) : (
                        <Button
                          onClick={handleStartTimestamp}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-700 dark:hover:bg-indigo-600"
                        >
                          Start Recording
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        onClick={() => {
                          setVideoSrc(null)
                          setTimestamps([])
                          setActiveTimestamp(null)
                        }}
                      >
                        Change Video
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Timestamps</h3>
                    <TimestampList
                      timestamps={timestamps}
                      onLabelChange={updateTimestampLabel}
                      onDelete={deleteTimestamp}
                      onSeek={seekToTime}
                      activeTimestamp={activeTimestamp}
                      onExtractClip={prepareClipExtraction}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="extract" className="mt-0">
          <Card className="border-zinc-200 bg-white/90 backdrop-blur-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-900/90">
            <CardHeader>
              <CardTitle className="text-zinc-800 dark:text-zinc-200">Extract Clips</CardTitle>
              <CardDescription className="text-zinc-600 dark:text-zinc-400">
                Extract video clips from your timestamps
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!videoSrc ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 p-8">
                  <FileVideo className="mb-4 h-10 w-10 text-zinc-500 dark:text-zinc-400" />
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">No video loaded</p>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500 text-center max-w-md">
                    Import a video first to extract clips
                  </p>
                </div>
              ) : timestamps.filter((t) => t.endTime !== null).length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 p-8">
                  <Scissors className="mb-4 h-10 w-10 text-zinc-500 dark:text-zinc-400" />
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">No complete timestamps</p>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500 text-center max-w-md">
                    Record timestamps with both start and end times to extract clips
                  </p>
                </div>
              ) : !browserSupport.captureStream ? (
                <Alert variant="destructive" className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Browser compatibility issue</AlertTitle>
                  <AlertDescription>
                    Your browser doesn't support video capture. Clip extraction will not work. Please try Chrome or
                    Firefox.
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  <div className="mb-6">
                    <Alert className="mb-4">
                      <Info className="h-4 w-4" />
                      <AlertTitle>About clip extraction</AlertTitle>
                      <AlertDescription>
                        Clips are extracted using your browser's built-in capabilities. The quality may vary depending
                        on your browser and system performance.
                      </AlertDescription>
                    </Alert>

                    <div className="grid gap-4">
                      <div>
                        <Label className="text-zinc-800 dark:text-zinc-200 mb-2 block">Export Format</Label>
                        <RadioGroup
                          value={exportFormat}
                          onValueChange={(value: string) => setExportFormat(value as "mp4" | "webm")}
                          className="flex flex-col space-y-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="mp4" id="mp4" disabled={!browserSupport.mp4Support} />
                            <Label
                              htmlFor="mp4"
                              className={`text-sm font-normal ${!browserSupport.mp4Support ? "text-zinc-400 dark:text-zinc-600" : ""}`}
                            >
                              MP4 {browserSupport.mp4Support ? "(Recommended)" : "(Not supported in your browser)"}
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="webm" id="webm" />
                            <Label htmlFor="webm" className="text-sm font-normal">
                              WebM (Universal support)
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <PremiumFeature requiredTier="pro">
                        <Button
                          onClick={extractAllClips}
                          disabled={isExtractingAll || timestamps.filter((t) => t.endTime !== null).length === 0}
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-700 dark:hover:bg-indigo-600"
                        >
                          {isExtractingAll ? (
                            <>
                              Extracting {extractionProgress.current}/{extractionProgress.total}...
                            </>
                          ) : (
                            <>
                              <Download className="mr-2 h-4 w-4" />
                              Extract All Clips
                            </>
                          )}
                        </Button>
                      </PremiumFeature>

                      {isExtractingAll && (
                        <div className="mt-2">
                          <Progress
                            value={(extractionProgress.current / extractionProgress.total) * 100}
                            className="h-2 mb-2"
                          />
                          <div className="flex justify-between">
                            <span className="text-xs text-zinc-600 dark:text-zinc-400">
                              {((extractionProgress.current / extractionProgress.total) * 100).toFixed(0)}%
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={cancelExtraction}
                              className="h-6 px-2 text-rose-600 hover:text-rose-700 hover:bg-rose-100 dark:text-rose-500 dark:hover:text-rose-400 dark:hover:bg-rose-900/50"
                            >
                              <X className="h-3 w-3 mr-1" /> Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div>
                    <h3 className="text-sm font-medium mb-2 text-zinc-800 dark:text-zinc-200">Individual Clips</h3>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                      {timestamps
                        .filter((t) => t.endTime !== null)
                        .map((timestamp, index) => (
                          <div
                            key={timestamp.id}
                            className="flex items-center justify-between p-2 border border-zinc-200 dark:border-zinc-800 rounded-md"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">
                                {timestamp.label}
                              </p>
                              <p className="text-xs text-zinc-500 dark:text-zinc-500">
                                Duration: {(timestamp.endTime! - timestamp.startTime).toFixed(2)}s
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => prepareClipExtraction(timestamp.id)}
                              className="ml-2 text-xs"
                            >
                              <Scissors className="h-3 w-3 mr-1" />
                              Extract
                            </Button>
                          </div>
                        ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="mt-0">
          <Card className="border-zinc-200 bg-white/90 backdrop-blur-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-900/90">
            <CardHeader>
              <CardTitle className="text-zinc-800 dark:text-zinc-200">Export Timestamps</CardTitle>
              <CardDescription className="text-zinc-600 dark:text-zinc-400">
                Export your timestamps to CSV or JSON format
              </CardDescription>
            </CardHeader>
            <CardContent>
              {timestamps.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 p-8">
                  <FileSpreadsheet className="mb-4 h-10 w-10 text-zinc-500 dark:text-zinc-400" />
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">No timestamps to export</p>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500 text-center max-w-md">
                    Record some timestamps first before exporting
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-zinc-800 dark:text-zinc-200">CSV Format</h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-500">
                        Export as CSV for spreadsheet applications
                      </p>
                      <Button variant="outline" onClick={() => exportTimestamps("csv")} className="w-full">
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        Export as CSV
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-zinc-800 dark:text-zinc-200">JSON Format</h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-500">Export as JSON for programmatic use</p>
                      <Button variant="outline" onClick={() => exportTimestamps("json")} className="w-full">
                        <FileJson className="mr-2 h-4 w-4" />
                        Export as JSON
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium mb-2 text-zinc-800 dark:text-zinc-200">Timestamp Summary</h3>
                    <div className="rounded-md border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-zinc-100 dark:bg-zinc-800/50">
                            <th className="px-4 py-2 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">
                              #
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">
                              Label
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">
                              Start
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">
                              End
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">
                              Duration
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                          {timestamps.map((timestamp, index) => (
                            <tr key={timestamp.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                              <td className="px-4 py-2 text-zinc-700 dark:text-zinc-300">{index + 1}</td>
                              <td className="px-4 py-2 text-zinc-700 dark:text-zinc-300">{timestamp.label}</td>
                              <td className="px-4 py-2 text-zinc-700 dark:text-zinc-300">
                                {timestamp.startTime.toFixed(2)}s
                              </td>
                              <td className="px-4 py-2 text-zinc-700 dark:text-zinc-300">
                                {timestamp.endTime !== null ? `${timestamp.endTime.toFixed(2)}s` : "—"}
                              </td>
                              <td className="px-4 py-2 text-zinc-700 dark:text-zinc-300">
                                {timestamp.endTime !== null
                                  ? `${(timestamp.endTime - timestamp.startTime).toFixed(2)}s`
                                  : "—"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog for clip extraction */}
      <Dialog open={selectedTimestamp !== null} onOpenChange={(open) => !open && setSelectedTimestamp(null)}>
        <DialogContent className="bg-white/95 backdrop-blur-sm border-zinc-200 dark:bg-zinc-900/95 dark:border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-zinc-800 dark:text-zinc-200">Extract Video Clip</DialogTitle>
            <DialogDescription className="text-zinc-600 dark:text-zinc-400">
              Name your clip and click extract to save it to your device.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="clip-name" className="text-zinc-800 dark:text-zinc-200">
                Clip Name
              </Label>
              <Input id="clip-name" value={clipName} onChange={(e) => setClipName(e.target.value)} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedTimestamp(null)}>
              Cancel
            </Button>
            <Button
              onClick={extractClip}
              className="bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-700 dark:hover:bg-indigo-600"
            >
              <Scissors className="mr-2 h-4 w-4" />
              Extract Clip
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for format selection */}
      <Dialog open={showFormatDialog} onOpenChange={setShowFormatDialog}>
        <DialogContent className="bg-white/95 backdrop-blur-sm border-zinc-200 dark:bg-zinc-900/95 dark:border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-zinc-800 dark:text-zinc-200">Extract All Clips</DialogTitle>
            <DialogDescription className="text-zinc-600 dark:text-zinc-400">
              Choose a format for the extracted clips.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label className="text-zinc-800 dark:text-zinc-200">Export Format</Label>
              <RadioGroup
                value={exportFormat}
                onValueChange={(value: string) => setExportFormat(value as "mp4" | "webm")}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mp4" id="format-mp4" disabled={!browserSupport.mp4Support} />
                  <Label
                    htmlFor="format-mp4"
                    className={`text-sm font-normal ${!browserSupport.mp4Support ? "text-zinc-400 dark:text-zinc-600" : ""}`}
                  >
                    MP4 {browserSupport.mp4Support ? "(Recommended)" : "(Not supported in your browser)"}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="webm" id="format-webm" />
                  <Label htmlFor="format-webm" className="text-sm font-normal">
                    WebM (Universal support)
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFormatDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowFormatDialog(false)
                extractAllClips()
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-700 dark:hover:bg-indigo-600"
            >
              <Download className="mr-2 h-4 w-4" />
              Extract All Clips
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for keyboard shortcuts */}
      <Dialog open={showKeyboardShortcuts} onOpenChange={setShowKeyboardShortcuts}>
        <DialogContent className="bg-white/95 backdrop-blur-sm border-zinc-200 dark:bg-zinc-900/95 dark:border-zinc-800 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-zinc-800 dark:text-zinc-200">Keyboard Shortcuts</DialogTitle>
            <DialogDescription className="text-zinc-600 dark:text-zinc-400">
              Use these shortcuts to work more efficiently.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Timestamp Controls</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-zinc-600 dark:text-zinc-400">Start recording</div>
                <div className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">Ctrl + B</div>

                <div className="text-zinc-600 dark:text-zinc-400">End recording</div>
                <div className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">Ctrl + E</div>

                <div className="text-zinc-600 dark:text-zinc-400">Import video</div>
                <div className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">Ctrl + O</div>
              </div>

              <h3 className="text-sm font-medium text-zinc-800 dark:text-zinc-200 pt-2">Video Controls</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-zinc-600 dark:text-zinc-400">Play/Pause</div>
                <div className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">Space or K</div>

                <div className="text-zinc-600 dark:text-zinc-400">Skip backward 10s</div>
                <div className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">J or ←</div>

                <div className="text-zinc-600 dark:text-zinc-400">Skip forward 10s</div>
                <div className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">L or →</div>

                <div className="text-zinc-600 dark:text-zinc-400">Mute/Unmute</div>
                <div className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">M</div>

                <div className="text-zinc-600 dark:text-zinc-400">Fullscreen</div>
                <div className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">F</div>

                <div className="text-zinc-600 dark:text-zinc-400">Volume up</div>
                <div className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">↑</div>

                <div className="text-zinc-600 dark:text-zinc-400">Volume down</div>
                <div className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">↓</div>

                <div className="text-zinc-600 dark:text-zinc-400">Show shortcuts</div>
                <div className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">?</div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setShowKeyboardShortcuts(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

